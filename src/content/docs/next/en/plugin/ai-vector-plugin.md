---
title: AI Vector Plugin
keywords: [AI vector plugin, ARD, pgvector, PostgreSQL, Resource discovery]
description: Configure the Nacos 3.3 AI vector plugin to add vector retrieval to ARD resource discovery, and learn how to verify and extend it.
sidebar:
    order: 17
---

# AI Vector Plugin

The AI vector plugin provides optional vector indexing and retrieval of similar content for resource discovery. When used with [ARD](../ecology/use-nacos-with-ard.md), Nacos ranks vector matches together with keyword results to help applications find relevant Agents, Skills, Prompts, and MCP Servers. ARD clients keep using their existing search requests without adding vector parameters.

The plugin does not change resource publishing requirements, namespaces, or [visibility](./visibility-plugin.md). Keyword search remains available without a usable vector plugin; basic resource management and ARD integration do not require pgvector.

## 1. Default implementation and scope

Nacos 3.3 provides a PostgreSQL/pgvector implementation, identified as `ai-vector:postgresql`, through `nacos-default-ai-vector-plugin` in the standard distribution. It stores and queries vectors using either the Nacos PostgreSQL main data source or a separate PostgreSQL database. If the main data source uses MySQL or another database, configure a separate vector data source.

The current built-in embedding method uses local hashing with model ID `nacos-local-hashing-embedding-v1` and 384 dimensions. It does not call an external large model or require a model API key. Adding pgvector provides vector storage and similarity queries; it does not replace the embedding method. Evaluate retrieval quality against your resource descriptions and application queries.

## 2. Configure the PostgreSQL vector index

### 2.1. Prepare the database

