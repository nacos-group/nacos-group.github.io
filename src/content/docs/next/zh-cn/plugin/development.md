---
title: 插件开发指南
keywords: [插件开发, Java SPI, PluginConfigSpec, applyConfig, PluginStartupLifecycle]
description: 说明 Nacos 服务端插件的 SPI 注册、统一配置契约、二进制兼容、生命周期和开发检查项。
sidebar:
    order: 3
---

# 插件开发指南

开发 Nacos 服务端插件时，先选择对应领域 SPI，再接入统一配置和状态。统一插件管理不会替代领域行为接口，也不会允许插件绕过 Nacos 的资源、鉴权、响应或错误模型。

## 选择领域 SPI

| pluginType | 稳定实现名来源 | 主要领域 SPI |
| --- | --- | --- |
| `auth` | `getAuthServiceName()` | `AuthPluginService` |
| `datasource-dialect` | `getType()` | `DatabaseDialect`，并配套 `Mapper` |
| `config-change` | `getServiceType()` | `ConfigChangePluginService` |
| `encryption` | `algorithmName()` | `EncryptionPluginService` |
| `trace` | `getName()` | `NacosTraceSubscriber` |
| `environment` | `pluginName()` | `CustomEnvironmentPluginService` |
| `control` | `getName()` | `ControlManagerBuilder` |
| `visibility` | `getVisibilityServiceName()` | `VisibilityService` |
| `ai-pipeline` | `pipelineId()` | `PublishPipelineService` |
| `ai-storage` | `type()` | `AiResourceStorage` / `AiResourceStorageBuilder` |
| `ai-resource-import` | `pluginName()` | `AiResourceImportServiceBuilder` |

把实现类写入对应的 `META-INF/services/{SPI 接口全限定名}`。插件 JAR 可以放到 `${nacos.home}/plugins` 或 Nacos Server 启动 classpath。外部依赖也必须在每个节点可用。

## 稳定身份和冲突

插件名称必须非空、稳定，并在同一 `pluginType` 内唯一。同类型 Provider 按 `PluginProvider.getOrder()` 升序处理（默认值为 `0`）；order 相同时保持 SPI 发现顺序。随后统一注册执行 first-wins，因此 order 较小的 Provider 先获得注册机会，后来出现的重复 `pluginId` 会被忽略并记录包含两边实现类的 WARN。Provider order 不替代 EXCLUSIVE 选择或领域路由。领域 provider 从多个 SPI 实现构造 map 时也必须先检查重复，不能用 `put` 静默覆盖。

不要把相同 order 下的 SPI 扫描顺序当成选择机制。只有确实需要 Provider 优先级时才使用不同 order；选择实现仍应使用对应类型的静态 `type` key 或领域路由字段。

## 声明统一配置

可配置的运行时实现实现 `com.alibaba.nacos.api.plugin.PluginConfigSpec`：

```java
public final class ExamplePlugin implements PluginConfigSpec {
    private volatile Map<String, String> currentConfig = Map.of();

    @Override
    public List<ConfigItemDefinition> getConfigDefinitions() {
        return List.of(
                new ConfigItemDefinition.Builder(
                        "timeout", "Timeout", ConfigItemType.NUMBER)
                        .defaultValue("3000")
                        .required(true)
                        .aliases(List.of("legacy.example.timeout"))
                        .effectMode(ConfigItemEffectMode.RUNTIME)
                        .build());
    }

    @Override
    public void applyConfig(Map<String, String> config) {
        currentConfig = Map.copyOf(config);
    }

    @Override
    public Map<String, String> getCurrentConfig() {
        return currentConfig;
    }
}
```

约束如下：

