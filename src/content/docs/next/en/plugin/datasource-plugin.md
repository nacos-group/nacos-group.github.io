---
title: Multiple Data Sources
keywords: [MySQL, Derby, PostgreSQL, Oracle, data source plugin, database dialect]
description: This guide explains how Nacos datasource dialect plugins work, which databases are officially supported, and how to use community or custom datasource plugins.
sidebar:
    order: 7
---

# Multiple Data Sources

Nacos uses datasource dialect plugins to support different databases. A dialect plugin handles SQL dialect differences, pagination, database functions, generated keys, and table-level mapper implementations for the Nacos logical schema.

Since Nacos 2.2.0, datasource dialects can be extended through SPI. In the current Nacos next version, the official default implementation supports four database types: `derby`, `mysql`, `postgresql`, and `oracle`.

In unified plugin management, the plugin type is `datasource-dialect`, its execution mode is `EXCLUSIVE`, its load phase is `STANDARD`, and the type is critical. The four built-in plugin identities are `datasource-dialect:derby`, `datasource-dialect:mysql`, `datasource-dialect:postgresql`, and `datasource-dialect:oracle`. None declares a `ConfigItemDefinition`, so the management APIs report `configurable=false`; connection and pool settings belong to the datasource module, not to an individual dialect plugin.

:::note
“Multiple data sources” means multiple database dialects, and multiple connection URLs within the same database type. A running Nacos cluster should select one SQL platform. Do not mix different database types in the same cluster.
:::

## Officially Supported Databases

| Database | Platform value | Typical use | Schema file |
| --- | --- | --- | --- |
| Derby | `derby` | Local development, standalone testing, quick validation | `META-INF/derby-schema.sql` |
| MySQL | `mysql` | Common production external database | `META-INF/mysql-schema.sql` |
| PostgreSQL | `postgresql` | External PostgreSQL database | `META-INF/pg-schema.sql` |
| Oracle | `oracle` | External Oracle 12c or later database | `META-INF/oracle-schema.sql` |

The official implementation is located in the `plugin-default-impl/nacos-default-datasource-plugin` module of the Nacos source repository. Each database type registers both `DatabaseDialect` and table-level `Mapper` SPI files.

:::note
The current Oracle datasource dialect uses pagination syntax supported by Oracle 12c and later. Oracle 11g and earlier versions are no longer maintained by Oracle, so the official and community Nacos plugins do not keep backward compatibility with those versions. If Oracle 11g must be used, adapt the datasource plugin and build a custom plugin.
:::

## Select A Database Type

Use the standard selector to choose the database type:

```properties
nacos.plugin.datasource-dialect.type=mysql
```

`spring.sql.init.platform` remains a legacy alias, and the standard key wins when both are present. The older `spring.datasource.platform` property has been removed and is no longer read. Dialect selection is fixed at startup and cannot be changed through the runtime plugin status API.

If the platform is not specified, Nacos selects storage based on the running mode:

| Running mode | Default storage |
| --- | --- |
| Standalone, or cluster with `-DembeddedStorage=true` | Embedded Derby |
| Ordinary cluster | External MySQL |

The selected dialect is the active critical provider. If it is missing or disabled, startup fails with the selected dialect and property instead of falling back to another discovered provider. For production, use an external database and import the matching schema before starting Nacos.

## External Database Configuration

PostgreSQL example:

```properties
nacos.plugin.datasource-dialect.type=postgresql
nacos.plugin.datasource.db.num=1
nacos.plugin.datasource.db.url.0=jdbc:postgresql://127.0.0.1:5432/nacos
nacos.plugin.datasource.db.user=nacos
nacos.plugin.datasource.db.password=nacos
nacos.plugin.datasource.db.pool.config.driver-class-name=org.postgresql.Driver
nacos.plugin.datasource.db.pool.config.connection-test-query=SELECT 1
```

Oracle 12c or later example:

```properties
nacos.plugin.datasource-dialect.type=oracle
nacos.plugin.datasource.db.num=1
nacos.plugin.datasource.db.url.0=jdbc:oracle:thin:@127.0.0.1:1521:XE
nacos.plugin.datasource.db.user=nacos
nacos.plugin.datasource.db.password=nacos
nacos.plugin.datasource.db.pool.config.driver-class-name=oracle.jdbc.OracleDriver
nacos.plugin.datasource.db.pool.config.connection-test-query=SELECT 1 FROM dual
```

The stable datasource module settings are listed below. They are static, require restart, and are not exposed by the dialect plugin detail or PUT configuration API.

| Canonical key or pattern | Legacy alias | Default/meaning |
| --- | --- | --- |
| `nacos.plugin.datasource.db.num` | `db.num` | External connection count; must be positive for external storage |
| `nacos.plugin.datasource.db.url.{index}` | `db.url.{index}` | JDBC URL for each connection |
| `nacos.plugin.datasource.db.user[.{index}]` | `db.user[.{index}]` | Shared or per-connection username |
| `nacos.plugin.datasource.db.password[.{index}]` | `db.password[.{index}]` | Shared or per-connection password; sensitive |
| `nacos.plugin.datasource.db.pool.config.connection-timeout` | `db.pool.config.connectionTimeout` or kebab-case form | `3000` ms |
| `nacos.plugin.datasource.db.pool.config.validation-timeout` | `db.pool.config.validationTimeout` or kebab-case form | `10000` ms |
| `nacos.plugin.datasource.db.pool.config.idle-timeout` | `db.pool.config.idleTimeout` or kebab-case form | `600000` ms |
| `nacos.plugin.datasource.db.pool.config.maximum-pool-size` | `db.pool.config.maximumPoolSize` or kebab-case form | `20` |
| `nacos.plugin.datasource.db.pool.config.minimum-idle` | `db.pool.config.minimumIdle` or kebab-case form | `2` |
| `nacos.plugin.datasource.db.pool.config.driver-class-name` | `db.pool.config.driverClassName` or kebab-case form | Blank uses the compatibility default driver |
| `nacos.plugin.datasource.db.pool.config.connection-test-query` | `db.pool.config.connectionTestQuery` or kebab-case form | Blank uses `SELECT 1` |
| `nacos.plugin.datasource.db.query-timeout` | JVM property `QUERYTIMEOUT` | `3` seconds |

