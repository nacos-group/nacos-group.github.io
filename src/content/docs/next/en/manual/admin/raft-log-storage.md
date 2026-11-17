---
title: Raft Log Storage
keywords: [Nacos, Raft, JRaft, RocksDB, File Log, Storage, Recovery]
description: A detailed guide to Nacos Raft log backend selection, configuration and deployment validation, file formats, write and recovery workflows, platform requirements, backups, and troubleshooting.
sidebar:
  order: 7
---

# Raft Log Storage

The Nacos Raft protocol supports `rocksdb` and `file` log storage backends, with `rocksdb` as the default. The `file` backend stores Raft logs in segment files and provides log validation and restart recovery.

Backend selection affects Raft logs only. Raft metadata, snapshot storage, and log entry encoding and decoding continue to use the JRaft defaults. Raft majority commit and state machine application semantics remain unchanged. This setting does not replace Derby or the external database used by Config Center.

This guide is for users deploying and maintaining Nacos Server. Configuration and deployment procedures cover routine operations; file formats and internal interfaces explain recovery behavior and support diagnosis. They are not new public APIs.

| Component | Behavior with `file` Selected |
| --- | --- |
| Raft log storage | Uses `FileLogStorage` to manage logs through Segments, a Manifest, and Indexes. |
| Raft metadata storage | Continues to use the JRaft default to store metadata such as terms and votes. |
| Raft snapshot storage | Continues to use the JRaft default for state machine snapshots and log truncation. |
| Log entry encoding and decoding | Continues to use the default JRaft codec, with its output wrapped in file log records. |
| Replication, elections, and majority commit | Continue to be handled by the JRaft protocol. |
| Config Center database | Keeps the existing Derby or external database configuration. |

The default RocksDB backend selection and existing data layout remain unchanged. Evaluate the file backend against the target filesystem, synchronous write costs, and recovery drills. The backend name alone does not establish performance or resource usage.

## 1. Configure the Backend

### 1.1. Configuration Properties

Set the following properties in `${nacos.home}/conf/application.properties` on Nacos Server:

| Property | Description | Default |
| --- | --- | --- |
| `nacos.core.protocol.raft.data.log_storage_type` | Log backend: `rocksdb` or `file`. Leading and trailing whitespace is trimmed and case is ignored. Empty, whitespace-only, or other values fail Raft initialization. | `rocksdb` |
| `nacos.core.protocol.raft.data.sync` | Whether to write logs synchronously. Must be `true` when using `file`. | `true` |
| `nacos.core.protocol.raft.data.sync_meta` | Synchronization option passed to the default Raft metadata storage. Cannot replace the `sync=true` requirement for `file`. | `false` |

The `data` segment is part of the Raft configuration map and must not be omitted. `nacos.core.protocol.raft.log_storage_type` is not equivalent to the property documented here.

### 1.2. Use File Log Storage

Configure Server nodes in a new deployment:

```properties
nacos.core.protocol.raft.data.log_storage_type=file
nacos.core.protocol.raft.data.sync=true
```

`sync` already defaults to `true`; the example sets it explicitly to make deployment checks easier. Do not change the file backend's `sync` to `false` to reduce write latency.

### 1.3. Keep the Default RocksDB Backend

No additional configuration is needed. You can also select it explicitly:

```properties
nacos.core.protocol.raft.data.log_storage_type=rocksdb
```

### 1.4. Property Combinations and When They Take Effect

| Backend Configuration | `sync` | Result |
| --- | --- | --- |
| Not configured | Not configured | Uses `rocksdb`, with synchronous writes enabled by default. |
| `rocksdb` | `true` | Uses the default RocksDB backend with synchronous writes. |
| `file` | Not configured or `true` | Initializes the file backend with synchronous writes. |
| `file` | `false` | Fails initialization with `File Raft log storage requires sync=true`. |
| Empty, whitespace-only, or an unsupported name | Any | Fails initialization with `IllegalArgumentException`. |

Backend values are matched after trimming leading and trailing whitespace and ignoring case, so `FILE` is equivalent to `file`. Use lowercase for consistent configuration. Omitting the property and explicitly setting it to an empty value have different meanings.

The backend is selected during Raft initialization, before the Raft runtime starts. The selected factory applies to every Raft group created on the current node, including groups created later. Selecting a backend per group or switching it at runtime is not supported. Editing the configuration file does not automatically change an open log store's implementation.

`sync_meta` is an option passed to the default metadata store. Setting it to `true` does not make the combination of `file` and `sync=false` valid. Final metadata and snapshot synchronization semantics remain controlled by the JRaft defaults.

:::caution[Changing the property does not migrate an existing node]
Backend selection does not convert existing logs, metadata, or snapshots. The separate `file-log` subdirectory isolates file backend data but provides no migration capability. Do not change the backend and restart an existing node in place, or treat switching back to `rocksdb` as a data rollback. Keep the original backend when upgrading an existing cluster. Before enabling `file` in a new deployment, validate filesystem capabilities and recovery behavior.
:::

## 2. Storage Directories

### 2.1. Layout and File Responsibilities

Each Raft group has its own directory. File log storage uses the following layout:

```text
${nacos.home}/data/protocol/raft/<group>/
├── log/
│   └── file-log/
│       ├── LOCK
│       ├── manifest
│       ├── manifest.tmp
│       ├── segments/
│       │   └── 00000000000000000001.seg
│       └── index/
│           └── 00000000000000000001.idx
├── meta-data/
└── snapshot/
```

| File or Directory | Purpose |
| --- | --- |
| `LOCK` | Acquires an exclusive directory lock to prevent multiple storage instances from opening the same directory. The presence of the file does not mean the lock is still held. |
| `manifest` | Stores the storage identity, group ID, and locally valid log range used for recovery validation. This range is not the Raft majority committed range. |
| `manifest.tmp` | Temporary file used to publish a new Manifest by atomically replacing `manifest`. |
| `segments/` | Stores segment files containing checksummed log records. |
| `index/` | Stores log position indexes, rebuilt from published logs during initialization. |
| `meta-data/`, `snapshot/` | Metadata and snapshot directories managed by the JRaft defaults. |

Before backing up, stop the node and back up its entire `data` directory and configuration to keep logs, metadata, and snapshots consistent. Do not copy, replace, or delete individual Manifest, Segment, or index files while the node is running, or mix files from different groups or storage instances.

### 2.2. Group and Storage Identities

File storage checks both the logical group ID and the local storage identity:

- `groupId`: comes from the JRaft initialization context and must match the group ID saved in the Manifest.
- `storeId`: a UUID generated when the Manifest is first created. Subsequent Segment headers must use the same identity.
- `segmentId`: the Segment number. Its header must match the Manifest description or the corresponding filename.

`storeId` is persisted with the files. Copying an entire store preserves its identity; changing the path does not automatically generate a new one. Do not edit Manifest identifiers to make a set of files appear to belong to another group or storage instance.

### 2.3. File Numbers and Implementation Limits

Segment and Index filenames use ASCII decimal numbers padded to 20 digits, with `.seg` and `.idx` suffixes. These numbers identify files and should not be interpreted as the index of the first log entry in a file.

Before cleanup, initialization determines the next number from the Manifest and canonical Segment filenames in the directory. Preserved Segments with unknown ownership also contribute to this calculation to avoid reusing their numbers. Number overflow fails initialization.

| Item | Current Implementation Limit | Notes |
| --- | --- | --- |
| File format version | `1` | Segments, log records, and the Manifest include a format version. |
| One Segment | 128 MiB | Includes a 40-byte header and log records; a new Segment is created when capacity is insufficient. |
| One file log record | 64 MiB | Includes a 16-byte header, the JRaft-encoded payload, and an 8-byte checksum. |
| One Manifest | 16 MiB | Includes the group ID and all retained Segment descriptors. |
| Group ID | At most 1024 UTF-8 bytes | Must be non-blank and correctly encodable. |
| One Index record | 12 bytes | An 8-byte record offset and a 4-byte total record length. |

These are implementation bounds; this change adds no user configuration properties for tuning them. The 64 MiB limit applies to a wrapped log record. It does not promise that configuration content or HTTP requests can reach that size; requests and business data remain subject to their own limits.

## 3. File Structure Design

The file backend combines Segments, a Manifest, and Indexes. Segments hold log records, the Manifest defines the valid log range, and Indexes map log indexes to record locations in Segments. Their relationship distinguishes data written to files, locally published logs, and rebuildable auxiliary data.

The file format version is `1`, and multibyte values use big-endian encoding. Offsets and lengths below are in bytes, with half-open ranges.

### 3.1. Segment: Log Segment Files

Segments hold the actual log records in the `segments/` directory. Each file consists of a fixed-length header followed by appended records. Each record is stored entirely within one Segment and is not split across files.

#### 3.1.1. File Organization and Rotation

One Segment has a maximum size of 128 MiB, including a 40-byte header. Appends use the current active Segment. If its remaining capacity cannot hold the next complete record, storage flushes and closes the old Segment and creates a new one. A batch append can span multiple Segments.

Segment file numbers are independent of log indexes. Manifest descriptors determine which logs a Segment retains, where reading starts, and where it ends. A file may therefore contain a truncated prefix or an unpublished tail; filenames and physical lengths alone do not establish the valid log range.

#### 3.1.2. Segment Header

Each Segment starts with a 40-byte header followed by log records:

| Offset | Length | Contents |
| --- | --- | --- |
| 0 | 4 | magic: `0x4e4c5331` (`NLS1`). |
| 4 | 2 | Format version. |
| 6 | 2 | Header length, fixed at 40. |
| 8 | 16 | UUID `storeId`, high 64 bits followed by low 64 bits. |
| 24 | 8 | `segmentId`, which must be greater than 0. |
| 32 | 8 | CRC64 covering `[0, 32)`. |

#### 3.1.3. Log Records and Validation

For a payload of length `L` after JRaft codec encoding, total record length is `24 + L`:

| Offset | Length | Contents |
| --- | --- | --- |
| 0 | 4 | magic: `0x4e4c5231` (`NLR1`). |
| 4 | 2 | Format version. |
| 6 | 2 | Header length, fixed at 16. |
| 8 | 4 | Payload length `L`. |
| 12 | 4 | CRC32 covering `[0, 12)`. |
| 16 | `L` | JRaft log entry payload. |
| `16 + L` | 8 | Payload CRC64. |

