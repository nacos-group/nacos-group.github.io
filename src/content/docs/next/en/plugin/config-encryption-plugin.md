---
title: Configuration Encryption
keywords: [AES, encryption, configuration encryption, encryption plugin]
description: This guide explains how Nacos configuration encryption works, how to use encryption plugins, which schema changes are required, and how to develop a custom plugin.
sidebar:
    order: 5
---

# Configuration Encryption Plugin

Configuration encryption protects sensitive configuration content stored in Nacos. When enabled for a config item, Nacos writes ciphertext to the database and stores the data key in `encrypted_data_key`.

Configuration encryption does not replace authentication, network isolation, TLS, or an enterprise key management system. It only prevents sensitive configuration content from being stored and exposed as plain text in Nacos storage and selected transfer paths.

## How It Works

Nacos decides whether a config item needs encryption by checking the `dataId` prefix:

```text
cipher-${algorithmName}-${realDataId}
```

Example:

```text
cipher-aes-application-prod.yaml
```

The flow is:

1. When a config item is published, Nacos parses the algorithm name from `dataId`, such as `aes`.
2. Nacos looks for an `EncryptionPluginService` with the same algorithm name.
3. If found, the plugin generates a data key, encrypts the content, and Nacos stores both ciphertext and `encrypted_data_key`.
4. When the config item is queried, Nacos uses `encrypted_data_key` and the same plugin to decrypt the content.
5. If `dataId` does not start with `cipher-`, the config item is handled as a normal plain-text config.

If `dataId` starts with `cipher-` but the matching plugin is not loaded on the server or client, Nacos logs a warning and keeps processing the original content. In production, verify plugin loading before publishing encrypted configs.

## Schema Requirements

Configuration encryption depends on the `encrypted_data_key` column. The current default schemas already include this column in:

- `config_info`
- `config_info_gray`
- `his_config_info`

When upgrading from an older version, compare the schema of your current Nacos version first and add the missing columns before the upgrade. Column types differ across databases, so prefer the schema shipped with the target Nacos version. The current Nacos 3.3 schema no longer includes legacy `config_info_beta` or `config_info_tag` tables. If the old deployment still has beta/tag gray data, migrate it to the current `config_info_gray` gray model before upgrading.

## AES Plugin

The community plugin repository [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin) provides an AES encryption plugin:

```text
nacos-encryption-plugin-ext/nacos-aes-encryption-plugin
```

The algorithm name is `aes`, so encrypted config `dataId` values use the `cipher-aes-` prefix.

## Usage

### 1. Prepare The Schema

For new deployments, use the schema shipped with the current Nacos version.

For existing clusters, check whether `encrypted_data_key` exists. MySQL example:

```sql
ALTER TABLE config_info ADD COLUMN `encrypted_data_key` varchar(1024) NOT NULL DEFAULT '' COMMENT 'secret key';
ALTER TABLE config_info_gray ADD COLUMN `encrypted_data_key` varchar(256) NOT NULL DEFAULT '' COMMENT 'encrypted_data_key';
ALTER TABLE his_config_info ADD COLUMN `encrypted_data_key` varchar(1024) NOT NULL DEFAULT '' COMMENT 'secret key';
```

Back up the database before applying schema changes, and use the official schema of the target Nacos version as the source of truth.

### 2. Deploy The Encryption Plugin

Build or download an encryption plugin JAR that matches your Nacos version, then put it into the server plugin directory:

```bash
cp nacos-aes-encryption-plugin-*.jar ${nacos.home}/plugins/
```

If Java SDK applications need to publish or read encrypted configs, make sure those applications also load the same encryption plugin. Otherwise, the client may receive ciphertext or fail to generate the correct `encryptedDataKey` when publishing.

### 3. Publish An Encrypted Config

Create a config item with the `cipher-${algorithmName}-` prefix. AES example:

```text
Data ID: cipher-aes-application-prod.yaml
Group: DEFAULT_GROUP
Content: password: nacos-secret
```

When publishing from the console, the server handles encryption. When publishing from the Java SDK, the client-side config filter handles encryption first and submits `encryptedDataKey` together with the content.

### 4. Verify The Result

After publishing, verify that:

- The `content` column in the database is not the original plain text.
- `encrypted_data_key` is not empty.
- SDK or console queries with the same plugin return the decrypted plain text.
- Clients without the matching plugin are not used to consume encrypted configs.

## Develop A Custom Encryption Plugin

Implement:

```text
com.alibaba.nacos.plugin.encryption.spi.EncryptionPluginService
```

Important methods:

| Method | Description |
| --- | --- |
| `algorithmName()` | Returns the stable algorithm name used in `cipher-${algorithmName}-`. |
| `generateSecretKey()` | Generates the data key for one config item. |
| `encrypt(secretKey, content)` | Encrypts config content. |
| `decrypt(secretKey, content)` | Decrypts config content. |
| `encryptSecretKey(secretKey)` | Encrypts or wraps the data key. |
| `decryptSecretKey(secretKey)` | Decrypts or unwraps the data key. |

Register the implementation through SPI:

```text
META-INF/services/com.alibaba.nacos.plugin.encryption.spi.EncryptionPluginService
```

If your organization uses KMS or HSM, integrate with that system in the custom plugin. Do not hard-code master keys in plugin code.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Config is not encrypted | Check whether `dataId` starts with `cipher-`, and whether the algorithm name matches plugin `algorithmName()`. |
| Server logs say the algorithm is not found | Check whether the server loaded the plugin JAR and whether the plugin version matches Nacos. |
| SDK receives ciphertext | Check whether the client application loaded the same algorithm plugin. |
| Publish fails after upgrade | Check whether the tables contain `encrypted_data_key`. |
| Existing plain-text config needs encryption | Create or rename it with the `cipher-${algorithmName}-` prefix, republish it, and make consumers use the new `dataId`. |
