---
title: 自定义环境变量
keywords: [自定义环境变量, 自定义配置, 数据库密码加密, Environment Plugin]
description: 本文介绍 Nacos 自定义环境变量插件的用途、执行规则、启用方式和开发方式。
sidebar:
    order: 8
---

# 自定义环境变量插件

自定义环境变量插件用于在 Nacos Server 消费配置项之前，对指定配置值进行转换。典型场景是数据库密码解密、部署环境特殊变量适配、敏感配置从企业密钥系统转换为 Nacos 可识别的启动配置。

它处理的是 **Nacos Server 启动期配置**，不是配置中心里的业务配置。业务配置加密请参考[配置加密插件](./config-encryption-plugin.md)。

:::note
自定义环境变量插件主要用于部署环境适配。插件 API 可能随 Nacos 版本演进，请使用和目标 Nacos 版本匹配的插件。
:::

## 工作规则

插件实现会声明自己要处理的配置 key。Nacos 启动时，如果 `nacos.custom.environment.enabled=true`，会收集这些 key 的原始值，交给插件转换，并把转换结果放回更高优先级的配置源中。

执行规则如下：

- 插件只能读取和返回自己在 `propertyKey()` 中声明的配置 key。
- 返回结果中不属于声明集合的 key 会被移除。
- 返回值为 `null` 的配置项会被移除，不会覆盖原始配置。
- 多个插件处理同一个 key 时，按 `order()` 升序执行；后写入的值覆盖先写入的值，因此更大的 `order()` 拥有更高最终优先级。

例如，一个插件声明处理 `db.password.0`，可以把配置文件中的密文转换成明文数据库密码：

```properties
nacos.custom.environment.enabled=true
db.password.0=ENC(base64-or-kms-value)
```

转换后的值会被 Nacos 数据源初始化逻辑读取。

## 启用插件

将插件 JAR 放入 `${nacos.home}/plugins`，或加入 Nacos Server 启动 classpath。插件实现需要通过 `META-INF/services/com.alibaba.nacos.plugin.environment.spi.CustomEnvironmentPluginService` 声明。

然后在 `${nacos.home}/conf/application.properties` 中开启：

```properties
nacos.custom.environment.enabled=true
```

启动后，可在 `${nacos.home}/logs/nacos.log` 中查看插件加载日志：

```text
[CustomEnvironmentPluginManager] Load customEnvironmentPluginService(...) customEnvironmentPluginName(...) successfully.
```

## 开发插件

插件依赖：

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-custom-environment-plugin</artifactId>
    <version>${project.version}</version>
</dependency>
```

实现 `com.alibaba.nacos.plugin.environment.spi.CustomEnvironmentPluginService`：

| 方法 | 说明 |
|-----|------|
| `pluginName()` | 稳定插件名称，用于日志和插件状态识别。 |
| `propertyKey()` | 插件需要转换的配置 key 集合。 |
| `order()` | 覆盖顺序，值越大最终优先级越高。 |
| `customValue(property)` | 输入为声明 key 的原始值，返回转换后的 key-value。 |

一个最小示例：

```java
public class DemoEnvironmentPlugin implements CustomEnvironmentPluginService {

    @Override
    public Set<String> propertyKey() {
        return Collections.singleton("db.password.0");
    }

    @Override
    public Map<String, Object> customValue(Map<String, Object> property) {
        String encrypted = (String) property.get("db.password.0");
        return Collections.singletonMap("db.password.0", decrypt(encrypted));
    }

    @Override
    public Integer order() {
        return 0;
    }

    @Override
    public String pluginName() {
        return "demo-environment";
    }
}
```

## 生产建议

- 明确列出插件会处理哪些配置 key，避免误改其它启动参数。
- 解密失败时应快速失败并给出清晰日志，不要让 Nacos 使用错误密码继续启动。
- 不要在插件中硬编码密钥。请使用环境变量、KMS、HSM 或企业密钥服务。
- 如果插件访问外部密钥系统，请设置超时和降级策略，避免启动过程无限等待。
- 所有节点应使用相同版本的插件 JAR 和依赖 JAR。

## 排查

| 现象 | 排查方向 |
|-----|---------|
| 插件没有生效 | 检查 `nacos.custom.environment.enabled` 是否为 `true`，JAR 是否在 classpath 中。 |
| 启动日志没有加载记录 | 检查 `META-INF/services` 文件和 `pluginName()` 是否为空。 |
| 转换后的配置没有被使用 | 检查 key 是否在 `propertyKey()` 中声明，返回 map 是否包含同一个 key。 |
| 某个 key 被多个插件覆盖 | 检查各插件的 `order()`，较大的值最终生效。 |