Reads validate the header, length, and record bounds before allocating a payload buffer. Decoded log indexes must be positive, terms non-negative, and entry types valid. Configuration entries also have membership validation. Recovery scanning requires entry indexes to match the expected contiguous positions.

CRC32 uses `java.util.zip.CRC32`, and CRC64 uses JRaft's `CrcUtil.crc64()`. Header checksums validate information such as length before payload reads, payload checksums detect corrupt record contents, and Segment header identity checks detect mixed files.

Checksums detect corruption but do not repair records. If a record in the published range fails validation, recovery cannot skip it and advance the log index.

### 3.2. Manifest: Valid Log Ranges and Publication State

The Manifest describes the current local log range. It stores the storage identity, group ID, global first and last indexes, and ordered Segment descriptors. Recovery and reads use these ranges as their reference.

Publication in the Manifest means that the file backend has completed the corresponding local range update. Raft majority commit, state machine application, and snapshot progress remain managed by the upper-layer protocol. The Manifest's last index cannot be treated directly as the business commit or apply position.

#### 3.2.1. Segment Descriptors

Each Segment descriptor contains the following five 8-byte integers:

| Field | Meaning |
| --- | --- |
| `segmentId` | The number of the corresponding Segment file. |
| `firstIndex` | The first log index currently retained in this Segment. |
| `lastIndex` | The last log index currently retained in this Segment. |
| `firstRecordOffset` | The byte offset of the first retained record in the Segment. |
| `publishedEndOffset` | The byte offset immediately after the published records. |

The valid byte range is `[firstRecordOffset, publishedEndOffset)`. Descriptor numbers must strictly increase, log ranges must be contiguous, and global first and last indexes must match the descriptors. After prefix truncation, the first valid record may be further beyond the Segment header; old records remaining at the start of the file do not remain readable.

An empty log range is represented as `[firstLogIndex, firstLogIndex - 1]`, with no Segment descriptors. Resetting the range preserves the starting point for subsequent appends without creating a placeholder entry.

#### 3.2.2. Manifest File Format

The Manifest contains a 52-byte fixed header, the UTF-8 group ID, ordered Segment descriptors, and a trailing CRC64. For a group ID encoded length of `G` and `N` Segments, total file length is `60 + G + 40N`.

| Offset | Length | Contents |
| --- | --- | --- |
| 0 | 4 | magic: `0x4e4c4d31` (`NLM1`). |
| 4 | 2 | Format version. |
| 6 | 2 | Header length, fixed at 52. |
| 8 | 4 | Total file length. |
| 12 | 16 | UUID `storeId`, high 64 bits followed by low 64 bits. |
| 28 | 8 | `firstLogIndex`. |
| 36 | 8 | `lastLogIndex`. |
| 44 | 4 | Group ID UTF-8 byte count `G`. |
| 48 | 4 | Segment descriptor count `N`. |
| 52 | `G` | UTF-8 group ID. |
| `52 + G` | `40N` | Ordered Segment descriptors. |
| `52 + G + 40N` | 8 | CRC64 covering all preceding bytes. |

Manifest reads check file length, format version, headers, checksums, group encoding, and log ranges. The group ID must be non-blank and at most 1024 UTF-8 bytes. Unsupported versions, invalid encoding, size mismatches, or discontinuous ranges cannot form a valid Manifest.

#### 3.2.3. Published and Temporary Files

`manifest` stores the current publication state; `manifest.tmp` prepares the next update. Publication first writes and flushes the temporary file, then atomically replaces the published file within the same directory. Section 4 describes the sequence.

An abnormal exit may leave the temporary file behind. Its presence does not establish that the previous operation succeeded, and it cannot replace the published Manifest as the recovery authority. Storage validates the published file and its referenced data before deciding what to clean up.

### 3.3. Index: Rebuildable Position Indexes

Indexes reside in `index/` and use the same numbers as their corresponding Segments. They map log indexes to physical record locations so reads do not need to scan a Segment from the start each time.

#### 3.3.1. Index Layout and Slot Calculation

Indexes have no file header. Each record occupies 12 bytes:

| Offset within Record | Length | Contents |
| --- | --- | --- |
| 0 | 8 | The log record's byte offset within the Segment. |
| 8 | 4 | Total log record length, including header, payload, and checksum. |

With the Segment's first retained log as `baseIndex`, a target log's index slot offset is `(logIndex - baseIndex) × 12`. For example, with `baseIndex=100`, the index record for log `index=102` starts at byte 24 of the `.idx` file. The offset stored in that record gives the log's location in the `.seg` file.

Index file length must match the number of retained entries in the Segment. Slot calculations, record end offsets, and subsequent indexes use overflow checks to prevent corrupt values from crossing file boundaries.

#### 3.3.2. Log Read Workflow

To read one log entry, storage performs these steps:

1. Check the target index against the Manifest's global range. Out-of-range indexes do not proceed to record lookup.
2. Locate the containing Segment in the ordered descriptors and determine its retained range.
3. Read the Index slot and verify record length and byte bounds against the Manifest's published range.
4. Read the Segment record, validate its header, payload checksum, and encoding, and confirm that the decoded index matches the requested index.

Editing an Index alone therefore cannot extend the valid log range, and its offsets and lengths cannot bypass Segment record validation.

#### 3.3.3. Index Rebuilding and Maintenance

Indexes are derived from Segments. Initialization scans all published Segments and rebuilds Indexes from validated retained records. Operations such as prefix truncation also adjust or rebuild Indexes according to the new boundaries.

Appends update Indexes alongside log records, but local publication does not depend on flushing Indexes. Segments and the Manifest together define the log contents and valid ranges needed for durability and recovery.

Rebuildability does not permit periodically deleting Indexes on a running node to save space. The store still holds active index resources and manages reclamation itself. Manual deletion, splicing, or replacement can break consistency between resources and disk state.

## 4. Persistence Design

The file backend orders persistence by writing and flushing logs before publishing their Manifest range. Appends, truncations, and resets follow this publication boundary. Failure handling distinguishes validation from operations that have begun actual file mutations.

### 4.1. Local Publication and Consistency Boundaries

Persistence has three distinct stages:

| Stage | Meaning |
| --- | --- |
| Records present in a Segment | Record bytes have been written but may still belong to an unpublished tail. |
| A range published by the Manifest | The file backend has updated the locally valid range; recovery validates its referenced records. |
| Raft majority commit and state machine application | JRaft replication, commit, and application determine business-visible results. |

The Manifest explicitly stores retained ranges and byte boundaries rather than inferring validity from the largest index in a file or a Segment's physical length. Recovery can consequently identify unfinished appends and finish truncation and reclamation after a range update.

Log indexes, Segment numbers, and file offsets have bounds and overflow checks. Do not bypass validation failures by enlarging Manifest ranges or changing Indexes.

### 4.2. Batch Appends and Atomic Publication

The file backend validates the entire batch before writing files. Log indexes must be contiguous from the position after the current last index, each record must fit in an empty Segment, and the planned Manifest must satisfy format and size limits.

After validation, the batch follows this sequence:

1. Append log records to the active Segment and write the Index alongside them.
2. Flush the old Segment and create a new one when capacity is insufficient. Flush the final Segment after the batch is written.
3. Synchronize the `segments` directory if the new Manifest references newly created Segments.
4. Write `manifest.tmp` and execute `force(true)` on the temporary file.
5. Replace `manifest` using an atomic move within the same directory.
6. Synchronize the `file-log` directory, update the in-memory Manifest, and complete local range publication.

Directory synchronization follows the platform rules in Sections 4.4 and 4.6. Indexes are derived data; publication does not depend on flushing them. Recovery rebuilds them by scanning published Segments.

A record's presence in a Segment does not mean it has been published by the Manifest. Manifest publication also does not mean the log has been committed by a Raft majority or applied to the state machine. Determine business operation success from the upper-layer protocol and business API results.

### 4.3. Range Updates, Log Truncation, and Snapshots

Snapshots and replication conflict handling may trigger prefix truncation, suffix truncation, or a log range reset. The following are internal JRaft storage interface semantics; users do not need to invoke them through HTTP or an SDK:

| Internal Operation | Retained Range and Behavior |
| --- | --- |
| `truncatePrefix(firstIndexKept)` | Retains the target index and later logs. A target beyond the original last index publishes an empty range starting at the target. |
| `truncateSuffix(lastIndexKept)` | Retains the target index and earlier logs. A target below the original first index publishes an empty range starting at that original first index. |
| `reset(nextLogIndex)` | Publishes the empty range `[nextLogIndex, nextLogIndex - 1]`. Appends resume at the target position without creating a placeholder entry. |

These operations publish the new Manifest range before processing boundary Segments, Indexes, and obsolete files. Removed logs and configuration entries must no longer be readable. Snapshot indexes, terms, and membership continue through the JRaft snapshot and LogManager paths.

Do not replace log truncation with manual deletion of old `.seg` files. Obsolete files temporarily remaining on disk do not belong to the valid range; use the Manifest and recovery validation results to determine that range.

When a truncation boundary falls inside the retained range, storage reads and validates the boundary record before publishing the new Manifest. Only after publication does it adjust boundary Segments and Indexes, reopen active resources, and reclaim obsolete files. Restart recovery follows the validated published range as well.

The file backend retains JRaft snapshot storage and handling. Periodic snapshots still support state recovery and log truncation; changing the log backend or manually deleting Segments cannot replace snapshots.

### 4.4. File and Directory Synchronization Requirements

The filesystem containing the data path must support:

- Exclusive file locking, so only one storage instance can open a directory.
- Synchronous flushing of regular files. Logs and the temporary Manifest use `force(true)`.
- Atomic Manifest replacement within the same directory.
- Directory synchronization on platforms other than Windows. Initialization also synchronizes the ancestors of `file-log`; the runtime environment must support these operations.

File type checks apply to Segments, the Manifest, and related directories. Paths that require regular files or real directories cannot be replaced with symbolic links. Failures in required locking, flushing, or atomic replacement operations fail initialization or writes.

