---
title: AI 向量插件
keywords: [AI 向量插件, ARD, pgvector, PostgreSQL, 资源发现]
description: 配置 Nacos 3.3 AI 向量插件，为 ARD 资源发现补充向量召回，并了解默认实现、验证与扩展方式。
sidebar:
    order: 17
---

# AI 向量插件

AI 向量插件为资源发现提供可选的向量索引和相似内容召回能力。在 [ARD](../ecology/use-nacos-with-ard.md) 中使用时，Nacos 将向量召回与关键词结果一起排序，帮助应用发现相关的 Agent、Skill、Prompt 和 MCP Server。启用插件后，ARD 客户端继续使用原有搜索请求，无需增加向量参数。

向量插件不改变资源的发布条件、命名空间或[可见性](./visibility-plugin.md)。没有可用的向量插件时，仍可使用关键词搜索；普通资源管理和 ARD 接入不要求安装 pgvector。

## 1. 默认实现与适用范围

Nacos 3.3 提供 PostgreSQL/pgvector 实现，插件标识为 `ai-vector:postgresql`，随标准发行包的 `nacos-default-ai-vector-plugin` 提供。它负责保存和查询向量，可以使用 Nacos 的 PostgreSQL 主数据源，也可以连接独立的 PostgreSQL 数据库。主数据源使用 MySQL 等其他数据库时，应配置独立的向量数据源。

当前内置向量生成方式为本地 hashing，模型标识为 `nacos-local-hashing-embedding-v1`，维度为 384。它不调用外部大模型，也不需要模型 API Key。接入 pgvector 增加的是向量存储与相似度查询能力，不会自动替换向量生成方式；检索效果需要结合实际资源描述和查询语句验证。

## 2. 配置 PostgreSQL 向量索引

### 2.1. 准备数据库

