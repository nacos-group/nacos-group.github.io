---
title: 配置加密
keywords: [AES, encryption, 配置加密, 加密插件]
description: 本文介绍 Nacos 配置加密插件的工作方式、使用步骤、数据表要求和自定义扩展方式。
sidebar:
    order: 3
---

# 配置加密插件

配置加密用于保护存储在 Nacos 中的敏感配置内容。开启后，符合命名规则的配置会以密文写入数据库，并通过 `encrypted_data_key` 保存解密所需的数据密钥。

配置加密不替代鉴权、网络隔离、TLS 或企业密钥管理系统。它解决的是“配置内容在 Nacos 存储层和部分传输链路中不直接暴露明文”的问题。

## 工作方式

Nacos 根据 `dataId` 前缀判断一条配置是否需要加密：

```text
cipher-${algorithmName}-${realDataId}
```

例如：

```text
cipher-aes-application-prod.yaml
```

处理流程如下：

1. 发布配置时，Nacos 解析 `dataId` 中的算法名，例如 `aes`。
2. Nacos 从已加载的 `EncryptionPluginService` 中查找同名算法。
3. 找到算法后，使用插件生成数据密钥、加密配置内容，并保存密文和 `encrypted_data_key`。
4. 查询配置时，Nacos 使用 `encrypted_data_key` 和同一个算法插件解密内容。
5. 如果 `dataId` 不以 `cipher-` 开头，配置按普通明文配置处理。

如果 `dataId` 使用了 `cipher-` 前缀，但服务端或客户端没有加载对应算法插件，Nacos 会记录告警日志，并保留原内容处理。生产环境应在发布前验证插件已经正确加载。

## 数据表要求

配置加密依赖 `encrypted_data_key` 字段。当前默认 schema 已包含该字段，涉及表包括：

- `config_info`
- `config_info_beta`
- `config_info_gray`
- `his_config_info`

如果从较早版本升级，请先对比当前版本对应数据库的 schema，并在升级前补齐字段。不同数据库的字段类型可能不同，请优先使用当前版本发布包或源码中的 schema。

## AES 插件

社区插件仓库 [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin) 提供了 AES 配置加密插件：

```text
nacos-encryption-plugin-ext/nacos-aes-encryption-plugin
```

该插件的算法名是 `aes`，因此对应的加密配置 `dataId` 前缀为 `cipher-aes-`。

## 使用步骤

### 1. 准备数据库 schema

新部署时，直接使用当前版本发布包提供的 schema。

已有集群升级时，请检查 `encrypted_data_key` 字段是否存在。以 MySQL 为例：

```sql
ALTER TABLE config_info ADD COLUMN `encrypted_data_key` varchar(1024) NOT NULL DEFAULT '' COMMENT '密钥';
ALTER TABLE config_info_beta ADD COLUMN `encrypted_data_key` varchar(256) NOT NULL DEFAULT '' COMMENT 'encrypted_data_key';
ALTER TABLE config_info_gray ADD COLUMN `encrypted_data_key` varchar(256) NOT NULL DEFAULT '' COMMENT 'encrypted_data_key';
ALTER TABLE his_config_info ADD COLUMN `encrypted_data_key` varchar(1024) NOT NULL DEFAULT '' COMMENT '密钥';
```

执行变更前请先备份数据库，并以当前版本的正式 schema 为准。

### 2. 部署加密插件

编译或下载与 Nacos 版本匹配的加密插件 JAR，将它放到服务端插件目录：

```bash
cp nacos-aes-encryption-plugin-*.jar ${nacos.home}/plugins/
```

如果 Java SDK 需要在客户端侧发布或读取加密配置，也需要让客户端应用加载同一个加密插件。否则客户端可能只能拿到密文，或无法在发布时生成正确的 `encryptedDataKey`。

### 3. 发布加密配置

使用 `cipher-${algorithmName}-` 前缀创建配置。以 AES 为例：

```text
Data ID: cipher-aes-application-prod.yaml
Group: DEFAULT_GROUP
Content: password: nacos-secret
```

通过控制台发布时，服务端会处理加密。通过 Java SDK 发布时，客户端配置过滤器会优先处理加密，并把 `encryptedDataKey` 一起提交给服务端。

### 4. 验证结果

发布后建议验证：

- 数据库中的 `content` 已不是原始明文。
- `encrypted_data_key` 字段不为空。
- 通过加载了相同插件的 SDK 或控制台查询时，可以得到解密后的明文。
- 没有加载插件的客户端不会被用于读取需要解密的配置。

## 自定义加密插件

自定义插件需要实现：

```text
com.alibaba.nacos.plugin.encryption.spi.EncryptionPluginService
```

核心方法包括：

| 方法 | 说明 |
| --- | --- |
| `algorithmName()` | 返回稳定算法名。该值会出现在 `cipher-${algorithmName}-` 中。 |
| `generateSecretKey()` | 为单条配置生成数据密钥。 |
| `encrypt(secretKey, content)` | 加密配置内容。 |
| `decrypt(secretKey, content)` | 解密配置内容。 |
| `encryptSecretKey(secretKey)` | 加密或封装数据密钥。 |
| `decryptSecretKey(secretKey)` | 解密或解析数据密钥。 |

插件需要通过 SPI 文件注册：

```text
META-INF/services/com.alibaba.nacos.plugin.encryption.spi.EncryptionPluginService
```

如果企业有 KMS 或 HSM，建议在自定义插件中对接企业密钥系统，不要把主密钥硬编码在插件中。

## 常见问题

| 现象 | 建议检查 |
| --- | --- |
| 配置没有被加密 | `dataId` 是否以 `cipher-` 开头，算法名是否与插件 `algorithmName()` 一致。 |
| 服务端日志提示找不到加密算法 | 服务端是否加载了插件 JAR，插件版本是否与 Nacos 版本兼容。 |
| SDK 查询到密文 | 客户端应用是否加载了相同算法插件。 |
| 升级后发布失败 | 数据库表是否包含 `encrypted_data_key` 字段。 |
| 已有明文配置想改为加密配置 | 建议新建或重命名为 `cipher-${algorithmName}-` 前缀后重新发布，并确认消费者使用新的 `dataId`。 |