Directory synchronization runs for `segments`, `index`, `file-log`, and all its ancestors in that order, even if those directories already exist. On platforms other than Windows, the implementation opens directories and executes `force(true)`. The ability to create a file in the data directory alone therefore does not establish compatibility.

### 4.5. Concurrency Control and Directory Exclusion

Within a storage instance, a read-write lock coordinates access. Reads locate, validate, and decode records under the read lock. Appends, truncations, resets, and shutdown run under the write lock so readers cannot observe partially updated records.

Between storage instances, `FileChannel.tryLock()` on the `LOCK` file acquires an exclusive directory lock to prevent concurrent opens of the same directory. The operating system manages the lock held through a file channel; file existence and whether the lock is held are separate conditions.

Normal shutdown closes active Segments and Indexes, releases the directory lock, and clears runtime state. After a required write failure, the directory lock remains held until shutdown even if active write resources have closed. Deleting `LOCK` to start another process must not bypass exclusion.

### 4.6. Windows Durability Boundaries

:::caution[Windows durability limits]
Windows automatically skips directory synchronization after validating directories, without an additional configuration switch. Regular file flushing, exclusive locking, and atomic Manifest replacement remain mandatory. Each successful initialization logs a WARN with the storage path explaining the effect of skipping directory synchronization.

On Windows, power loss recovery that depends on directory synchronization barriers is not guaranteed. An acknowledged local log range may be lost, and recovery may fail if the Manifest is inconsistent with truncation or reclamation results. Recovery tests that kill a process do not prove safety across operating system crashes or power loss.
:::

The Windows WARN is emitted after each actual successful initialization. Idempotent initialization while the lock is already held and ordinary appends do not repeat it. Skipping directory synchronization neither permits disabling `sync` nor causes regular file flushing or atomic replacement failures to be ignored.

## 5. Failure Recovery

Recovery uses the published Manifest and log files in the original directory. It validates the published range and data identities before processing unpublished tails and reclaimable files. Missing or corrupt published data fails initialization so incomplete logs cannot be treated as valid state.

### 5.1. Initialization and Recovery Order

When a node reopens its original directory, it acquires the exclusive lock, validates the Manifest, storage identity, log checksums, and contiguous range, and rebuilds indexes. Only after recovery validation does it truncate unpublished tails and clean up reclaimable files. Missing or corrupt published logs, discontinuous ranges, or identity mismatches fail initialization; these logs are not skipped to continue running.

The detailed sequence is:

1. Validate synchronous write options, the group ID, configuration manager, and log codec.
2. Create and validate the root directory, acquire the `LOCK` exclusive lock, and create and synchronize required subdirectories and ancestors.
3. Read and validate the Manifest. On first initialization, create a Manifest after confirming that the directory meets the empty-store requirements.
4. Calculate the Segment number high-water mark before cleanup, so subsequent allocations do not reuse recognized numbers.
5. Scan every record in the Manifest's published range, validate headers, checksums, identities, and contiguous indexes, rebuild Indexes, and collect Raft configuration entries.
6. Inspect Segments not referenced by the Manifest and distinguish reclaimable files, files that must be preserved, and files that require failure.
7. Synchronize the directory containing the validated Manifest to establish a recovery barrier. Windows validates the directory and skips synchronization according to its platform policy.
8. Truncate and flush unpublished tails of published Segments, then reclaim obsolete Segments, unused Indexes, and the temporary Manifest.
9. Reopen active resources, restore configuration entries to JRaft's configuration manager, and finish initialization after confirming that resources are complete.

Before the recovery barrier, the existing Manifest and Segments remain unchanged; derived Indexes may be rebuilt. The recovery barrier is the synchronization of the validated Manifest's directory entry before cleanup. It does not expand Windows power loss durability guarantees.

### 5.2. Missing Manifests and Leftover Temporary Files

Without a Manifest, only empty `segments` and `index` subdirectories, a regular `LOCK` file, and a regular temporary Manifest are allowed. An empty store is created when those conditions are met. Existing contents in log or index directories, or other disallowed files in the root directory, fail initialization.

This check prevents a historical directory with a missing Manifest from being treated as a new store. Do not bypass it by emptying the directory, creating an empty Manifest, or manually renaming `manifest.tmp`. Preserve the files first, then establish the directory's origin and check complete backups.

When a published Manifest exists and passes validation, recovery cleans up any leftover temporary file at the appropriate stage. The timestamp or size of `manifest.tmp` does not establish that publication completed, and the file should not be manually promoted to the published Manifest.

### 5.3. Classifying Unreferenced Segments

The following rules apply to files with canonical names in `segments` that are not referenced by the Manifest:

| Inspection Result | Recovery Behavior |
| --- | --- |
| Valid header, `storeId` belongs to the current store, and number matches the filename | Can be reclaimed after the recovery barrier. |
| Regular file with an incomplete header or corrupt magic, header length, or header checksum | Preserved in place with a WARN containing its path; published log validation continues. |
| Header belongs to another `storeId`, number differs from the filename, version is unsupported, or identity is invalid | Initialization fails. |
| Non-regular file, symbolic link, or actual I/O error | Initialization fails. |

