---
title: 多数据源
keywords: [MySQL, Derby, PostgreSQL, Oracle, 数据源插件, 数据库方言]
description: 本文介绍 Nacos 数据源方言插件的使用方式、官方内置数据库类型、社区扩展插件和自定义开发方式。
sidebar:
    order: 4
---

# 多数据源插件

Nacos 通过数据源方言插件适配不同数据库。插件负责处理 SQL 方言、分页、函数、主键返回方式，以及 Nacos 逻辑表对应的 mapper 实现。

从 Nacos 2.2.0 开始，数据源方言可以通过 SPI 扩展。当前 Nacos next 版本的官方默认实现已经支持 4 种数据库：`derby`、`mysql`、`postgresql` 和 `oracle`。

:::note
这里的“多数据源”主要指多种数据库方言，以及同一数据库类型下的多个连接地址。一个 Nacos 集群运行时只能选择一种 SQL platform，不建议把不同数据库类型混在同一个集群配置中使用。
:::

## 官方支持的数据库

| 数据库类型 | 配置值 | 适合场景 | Schema 文件 |
| --- | --- | --- | --- |
| Derby | `derby` | 本地开发、单机测试、快速验证 | `META-INF/derby-schema.sql` |
| MySQL | `mysql` | 生产环境常用外置数据库 | `META-INF/mysql-schema.sql` |
| PostgreSQL | `postgresql` | 使用 PostgreSQL 作为外置数据库 | `META-INF/pg-schema.sql` |
| Oracle | `oracle` | 使用 Oracle 12c 及以上版本作为外置数据库 | `META-INF/oracle-schema.sql` |

默认数据源实现位于 Nacos 代码仓库的 `plugin-default-impl/nacos-default-datasource-plugin` 模块。每个数据库类型都同时注册 `DatabaseDialect` 和表级 `Mapper` SPI。

:::note
当前 Oracle 数据源方言使用 Oracle 12c 及以上版本支持的分页语法。Oracle 11g 及更低版本已经停止官方维护，Nacos 官方和社区插件不再向下兼容这些低版本。如果必须使用 Oracle 11g，需要基于当前数据源插件自行适配并构建自定义插件。
:::

## 选择数据库类型

推荐使用 `spring.sql.init.platform` 指定数据库类型：

```properties
spring.sql.init.platform=mysql
```

为了兼容旧版本，Nacos 仍然兼容 `spring.datasource.platform`。新部署建议统一使用 `spring.sql.init.platform`。

如果没有显式指定数据库类型，Nacos 会根据运行模式选择默认存储：

| 运行模式 | 默认存储 |
| --- | --- |
| 单机模式 | 内置 Derby |
| 集群模式 | 外置数据库 |

生产环境建议使用外置数据库，并在启动 Nacos 前导入对应数据库的 schema。

## 外置数据库配置

以 PostgreSQL 为例：

```properties
spring.sql.init.platform=postgresql
db.num=1
db.url.0=jdbc:postgresql://127.0.0.1:5432/nacos
db.user=nacos
db.password=nacos
db.pool.config.driverClassName=org.postgresql.Driver
db.pool.config.connectionTestQuery=SELECT 1
```

以 Oracle 12c 及以上版本为例：

```properties
spring.sql.init.platform=oracle
db.num=1
db.url.0=jdbc:oracle:thin:@127.0.0.1:1521:XE
db.user=nacos
db.password=nacos
db.pool.config.driverClassName=oracle.jdbc.OracleDriver
db.pool.config.connectionTestQuery=SELECT 1 FROM dual
```

`db.pool.config.*` 会传递给 HikariCP。可以按需配置 `connectionTimeout`、`maximumPoolSize`、`minimumIdle` 等连接池参数。

### 配置多个数据库连接

`db.num` 表示外置数据库连接数量。Nacos 会对多个连接做健康检查和主库选择。多个连接应属于同一种数据库类型。

```properties
spring.sql.init.platform=mysql
db.num=2
db.url.0=jdbc:mysql://db-0:3306/nacos?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
db.url.1=jdbc:mysql://db-1:3306/nacos?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
db.user.0=nacos
db.password.0=nacos_password_0
db.user.1=nacos
db.password.1=nacos_password_1
```