For the same item, the canonical key wins over its alias. Indexed items are resolved independently, so canonical `url.0` and legacy `url.1` can coexist during migration. `nacos.plugin.datasource.db.pool.config.{hikari-property}` can still pass additional JavaBean properties to HikariCP, but only the stable subset above is a long-term Nacos configuration contract.

### Configure Multiple Database Connections

`db.num` is the number of external database connections. Nacos performs health checks and master selection across these connections. All connections should belong to the same database type.

```properties
nacos.plugin.datasource-dialect.type=mysql
nacos.plugin.datasource.db.num=2
nacos.plugin.datasource.db.url.0=jdbc:mysql://db-0:3306/nacos?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
nacos.plugin.datasource.db.url.1=jdbc:mysql://db-1:3306/nacos?characterEncoding=utf8&useSSL=false&serverTimezone=UTC
nacos.plugin.datasource.db.user.0=nacos
nacos.plugin.datasource.db.password.0=nacos_password_0
nacos.plugin.datasource.db.user.1=nacos
nacos.plugin.datasource.db.password.1=nacos_password_1
```

If all connections share credentials, configure only the unindexed `nacos.plugin.datasource.db.user` and `nacos.plugin.datasource.db.password`.

## Community Datasource Plugins

Besides the four official database types, the Nacos community maintains more datasource plugins in [nacos-group/nacos-plugin](https://github.com/nacos-group/nacos-plugin). The repository currently contains these datasource extension modules:

| Database | Plugin module |
| --- | --- |
| Dameng | `nacos-dm-datasource-plugin-ext` |
| Kingbase | `nacos-kingbase-datasource-plugin-ext` |
| SQL Server | `nacos-mssql-datasource-plugin-ext` |
| OceanBase | `nacos-oceanbase-datasource-plugin-ext` |
| openGauss | `nacos-opengauss-datasource-plugin-ext` |
| Oracle extension implementation | `nacos-oracle-datasource-plugin-ext`, for Oracle 12c or later |
| Xugu | `nacos-xuguDB-datasource-plugin-ext` |
| Yashan / YASDB | `nacos-yasdb-datasource-plugin-ext` |

For community plugins, follow the corresponding README for version compatibility, schema files, driver dependencies, and deployment steps. Before production use, validate schema initialization, startup, read/write behavior, upgrade, and rollback in a test environment.

## Deploy An External Plugin

When using a community or custom plugin:

1. Select a plugin version that matches your Nacos version.
2. Build the plugin JAR.
3. Put the plugin JAR and the database driver JAR into `${nacos.home}/plugins`, or add them to the startup classpath.
4. Set `nacos.plugin.datasource-dialect.type` to the database type declared by the plugin.
5. Import the matching database schema.
6. Restart Nacos and check the startup logs to confirm that the target dialect and mappers are loaded.

## Develop A Custom Datasource Plugin

A custom datasource plugin must implement at least two SPI types:

| SPI | Purpose |
| --- | --- |
| `com.alibaba.nacos.plugin.datasource.dialect.DatabaseDialect` | Database-level behavior such as pagination, functions, and generated keys. |
| `com.alibaba.nacos.plugin.datasource.mapper.Mapper` | Table-level SQL providers for the Nacos logical schema. |

The dialect and mappers for the same database type must be packaged and loaded together. Providing only one side causes startup or runtime failures.

Current mapper coverage includes:

- Config tables: `config_info`, `config_info_gray`, `config_tags_relation`, `his_config_info`;
- Capacity and namespace tables: `tenant_info`, `tenant_capacity`, `group_capacity`;
- AI resource tables: `ai_resource`, `ai_resource_version`.

Starting with Nacos 3.3, current mappers no longer include Config migration queries for versions before 3.0 and no longer include legacy `config_info_beta` or `config_info_tag` table mappers. Deployments that still have this legacy data must migrate beta/tag gray data into the current `config_info_gray` gray model before upgrading to 3.3.

Use the official `derby`, `mysql`, `postgresql`, and `oracle` modules as references. Register plugin implementations under `META-INF/services`:

```text
com.alibaba.nacos.plugin.datasource.dialect.DatabaseDialect
com.alibaba.nacos.plugin.datasource.mapper.Mapper
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Dialect not found at startup | Check whether `nacos.plugin.datasource-dialect.type` matches the plugin `getType()` value, and whether the plugin JAR is on the classpath. |
| Missing mapper error | Check whether the plugin registers all table-level mappers required by Nacos. |
| Database connection failure | Check JDBC URL, driver class, username, password, network ACL, and pool properties. |
| Pagination SQL error on Oracle 11g or earlier | The current Oracle plugin supports only Oracle 12c or later. Older Oracle versions require a custom datasource plugin. |
| PostgreSQL tenant data issue after upgrade | Check whether the PostgreSQL schema and migration scripts have been applied. |
| Inconsistent cluster behavior | All nodes must use the same database type, plugin version, and compatible schema. |