Files with unknown ownership are not replayed, and their canonical filenames still contribute to subsequent number allocation. A preservation WARN does not mean that the file's contents entered the valid log range or that other recovery errors can be ignored.

### 5.4. Recovery at Different Interruption Points

A process can exit at different stages of an operation. The following table explains the recovery authority at each stage. Directory synchronization remains subject to the Windows limits in Section 4.6.

| Interruption Point | Basis for Recovery |
| --- | --- |
| Logs were written, but the new Manifest has not replaced the published file | Uses the validated published Manifest; tails outside its range and unreferenced files follow the recovery rules. |
| The temporary Manifest was written or flushed but not atomically moved into place | Its presence does not publish the new range; recovery still validates the published Manifest. |
| The Manifest was atomically replaced, but directory synchronization or later resource handling failed | A new Manifest may already be on disk. Recovery uses the state actually read and validated; a failed response does not justify manual file rollback. |
| A new range was published, but boundary truncation or obsolete file reclamation is incomplete | Validates the new range, executes the recovery barrier, and then processes unpublished tails and reclaimable files. |
| A published file is missing, a record is corrupt, or an identity mismatches | Initialization fails without skipping corrupt records or automatically mixing files from another store. |

Process exit tests cover process failures only; they do not establish that directory entries and data survive operating system crashes or power loss. Recovery drills must distinguish these failure models.

### 5.5. Runtime Failure States and Subsequent Operations

| Failure Type | Storage Behavior | Operational Implication |
| --- | --- | --- |
| Parameter, encoding, or batch planning validation failure | Rejects the operation before writing the batch's files; storage remains usable. | Check inputs and size bounds before concluding that the disk has failed. |
| Required I/O or resource reopening failure during an actual mutation | Closes active Segments and Indexes and rejects further appends, truncations, and resets. | Resolve the underlying fault, then close and reopen storage. |
| Read I/O or decoding failure | Logs an ERROR with the directory, index, and exception and returns a failed read result. | Check data integrity and the exception chain; do not treat the failure as ordinary missing data. |
| Obsolete file deletion or post-reclamation directory synchronization failure | Logs a WARN while the published range remains valid. | Monitor disk space and recurring reclamation failures to avoid accumulating obsolete files. |

After a required I/O or resource reopening failure during an actual log mutation, the directory lock remains held until shutdown. After resolving the fault, stop the node to release resources, then restart with the original backend and directory to trigger recovery validation. Repeating initialization while the lock is held only checks the current state; it does not rerun recovery.

A failed write may already have placed a new Manifest on disk. Recovery uses the validated disk state; do not manually roll back files based on one failed response. Failure to reclaim obsolete files logs a WARN without changing the published log range.

### 5.6. Common Errors and Troubleshooting

Start troubleshooting with the paths and exceptions in `${nacos.home}/logs/protocol-raft.log`. Also check server startup logs if backend selection or synchronization option validation fails.

| Error or Log Message | Meaning and Action |
| --- | --- |
| `Invalid nacos.core.protocol.raft.data.log_storage_type` | Invalid backend value. Check that it is `rocksdb` or `file`. |
| `File Raft log storage requires sync=true` | Synchronous writes are disabled for the file backend. Correct the configuration and restart. |
| `File log directory is already in use` | The exclusive directory lock could not be acquired. Check for another process or instance using the same data directory. Deleting `LOCK` does not release a held lock. |
| `Manifest is missing with existing data` | The Manifest is missing but the log or index directory is not empty. Preserve the files and check complete backups; do not create an empty Manifest to bypass validation. |
| `Unexpected content without a manifest` | The root directory has disallowed contents without a Manifest. Check for an incorrect path or unrelated files. |
| `Manifest group does not match JRaft group` / `Segment identity does not match manifest` | Group or storage identity mismatch. Check for mixed data files. |
| `Foreign segment in file log directory` | An unreferenced Segment's valid header belongs to another store. It cannot be reclaimed automatically; check the directory's origin. |
| `Segment id does not match its file name` | The number in a Segment header differs from its filename. Check for manual renaming or mixed files. |
| `Published record is incomplete` / `Non-contiguous log index` | The published range contains an incomplete record or discontinuous indexes. Preserve the files and check data integrity. |
| `File log record header checksum mismatch` / `File log record payload checksum mismatch` | Record header or payload checksum validation failed. Recovery cannot skip the record. |
| `Segment ID exhausted` / `File ID overflow` | A Segment number cannot be allocated, or a canonical filename contains a number outside the long range. |
| `Preserving unpublished segment with unknown ownership` | An unpublished Segment with unknown ownership was preserved. It will not be replayed; published logs must still pass validation. |
| `Failed to initialize file log storage` | Inspect the accompanying exception and check filesystem capabilities, permissions, disk space, and data integrity. |

For underlying filesystem exceptions, inspect the operation and path in the exception chain, such as lock acquisition, directory opening, file flushing, atomic moves, or truncation. An outer initialization failure message alone does not establish that data is corrupt.

### 5.7. Recovery Steps After a Required Write Failure