如果所有连接使用同一个用户名和密码，也可以只配置 `db.user` 和 `db.password`。

## 社区数据源插件

除官方内置的 4 种数据库外，Nacos 社区在 [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin) 仓库维护了一批扩展数据源插件。当前仓库中包含以下数据源扩展模块：

| 数据库 | 插件模块 |
| --- | --- |
| 达梦 | `nacos-dm-datasource-plugin-ext` |
| 人大金仓 | `nacos-kingbase-datasource-plugin-ext` |
| SQL Server | `nacos-mssql-datasource-plugin-ext` |
| OceanBase | `nacos-oceanbase-datasource-plugin-ext` |
| openGauss | `nacos-opengauss-datasource-plugin-ext` |
| Oracle 扩展实现 | `nacos-oracle-datasource-plugin-ext`，适用于 Oracle 12c 及以上版本 |
| 虚谷 | `nacos-xuguDB-datasource-plugin-ext` |
| 崖山 / YASDB | `nacos-yasdb-datasource-plugin-ext` |

社区插件的版本兼容性、schema、驱动依赖和部署方式以插件仓库对应 README 为准。生产使用前，请在测试环境完成 schema、启动、读写、升级和回滚验证。

## 部署外部插件

如果使用社区插件或自定义插件，通常需要：

1. 选择与 Nacos 版本匹配的插件版本。
2. 编译插件并取得插件 JAR。
3. 将插件 JAR 和数据库驱动 JAR 放到 `${nacos.home}/plugins`，或者通过启动参数追加到 classpath。
4. 在 `application.properties` 中设置 `spring.sql.init.platform` 为插件声明的数据库类型。
5. 导入对应数据库 schema。
6. 重启 Nacos，并检查启动日志中是否加载了目标 dialect 和 mapper。

## 自定义数据源插件

自定义数据源插件至少需要实现两类 SPI：

| SPI | 作用 |
| --- | --- |
| `com.alibaba.nacos.plugin.datasource.dialect.DatabaseDialect` | 定义数据库级 SQL 行为，例如分页、函数和主键返回方式。 |
| `com.alibaba.nacos.plugin.datasource.mapper.Mapper` | 定义 Nacos 逻辑表在该数据库下的 SQL provider。 |

一个数据库类型的 dialect 和 mapper 必须一起打包和加载。只提供 dialect 或只提供 mapper 都会导致启动或运行时失败。

当前 mapper 覆盖范围包括：

- 配置表：`config_info`、`config_info_gray`、`config_tags_relation`、`his_config_info`；
- 容量和命名空间表：`tenant_info`、`tenant_capacity`、`group_capacity`；
- AI 资源表：`ai_resource`、`ai_resource_version`。

Nacos 3.3 起当前 mapper 不再包含 Config 3.0 之前兼容迁移查询，也不再包含旧 `config_info_beta`、`config_info_tag` 表 mapper。仍保留这类旧数据的部署，应在升级到 3.3 前将 beta/tag 灰度数据迁移到 `config_info_gray` 当前灰度模型。

开发时可以参考官方默认实现中的 `derby`、`mysql`、`postgresql` 和 `oracle` 模块。插件需要在 `META-INF/services` 下注册：

```text
com.alibaba.nacos.plugin.datasource.dialect.DatabaseDialect
com.alibaba.nacos.plugin.datasource.mapper.Mapper
```

## 排障建议

| 现象 | 建议检查 |
| --- | --- |
| 启动时找不到 dialect | `spring.sql.init.platform` 是否与插件 `getType()` 返回值一致，插件 JAR 是否进入 classpath。 |
| 启动或查询时报缺少 mapper | 插件是否注册了所有 Nacos 需要的表级 mapper。 |
| 数据库连接失败 | JDBC URL、驱动类、用户名、密码、网络 ACL 和连接池参数是否正确。 |
| Oracle 11g 或更低版本分页 SQL 报错 | 当前 Oracle 插件仅支持 Oracle 12c 及以上版本。低版本 Oracle 需要自定义插件适配。 |
| PostgreSQL 升级后租户为空数据异常 | 检查是否执行了 PostgreSQL 相关 schema 和迁移脚本。 |
| 集群节点行为不一致 | 所有节点必须使用相同数据库类型、相同插件版本和兼容的 schema。 |