- definition 的 `key` 只写 item key。标准静态 key 由核心拼为 `nacos.plugin.{pluginType}.{pluginName}.{itemKey}`。
- 完整声明 `type`、`defaultValue`、`required`、`sensitive`、`effectMode` 和需要兼容的 `aliases`。
- 不得声明 `enabled`，它属于统一插件状态。
- `applyConfig` 接收 canonical item-key 的完整有效快照，应先校验并构建新不可变状态，再一次性发布，避免调用方观察到半更新。
- `getCurrentConfig` 返回插件最后接受的快照，不要重新读取 Spring environment。
- definition key 和 alias 也采用 first-wins；不要发布内部互相冲突的 definition。
- 对 STATIC 输入，normalized 标准完整 key 只要存在就优先，即使值为空也不回退 alias。只有标准 key 不存在时才读取 alias；同时存在多个 alias 时按该 definition 的 `aliases` 声明顺序取第一个。

只有 definition 非空时，默认 `isConfigurable()` 才返回 `true`。实现必须同时提供可靠的 `applyConfig` 和当前快照。

## effect mode

只有不需要重建不可替换运行资源的字段才标记 `RUNTIME`。以下情况通常使用 `RESTART`：

- 实现选择或路由 provider 选择；
- 密钥解析器、LDAP/OIDC client、数据库、线程池或外部进程选项在启动时构建；
- 尚未定义原子替换、关闭和失败回滚生命周期。

`environment` 属于 `PRE_CONTEXT`。即使实现把 definition 声明为 `RUNTIME`，统一管理也会复制为 `RESTART` 并记录 WARN。

## 启动生命周期

普通实现的启动流程是：

```text
发现 -> 恢复状态 -> 解析有效配置 -> applyConfig
     -> （可选）PluginStartupLifecycle.initialize -> 对领域可见
```

只有需要在配置接受后创建运行资源的适配器才实现 `PluginStartupLifecycle`。`initialize()` 必须幂等，也会用于类型延迟加载。它不自动赋予运行时 rebuild 能力。

类型级模块开关可以让非 critical 类型延迟发现。插件不应在其他静态单例或领域 manager 中再次独立加载 SPI，否则会绕过统一状态与配置。

## 旧二进制实现兼容

统一后的领域 SPI 通过默认方法继承 `PluginConfigSpec`。旧二进制实现没有 definition 时仍可加载，并显示 `configurable=false`；默认 current map 为空，默认 `applyConfig` 为 no-op。不要为了让旧插件出现在配置界面而猜测其私有属性。

新实现应主动声明 definition、实现原子 `applyConfig`，并返回当前快照。对于仍处于兼容周期的领域适配器：

- Config Change 的旧 `nacos.core.config.plugin.{name}.*` 属性仍可传给旧实现，但 `ConfigChangeConfigs` 已废弃。
- Visibility 的旧 `init(Properties)` 只用于没有统一 definition 的旧实现。

这些适配器不让旧实现自动变成 configurable。

## 安全和稳定性

- `sensitive=true` 的值不得写入日志、异常、trace 或 API；实现也要识别从核心收到的是明文有效快照。
- 外部 IO 设置连接、读取和总耗时限制。Trace/after-hook 等非主决策插件应使用独立 executor 并定义降级行为。
- 插件不能改变共享 Nacos 资源身份、v3 `Result<T>` 响应、错误码和鉴权边界。
- 集群插件包、依赖、静态配置和 alias 迁移应保持一致。
- 对 state/config update、重复 ID、重复 definition、apply 失败和滚动升级编写测试。

## 发布前检查

1. `pluginType:pluginName` 在目标集群中唯一。
2. SPI 文件名和实现类全限定名正确，构造条件满足。
3. definition 不包含 `enabled`，key/alias 无冲突。
4. `applyConfig` 原子且可重复调用；same-map 重试安全。
5. `RUNTIME` 字段真的支持在线替换，其他字段为 `RESTART`。
6. 插件 disabled 时领域入口会检查统一状态。
7. active critical provider 缺失或禁用时能明确失败。
8. 文档列出所有 canonical key、alias、默认值、敏感性和生效模式。