1. Record the failure time, node, and group, and collect the complete exception chain and affected paths.
2. Stop the affected node according to cluster procedures and preserve the original directory. Do not start by emptying files or switching backends.
3. Check disk space, permissions, mount state, and required filesystem capabilities, then resolve the identified underlying issue.
4. Start with the backend configuration for the original version and the original directory, allowing storage to perform full recovery validation.
5. After successful recovery, verify business reads and writes, cluster catch-up, and subsequent writes. If published data remains missing or corrupt, or identities mismatch, preserve the files and develop a recovery plan using complete backups and the cluster state.

There is no universal file deletion procedure for fixing failed data validation. Do not edit checksums, splice files from different replicas, or treat the internal `reset` interface as an operational command for repairing corrupt logs.

For directory-in-use failures, also confirm that the original process has exited and released its file channels before restarting with the original backend and directory. Deleting lock files, switching backends, or repeating initialization cannot replace resource release and recovery.

## 6. Deployment and Operational Troubleshooting

This section uses a distribution package to explain enabling the file backend, confirming that configuration took effect, and diagnosing startup or runtime failures. Run the shell commands below on Linux from `${nacos.home}`. For containers, inspect configuration, mounted paths, and logs inside the container actually running Nacos Server.

### 6.1. Prepare the Environment and Data Directories

Use a Nacos version that includes file log storage. Follow the [Standalone Deployment](./deployment/deployment-standalone.mdx) or [Cluster Deployment](./deployment/deployment-cluster.md) guide to configure the database, member list, and authentication first. File log properties select the Raft log implementation and do not replace those deployment settings.

Before enabling the backend, confirm:

1. This is a new deployment, or the node already uses `file`. Do not change the property to switch an existing RocksDB node in place.
2. Each Server node has an independent data directory and does not share its group files with another process.
3. The Nacos runtime user has the required permissions to create, read, write, truncate, rename, and delete files in the data path.
4. The actual data path supports file locking, file flushing, and atomic replacement as required by Section 4.4. Platforms other than Windows also require synchronization of directories and their ancestors.

For containers or mounted volumes, mount configuration where Server actually reads it and preserve the original node's data path on the data volume. Check these conditions with the same runtime user and mount configuration, rather than relying only on host permissions.

### 6.2. Configure and Start Server

Add the following to each Server node's `conf/application.properties`:

```properties
nacos.core.protocol.raft.data.log_storage_type=file
nacos.core.protocol.raft.data.sync=true
```

For cluster mode, first configure `conf/cluster.conf` on each node according to the deployment guide, then start each node:

```shell
bash bin/startup.sh -m cluster
```

For standalone mode in development or testing, use:

```shell
bash bin/startup.sh -m standalone
```

For an independent Console deployment, add `-d server` to the Server startup command. See [Independent Console Deployment](./deployment/deployment-independent.md) for details. Configure file backend properties on Server; changing an independent Console's configuration does not replace Server's log storage.

Backend selection takes effect during Raft initialization. Saving configuration alone does not change an open storage instance. Nodes already using file storage must restart according to existing operational procedures to reread startup configuration.

### 6.3. Confirm the File Backend Is Active

After startup, check in this order:

1. Inspect the log path printed by the startup script. The distribution script writes startup output to `logs/startup.log` by default. Check for configuration validation or component startup exceptions.
2. Inspect `logs/protocol-raft.log` for file storage initialization failures, directory-in-use errors, or data validation errors for the relevant group.
3. For a Raft group that has been created, check that its `log/file-log/manifest` exists. Replace `<group>` in the path below with the actual group name.

```shell
tail -n 100 logs/startup.log
tail -n 100 logs/protocol-raft.log
ls -la "data/protocol/raft/<group>/log/file-log/"
```

The `segments/` directory can be empty before a group appends any logs. Having `file` in configuration, an existing directory, or a running process does not independently establish successful business writes.

Write and read data through a persistence operation that actually goes through Raft, such as registering and querying a persistent instance through management APIs. See [Instance Lifecycle](../user/naming/instance-lifecycle.md) for details. Then check for `.seg` and `.idx` files in the corresponding group. Registering ephemeral instances alone does not validate this log path.

See the [Monitoring Manual](./monitor.md) for readiness checks. If the node has not created the relevant group, first check whether its business component is enabled or initialized. Do not manually create log files to complete the directory layout.

### 6.4. Troubleshoot by Symptom

Record the affected node, failure time, group, and complete exception chain before following the table. See Section 5.6 for specific error messages and their meanings.

