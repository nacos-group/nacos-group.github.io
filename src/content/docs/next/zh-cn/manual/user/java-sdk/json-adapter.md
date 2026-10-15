---
title: JSON 适配与 Jackson 2/3 接入
keywords: [Java, SDK, Jackson 2, Jackson 3, JSON, Spring Boot 4]
description: 了解 Nacos Java SDK 的 JSON 适配器选择方式、Jackson 依赖配置和兼容设计。
sidebar:
  order: 6
---

# JSON 适配与 Jackson 2/3 接入

## 1. 背景

Nacos Java SDK 在请求收发、本地缓存和结果解析中使用 JSON。已有应用通常依赖 Jackson 2，而 Spring Boot 4 等应用可能使用 Jackson 3。两者的包名和部分 API 不同，直接替换依赖可能导致类加载或方法调用失败。

Nacos 3.3 为 Java Client SDK 和 Java Maintainer SDK 提供统一的 JSON 适配层，让 SDK 根据应用的运行环境选择 Jackson 2 或 Jackson 3。应用仍通过原有 SDK 接口访问 Nacos，无需修改配置、服务或 AI 资源的调用代码。

这项配置只影响 Nacos SDK 使用的 JSON 实现，不会修改应用自身的 `ObjectMapper` 或 Spring 的 JSON 配置。SDK 保持 Java 8 兼容，但 Jackson 3 要求 Java 17 及以上；具体依赖变化可参考 [Jackson 官方迁移指南](https://github.com/FasterXML/jackson/blob/main/jackson3/MIGRATING_TO_JACKSON_3.md)。

## 2. 选择 JSON 适配器

### 2.1. 默认 auto 模式

不配置 `nacos.client.json.adapter` 时使用 `auto`。对于内置的两个适配器，选择规则如下：

| 运行时可用的适配器 | 使用的实现 |
| --- | --- |
| 仅 Jackson 2 | Jackson 2 |
| 仅 Jackson 3 | Jackson 3 |
| Jackson 2 和 Jackson 3 均可用 | Jackson 3 |
| 均不可用 | 报错，提示检查依赖及适配器 |

“可用”取决于运行时能否加载所需的类，不能只看 `pom.xml` 中是否声明了依赖。例如，应用打包时遗漏依赖或 Java 版本不满足要求，都可能使适配器不可用。

### 2.2. 手动指定

需要固定实现时，在 JVM 启动参数中选择 `jackson2` 或 `jackson3`：

```bash
java -Dnacos.client.json.adapter=jackson2 -jar your-application.jar
```

```bash
java -Dnacos.client.json.adapter=jackson3 -jar your-application.jar
```

该选项是 JVM 系统属性，应在首次使用 SDK JSON 功能之前设置，不是传给 `NacosFactory` 的 `Properties` 参数。选择结果会被复用，运行中修改属性不会切换已有的适配器。

显式指定的适配器不可用时会报错，不会自动改用另一个实现。需要恢复自动选择时，去掉启动参数或设置为 `auto`。

## 3. 配置依赖

### 3.1. 继续使用 Jackson 2

普通 `nacos-client` 和 `nacos-maintainer-client` 依赖会引入 Jackson 2。已有应用如果没有排除这些依赖，通常不需要额外配置。若应用同时引入了 Jackson 3，但希望 SDK 继续使用 Jackson 2，可按上一节显式指定 `jackson2`。

### 3.2. 使用 Jackson 3

Jackson 3 依赖由应用提供，Nacos SDK 不会自动将应用升级到 Jackson 3。下面以 Maven 为例；将 `${jackson3.version}` 设置为应用使用的 Jackson 3 版本，若框架的 BOM 已管理该版本，可省略 `version`：

```xml
<dependency>
    <groupId>tools.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>${jackson3.version}</version>
</dependency>
```

该依赖会引入配套的 core 和 annotations。保持同一 Jackson 系列的版本一致；同时存在 Jackson 2、Jackson 3 时无需仅为 SDK 选择 Jackson 3 而删除 Jackson 2，`auto` 已优先选择可用的 Jackson 3。

### 3.3. 仅保留 Jackson 3

应用及其他依赖均不再需要 Jackson 2 时，可以在提供 Jackson 3 的基础上，排除 Nacos 引入的 Jackson 2 core/databind。使用 `3.3.0` 以下版本时，请保留 Jackson 2 依赖。

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>${nacos.client.version}</version>
    <exclusions>
        <exclusion>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
        </exclusion>
        <exclusion>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

Maintainer SDK 可在 `nacos-maintainer-client` 依赖上配置相同的排除项。**保留 `com.fasterxml.jackson.core:jackson-annotations`**：它是 Jackson 2/3 共用的模型注解，并不代表应用仍在使用 Jackson 2 databind。其他依赖也可能引入 Jackson 2，需要检查最终依赖树；若它们仍使用 Jackson 2 类型，应继续保留所需依赖。

## 4. 验证与排查

先查看依赖树，再使用应用实际部署的打包方式启动验证：

```bash
mvn dependency:tree '-Dincludes=com.alibaba.nacos:*,com.fasterxml.jackson.core:*,tools.jackson.core:*'
```

确认 Nacos 模块版本一致，所选 Jackson 的 core、databind 和 annotations 均存在且版本兼容。使用纯净版 SDK 时，还需按[使用手册](./usage.md)引入同版本的 `nacos-api` 和 `nacos-common`。

可在应用中运行下面的 JSON 读写示例，再验证 SDK 登录和一次实际业务调用：

```java
import com.alibaba.nacos.api.utils.json.JsonUtils;
import com.alibaba.nacos.api.utils.json.NacosTypeReference;
import java.util.Map;

Map<String, String> value = JsonUtils.toObj(
        "{\"name\":\"nacos\"}", new NacosTypeReference<Map<String, String>>() {});
System.out.println(JsonUtils.toJson(value));
```

| 现象 | 检查方式 |
| --- | --- |
| `No available JSON adapter found` | 检查是否缺少 `nacos-common`、JSON 依赖或打包后的 SPI 服务描述文件。 |
| `Configured JSON adapter ... is not available` | 检查显式选择值、运行时依赖和 Java 版本。 |
| `UnsupportedClassVersionError` | 检查实际启动进程使用的 Java 版本，是否满足所选 Jackson 版本的要求。 |
| `NoClassDefFoundError`、`NoSuchMethodError` | 检查异常中的类名、依赖冲突及打包遗漏，特别是只排除了部分依赖或混用了不同版本的模块。 |
| 切换适配器后，旧工具方法仍要求 Jackson 2 类型 | 检查是否直接调用了旧 `JacksonUtils` 的 Jackson 专属接口；新代码使用 `JsonUtils`。 |

## 5. 设计思路

JSON 适配层分为统一入口、SPI 和具体适配器三部分：

| 层次 | 职责 |
| --- | --- |
| `JsonUtils`、`NacosTypeReference<T>` | 提供 JSON 操作和泛型类型描述，调用方无需依赖某一代 Jackson 的 core/databind 类型。 |
| `NacosJsonAdapter` | 定义适配器需要提供的能力，由 SPI 发现实现。 |
| Jackson 2/3 适配器 | 检查依赖是否可用，在需要时加载对应实现，完成实际序列化和反序列化。 |

这样的划分使 SDK 的公开模型和调用代码可以保持稳定。适配器先检查依赖、再延迟加载实现，避免应用仅使用某一代 Jackson 时，另一代实现因缺少依赖而阻止 SDK 启动。

旧 `JacksonUtils` 保留兼容接口，但其中暴露的 Jackson 2 类型不会随适配器切换而变成 Jackson 3 类型。新代码使用统一入口，有助于减少后续依赖升级对调用方的影响。