1. Install [pgvector](https://github.com/pgvector/pgvector) on the target PostgreSQL server and prepare a database account that can create the `vector` extension and tables.
2. Confirm that the Nacos standard distribution contains the default vector plugin and PostgreSQL JDBC driver. Retain both when preparing a reduced deployment package.
3. Initialize the vector database with `conf/pg-ai-vector-schema.sql` from the distribution. This is also required when reusing the PostgreSQL main database: its `pg-schema.sql` does not include vector tables.

:::caution[First-time initialization only]
`pg-ai-vector-schema.sql` drops and recreates `ai_resource_search_embedding_pg`. The following command is for a new database without an existing vector index. Do not rerun it against existing vector data; inspect the schema and plan any required migration first.
:::

Run from the Nacos installation directory, replacing the address, account, and database name as needed. `-W` prompts for the password:

```bash
psql -h 127.0.0.1 -p 5432 -U nacos_vector -d nacos_ai_search \
  -W -v ON_ERROR_STOP=1 -f conf/pg-ai-vector-schema.sql
```

After initialization, the Nacos connection account needs read/write access to the vector table and access to its sequence. The runtime account does not need to retain extension-creation permission.

### 2.2. Configure Nacos Server

Configure `conf/application.properties` on each Nacos Server. This example uses a separate PostgreSQL database:

```properties
nacos.ai.resource.search.enabled=true
nacos.ai.resource.search.index.backfill.enabled=true
nacos.ai.resource.search.vector.provider=postgresql
nacos.plugin.ai-vector.postgresql.enabled=true
nacos.ai.resource.search.vector.postgresql.url=jdbc:postgresql://127.0.0.1:5432/nacos_ai_search
nacos.ai.resource.search.vector.postgresql.user=nacos_vector
nacos.ai.resource.search.vector.postgresql.password=<database-password>
nacos.ai.resource.search.vector.postgresql.driver-class-name=org.postgresql.Driver
```

| Property | Default | Description |
| --- | --- | --- |
| `nacos.ai.resource.search.vector.provider` | `postgresql` | Selects one installed vector index Provider. |
| `nacos.plugin.ai-vector.postgresql.enabled` | Follows Provider selection | Initial state of the PostgreSQL implementation; persisted plugin state takes precedence. |
| `nacos.ai.resource.search.vector.postgresql.url` | Empty | JDBC URL of a separate vector database. When unset, the implementation tries the main data source, which must be PostgreSQL. |
| `nacos.ai.resource.search.vector.postgresql.user` | Empty | Database username for the separate vector database. |
| `nacos.ai.resource.search.vector.postgresql.password` | Empty | Database password for the separate vector database. |
| `nacos.ai.resource.search.vector.postgresql.driver-class-name` | `org.postgresql.Driver` | JDBC driver class for the separate vector database. |

To reuse the PostgreSQL main data source, omit the four `postgresql.*` properties and use the main data source's connection settings. Configuring a separate vector database does not move Nacos primary data: resource definitions and other primary data remain in their original data source.

Restart Nacos Server after changing these settings. Keep the Provider, database, and plugin versions consistent across nodes. Provider selection and the default implementation's database connection settings use static configuration, rather than the plugin configuration API. The plugin's `enabled` state controls whether the selected implementation participates; it does not select another Provider.

`nacos.ai.resource.search.enabled` controls resource search and should normally retain its default of `true`. To use ARD, enable it separately as described in the [ARD Integration Guide](../ecology/use-nacos-with-ard.md); its switch controls the protocol endpoints. To stop only vector retrieval, disable `ai-vector:postgresql` through [Plugin Operations and Configuration](./operations.md), keeping keyword search and ARD available.

## 3. Verify the vector index and ARD queries

### 3.1. Check plugin state

Sign in and save `NACOS_ACCESS_TOKEN` as described in [Configure Access Credentials](../manual/user/auth.mdx). Query plugin details with an administrator identity:

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/detail' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'pluginType=ai-vector' \
  --data-urlencode 'pluginName=postgresql'
```

Confirm that the plugin is loaded and `enabled=true`. The default implementation reports `configurable=false`; its database connection settings are not exposed as unified plugin configuration items. An enabled plugin does not establish that its database connection and vector index are usable. Continue with the checks below.

### 3.2. Check vector data

Prepare at least one discoverable resource following the [ARD publishing requirements](../manual/user/ai/ard-discovery.md). Keep `nacos.ai.resource.search.index.backfill.enabled=true` and allow background indexing to complete. Existing resources are also checked and filled in.

Run these read-only queries in the vector database, replacing `public` with the actual namespace ID:

```sql
SELECT extversion FROM pg_extension WHERE extname = 'vector';

SELECT resource_type, embedding_model, embedding_dimension, COUNT(*) AS vector_count
FROM ai_resource_search_embedding_pg
WHERE namespace_id = 'public'
GROUP BY resource_type, embedding_model, embedding_dimension;
```

Default vector data should use `nacos-local-hashing-embedding-v1` and dimension `384`. Resources are split into multiple chunks, so the vector count is not the resource count. Finding the extension or an empty table does not establish that resources have been indexed.

### 3.3. Verify resource discovery

Run the [search example in the ARD Integration Guide](../ecology/use-nacos-with-ard.md#3-search-resources) with the same identity, namespace, and filters as your application. Check the expected resource and version, then verify its downloaded content.

Use representative queries to compare relevance before and after enabling vector retrieval. A successful search alone does not prove that vector retrieval participated, because keyword search can also return results. Enabling the plugin does not make private resources public or make draft or offline versions discoverable.

## 4. Operations and troubleshooting

| Symptom | What to check |
| --- | --- |
| `ai-vector:postgresql` is missing from plugin details | Check the default plugin JAR, server startup logs, and resource search switch. For a custom Provider, also check SPI registration and its name. |
| The plugin is enabled but the vector database has no data | Check the connection URL, driver, account permissions, extension, and table in the database actually used. Then check resource publication, background indexing, and indexing logs. |
| Only keyword results are returned | Vector retrieval is skipped when the selected Provider is unavailable. Verify vector data first, then test ARD with the same identity and filters. Do not judge participation solely by the order of one result set. |
| Vector writes or queries fail | Check vector dimensions, schema, database connectivity, and permissions. Allow background retries after repair. Database errors during execution can still fail a query; not every error automatically falls back to keyword search. |
| A resource is discoverable but the application cannot call it | Check visibility, version, actual service endpoints, and credentials. The vector plugin does not start Agent or MCP Server processes. |

Vector indexing failures do not roll back committed resource writes, but results may be delayed. Changing the Provider or embedding model requires rebuilding the affected resource vectors and verifying results after background indexing catches up. Do not merely rename a model or mix vectors from different models.

## 5. Develop a custom vector plugin

To integrate another vector store, implement the two interfaces in `com.alibaba.nacos.plugin.ai.vector.spi`. The SPI Maven module is `com.alibaba.nacos:nacos-ai-plugin`; use a version compatible with the server.

| Interface / method | Required behavior |
| --- | --- |
| `AiResourceVectorIndexBuilder.type()` / `build()` | Return a unique, stable Provider name and create an index instance. |
| `AiResourceVectorIndex.available()` | Check the required service, extension, tables, dimensions, and indexes. |
| `replaceResourceVersion(...)` / `addDocuments(...)` | Store resource-version vectors. Whole-version replacement must be idempotent and must not expose partially written data to queries. |
| `deleteByResource(...)` / `deleteByResourceVersion(...)` | Idempotently delete vectors for the resource or version. |
| `search(...)` | Query within a namespace, model, and resource types, honor the limit, and return resource/chunk identifiers and similarity scores. |
| `isResourceVersionReady(...)` | Report indexed model and document information for background reconciliation. Override the overload containing `expectedDocumentId` for precise checks. |
| `close()` | Release connection pools, clients, and other resources. |

Put the fully qualified Builder implementation class name in this SPI file inside the plugin JAR:

```text
META-INF/services/com.alibaba.nacos.plugin.ai.vector.spi.AiResourceVectorIndexBuilder
```

Place the plugin and required dependencies in each server's `plugins/` directory, set `nacos.ai.resource.search.vector.provider` to the Builder's name, and restart. See the [Plugin Development Guide](./development.md) for installation and compatibility rules.

The Vector SPI accepts vectors that have already been generated; it is not a configuration entry for an external embedding model. Custom implementations own their database objects, configuration, and migrations. Nacos handles lifecycle, visibility, and final result ranking. Preserve Java 8 SPI compatibility and verify repeated writes, version replacement, namespace isolation, retries, and shutdown.