1. 在目标 PostgreSQL 服务中安装 [pgvector](https://github.com/pgvector/pgvector)，并准备可创建 `vector` 扩展及表的数据库账号。
2. 确认 Nacos 的标准发行包中有默认向量插件和 PostgreSQL JDBC 驱动。自行精简部署包时，不要遗漏这两项。
3. 在用于向量存储的数据库中初始化发行包内的 `conf/pg-ai-vector-schema.sql`。即使复用 PostgreSQL 主库，也需要单独初始化；主库的 `pg-schema.sql` 不包含向量表。

:::caution[仅用于首次初始化]
`pg-ai-vector-schema.sql` 包含删除并重建 `ai_resource_search_embedding_pg` 表的语句。以下命令用于尚未建立向量索引的新库；不要在已有向量数据的库上重复执行。已有部署应先检查表结构，按需制定迁移方案。
:::

在 Nacos 安装目录中执行，按实际环境替换地址、账号和数据库名；`-W` 会提示输入密码：

```bash
psql -h 127.0.0.1 -p 5432 -U nacos_vector -d nacos_ai_search \
  -W -v ON_ERROR_STOP=1 -f conf/pg-ai-vector-schema.sql
```

初始化完成后，Nacos 的连接账号需要能够读取和写入该向量表及使用相关序列。普通运行账号不必保留创建扩展的权限。

### 2.2. 配置 Nacos Server

在各 Nacos Server 的 `conf/application.properties` 中配置。以下示例使用独立的 PostgreSQL 数据库：

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

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `nacos.ai.resource.search.vector.provider` | `postgresql` | 选择已安装的向量索引实现，一次使用一个 Provider。 |
| `nacos.plugin.ai-vector.postgresql.enabled` | 随 Provider 选择 | PostgreSQL 实现的初始启用状态；已持久化的插件状态优先。 |
| `nacos.ai.resource.search.vector.postgresql.url` | 空 | 独立向量库的 JDBC URL。未配置时尝试使用主数据源，主数据源必须是 PostgreSQL。 |
| `nacos.ai.resource.search.vector.postgresql.user` | 空 | 独立向量库的数据库用户名。 |
| `nacos.ai.resource.search.vector.postgresql.password` | 空 | 独立向量库的数据库密码。 |
| `nacos.ai.resource.search.vector.postgresql.driver-class-name` | `org.postgresql.Driver` | 独立向量库使用的 JDBC 驱动类。 |

复用 PostgreSQL 主数据源时，省略上述 `postgresql.*` 四项，使用主数据源的连接信息。配置独立向量库不会迁移 Nacos 主数据，资源定义及其他主库数据仍由原数据源管理。

更新配置后重启 Nacos Server，并保持各节点的 Provider、数据库和插件版本一致。Provider 选择及默认实现的数据库连接配置通过静态配置管理，不通过插件配置 API 切换；插件管理中的 `enabled` 状态用于控制已选实现是否参与执行，不能代替 Provider 选择。

`nacos.ai.resource.search.enabled` 控制资源检索能力，通常保持默认的 `true`。需要通过 ARD 使用时，再按 [ARD 接入指南](../ecology/use-nacos-with-ard.md)启用 ARD；ARD 开关只控制协议入口。仅希望停用向量能力时，可按[插件运维与配置](./operations.md)禁用 `ai-vector:postgresql`，保留关键词检索与 ARD。

## 3. 验证向量索引和 ARD 查询

### 3.1. 检查插件状态

按[配置访问凭据](../manual/user/auth.mdx)登录并保存 `NACOS_ACCESS_TOKEN`，使用管理员身份查询插件详情：

```bash
curl -sS -G 'http://127.0.0.1:8848/nacos/v3/admin/core/plugin/detail' \
  -H "accessToken: ${NACOS_ACCESS_TOKEN}" \
  --data-urlencode 'pluginType=ai-vector' \
  --data-urlencode 'pluginName=postgresql'
```

确认插件已加载、`enabled=true`。默认实现显示 `configurable=false`，数据库连接信息不会作为统一插件配置项展示。插件已启用不等于数据库连接和向量索引已经可用，需要继续检查。

### 3.2. 检查向量数据

按 [ARD 资源发布条件](../manual/user/ai/ard-discovery.md)准备至少一个可发现的资源。保持 `nacos.ai.resource.search.index.backfill.enabled=true`，等待后台索引同步；已有资源也会参与检查和补齐。

在向量数据库中执行以下只读查询，将 `public` 替换为实际命名空间 ID：

```sql
SELECT extversion FROM pg_extension WHERE extname = 'vector';

SELECT resource_type, embedding_model, embedding_dimension, COUNT(*) AS vector_count
FROM ai_resource_search_embedding_pg
WHERE namespace_id = 'public'
GROUP BY resource_type, embedding_model, embedding_dimension;
```

默认向量数据应使用 `nacos-local-hashing-embedding-v1` 和维度 `384`。资源会被拆分为多个片段，因此向量数量不等于资源数量。只查到扩展或空表，不能说明资源已完成向量索引。

### 3.3. 验证资源发现

继续执行 [ARD 接入指南中的搜索示例](../ecology/use-nacos-with-ard.md#3-搜索资源)，使用与应用相同的身份、命名空间和过滤条件，检查目标资源及其版本，并验证下载内容。

可用实际业务查询比较启用前后的结果相关性。搜索成功本身不能证明向量查询已参与执行，因为关键词搜索也能返回结果。启用向量插件不会公开私有资源，也不会让草稿或已下线的版本进入正常发现结果。

## 4. 运维与常见问题

| 现象 | 检查方式 |
| --- | --- |
| 插件详情中找不到 `ai-vector:postgresql` | 检查默认插件 JAR、服务端启动日志及资源检索开关；自定义 Provider 还需检查 SPI 注册和名称。 |
| 插件已启用，但向量库没有数据 | 检查连接地址、驱动、账号权限、扩展和表是否位于实际连接的数据库中；再检查资源是否已发布、后台索引是否开启及同步日志。 |
| 只有关键词结果 | 所选 Provider 不可用时不会进行向量召回。先验证向量数据，再用相同身份和条件检查 ARD 查询；不要只凭单次结果顺序判断。 |
| 向量写入或查询报错 | 检查向量维度、表结构、数据库连接和权限。修复后等待后台重试；运行中的数据库异常仍可能导致查询失败，不能假定所有异常都会自动降级。 |
| 能搜到资源，但应用不能调用 | 检查资源可见性、版本、实际服务端点和调用凭据；向量插件不负责启动 Agent 或 MCP Server。 |

向量索引失败不会回滚已提交的资源写入，但结果可能延迟更新。切换 Provider 或向量生成模型后，需要重新建立受影响资源的向量索引，并在后台补齐完成后验证结果。不要仅更改模型名称，或把不同模型的向量直接混用。

## 5. 开发自定义向量插件

需要接入其他向量存储时，可实现 `com.alibaba.nacos.plugin.ai.vector.spi` 包中的两个接口。SPI 所在 Maven 模块为 `com.alibaba.nacos:nacos-ai-plugin`，版本应与服务端兼容。

| 接口 / 方法 | 需要实现的行为 |
| --- | --- |
| `AiResourceVectorIndexBuilder.type()` / `build()` | 返回唯一、稳定的 Provider 名称，并创建索引实例。 |
| `AiResourceVectorIndex.available()` | 检查所需服务、扩展、表、维度和索引是否可用。 |
| `replaceResourceVersion(...)` / `addDocuments(...)` | 保存资源版本的向量；整版本替换应幂等，不能向查询暴露半份数据。 |
| `deleteByResource(...)` / `deleteByResourceVersion(...)` | 幂等删除对应资源或版本的向量。 |
| `search(...)` | 按命名空间、模型及资源类型查询，遵守数量上限，返回资源、片段标识和相似度分数。 |
| `isResourceVersionReady(...)` | 为后台补齐判断提供已索引模型和文档信息；精确检查时应覆盖包含 `expectedDocumentId` 的重载。 |
| `close()` | 释放连接池、客户端等资源。 |

在插件 JAR 的以下 SPI 文件中填写 Builder 实现类的完整类名：

```text
META-INF/services/com.alibaba.nacos.plugin.ai.vector.spi.AiResourceVectorIndexBuilder
```

将插件及必要依赖放入各服务端的 `plugins/` 目录，设置 `nacos.ai.resource.search.vector.provider` 为该 Builder 的名称后重启。安装和兼容规则参见[插件开发指南](./development.md)。

Vector SPI 接收已经生成的向量，不是外部 embedding 模型的配置入口。自定义实现负责自己的数据库对象、配置和迁移；生命周期、可见性及最终结果排序由 Nacos 处理。实现应遵守 Java 8 SPI 兼容要求，并验证重复写入、版本替换、限定命名空间查询、失败重试及关闭行为。