| Symptom | Check First | Next Action |
| --- | --- | --- |
| Startup rejects the backend configuration or requires synchronous writes | Confirm Server's actual configuration uses the full property names, selects `file`, and has no other configuration source overriding `sync` to `false`. | Correct the configuration and restart. `sync_meta=true` cannot replace `sync=true`. |
| The directory is already in use | Check for another Nacos process or multiple containers or nodes mounting the same data directory. | Stop instances using the same directory and confirm resource release. Do not delete `LOCK` to bypass locking. |
| Initialization, flushing, atomic moves, or truncation fails | Use the actual path in the exception to check runtime permissions, free disk space, mount state, and support for the failing filesystem operation. | Resolve the underlying issue, restart with the original backend and directory, and inspect recovery results. |
| The Manifest is missing, checksums fail, or storage identities mismatch | Check for deleted files, partial backup restoration, files from another group, or startup pointing at an incorrect directory. | Preserve the original directory and logs and follow Section 5.7. Do not create a Manifest, edit checksums, or splice files from other replicas. |
| Writes keep failing after the initial write failure | Inspect the first failure rather than only the latest request. Required I/O failures close active write resources. | After resolving the underlying fault, stop and restart the node for full recovery. Retrying business requests alone does not reopen storage. |
| Obsolete file reclamation WARN messages persist and free disk space decreases | Check affected paths, delete permissions, and disk state, distinguishing reclamation failures from published data corruption. | Fix the reclamation failure and let storage manage the files. Do not delete Segments based on filenames. |
| Only the Windows directory synchronization WARN appears | Confirm it describes the platform skipping directory synchronization, rather than file flushing or initialization failing. | Apply the power loss durability limits in Section 4.6 and continue checking node and business state. |

On Linux, these read-only commands help check disk space and directory permissions on the affected node:

```shell
df -h data
df -i data
ls -ld data data/protocol data/protocol/raft
```

Inside containers, check the actual mounted data volume. If the failing path does not yet exist, inspect its nearest existing parent. Directory permissions help diagnosis but do not establish that locking, flushing, or atomic replacement works; interpret them with the specific exception.

After resolving the issue, start with the original backend and data directory. Confirm that recovery no longer reports errors, business reads and writes work, and the node participates normally in the cluster. If recovery still fails, preserve the files and plan further action using complete backups and other nodes' state. Use the existing [Admin API](./admin-api.md) for snapshots or leader transfers.

## 7. Frequently Asked Questions

### 7.1. Can an Existing RocksDB Node Switch to `file` by Restarting?

A property change and restart is not a migration procedure. Backend selection does not convert logs, metadata, or snapshots. This feature provides no conversion tool or online migration workflow between RocksDB and file backends.

An existing node switched to `file` uses a different set of logs. Switching back to `rocksdb` does not merge intervening data into the original logs. Keep the original backend when upgrading an existing cluster. Deployments already using `file` must also confirm the target version supports the implementation and file format. See the [Upgrade Manual](./upgrading.mdx) for other upgrade constraints.

### 7.2. Can I Enable the File Backend for Only One Raft Group?

No. Server selects one backend factory during initialization and applies it to every group created on that node. There is no per-group backend configuration.

### 7.3. Why Does Startup Still Fail After Setting `sync_meta=true`?

The file backend independently requires log `sync=true`. `sync_meta` is an option passed to the default metadata store and cannot replace the log synchronization requirement. Check the full `nacos.core.protocol.raft.data.sync` property and its effective value.

### 7.4. Does a Leftover `LOCK` File Mean the Previous Process Did Not Exit?

File existence alone cannot establish this. File channels and the operating system manage lock state. Normal shutdown releases the lock without requiring deletion of the lock file. Check for processes still using the directory; do not delete `LOCK` to start a second storage instance.

### 7.5. Does `manifest.tmp` Indicate Recovery Failure?

Not necessarily. It is the temporary file used when publishing a Manifest and may remain after an abnormal exit. Recovery depends on the published Manifest, Segments, and validation results. Do not manually rename the temporary file to the published Manifest.

### 7.6. Can I Periodically Delete Rebuildable Indexes to Save Space?

Do not maintain storage this way. Recovery rebuilds Indexes, but a running store still uses active Indexes. Manually deleting, replacing, or splicing index files can break consistency between resources and disk state. Storage must manage file reclamation.

### 7.7. Are Snapshots Still Needed with the File Backend?

Yes. The backend replaces log storage only. Snapshots still support state recovery and log truncation, and JRaft snapshot handling remains unchanged. Manual Segment deletion cannot replace snapshots or log truncation.

### 7.8. What Files Must a Backup Include?

Stop the node according to cluster procedures and confirm the process has exited and released resources. Then save its complete `data`, `conf`, membership configuration, and version information so logs, metadata, snapshots, and deployment configuration reflect a consistent stopped state. Preserve the required majority availability during cluster maintenance.

Backing up only `segments`, only the newest Segment, or only the Manifest is insufficient for a complete node backup. If Config Center uses an external database, follow its backup procedures too; Raft file backups do not replace database backups. Validate backup restoration in an isolated environment, checking group identity and business data.

### 7.9. Can Disabling `sync` Eliminate the Windows Directory Synchronization WARN?

No. Windows skips directory synchronization by platform policy, without an extra switch. Regular file flushing, locking, and atomic replacement remain mandatory. Disabling `sync` fails file backend initialization and cannot compensate for the power loss durability limits caused by skipping directory synchronization.

## 8. Related Documentation

- [System Parameters](./system-configurations.md)
- [Standalone Deployment](./deployment/deployment-standalone.mdx)
- [Cluster Deployment](./deployment/deployment-cluster.md)
- [Deployment Best Practices](./deployment/deployment-best-practices.md)
- [Monitoring Manual](./monitor.md)
- [Admin API](./admin-api.md)
- [Upgrade Manual](./upgrading.mdx)
