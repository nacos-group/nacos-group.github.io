---
title: JSON Adapters and Jackson 2/3 Integration
keywords: [Java, SDK, Jackson 2, Jackson 3, JSON, Spring Boot 4]
description: Learn how Nacos Java SDK selects JSON adapters, configures Jackson dependencies, and maintains compatibility.
sidebar:
  order: 6
---

# JSON Adapters and Jackson 2/3 Integration

## 1. Background

Nacos Java SDK uses JSON for requests, local caches, and response parsing. Existing applications commonly depend on Jackson 2, while applications such as those using Spring Boot 4 may use Jackson 3. Their package names and some APIs differ, so replacing dependencies directly can cause class loading or method invocation failures.

Nacos 3.3 provides a shared JSON adapter layer for Java Client SDK and Java Maintainer SDK. It selects Jackson 2 or Jackson 3 according to the application's runtime environment. Applications continue using the existing SDK interfaces for configuration, services, and AI resources.

This setting affects the JSON implementation used by Nacos SDK. It does not change the application's own `ObjectMapper` or Spring JSON configuration. The SDK remains compatible with Java 8, but Jackson 3 requires Java 17 or later. See the [official Jackson migration guide](https://github.com/FasterXML/jackson/blob/main/jackson3/MIGRATING_TO_JACKSON_3.md) for dependency changes.

## 2. Select a JSON Adapter

### 2.1. Default auto Mode

When `nacos.client.json.adapter` is unset, the SDK uses `auto`. For the two built-in adapters, selection follows these rules:

| Adapters available at runtime | Selected implementation |
| --- | --- |
| Jackson 2 only | Jackson 2 |
| Jackson 3 only | Jackson 3 |
| Both Jackson 2 and Jackson 3 | Jackson 3 |
| Neither | Fails with a message to check dependencies and adapters |

Availability depends on whether the required classes can load at runtime, not just whether dependencies appear in `pom.xml`. Missing packaged dependencies or an incompatible Java version can make an adapter unavailable.

### 2.2. Explicit Selection

To use a specific implementation, select `jackson2` or `jackson3` with a JVM startup option:

```bash
java -Dnacos.client.json.adapter=jackson2 -jar your-application.jar
```

```bash
java -Dnacos.client.json.adapter=jackson3 -jar your-application.jar
```

This is a JVM system property. Set it before the first use of SDK JSON functionality; it is not a `Properties` parameter passed to `NacosFactory`. The selection is reused, so changing the property at runtime does not switch the existing adapter.

An explicitly selected but unavailable adapter causes an error rather than a fallback to another implementation. Remove the startup option or set it to `auto` to restore automatic selection.

## 3. Configure Dependencies

### 3.1. Continue Using Jackson 2

The regular `nacos-client` and `nacos-maintainer-client` dependencies bring in Jackson 2. Existing applications that retain these dependencies usually need no extra configuration. If an application also includes Jackson 3 but needs the SDK to keep using Jackson 2, explicitly select `jackson2` as described above.

### 3.2. Use Jackson 3

Applications provide Jackson 3 dependencies; Nacos SDK does not automatically upgrade the application to Jackson 3. For Maven, set `${jackson3.version}` to the Jackson 3 version used by your application. Omit `version` if the framework's BOM already manages it:

```xml
<dependency>
    <groupId>tools.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>${jackson3.version}</version>
</dependency>
```

This dependency brings in the matching core and annotations. Keep versions within each Jackson series consistent. When Jackson 2 and Jackson 3 coexist, you do not need to remove Jackson 2 just to select Jackson 3 for the SDK: `auto` already prefers available Jackson 3.

### 3.3. Keep Only Jackson 3

If neither the application nor its other dependencies need Jackson 2, provide Jackson 3 and exclude the Jackson 2 core/databind dependencies brought in by Nacos. Retain Jackson 2 dependencies when using Nacos versions earlier than `3.3.0`.

```xml
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-client</artifactId>
    <version>3.3.0</version>
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

For Maintainer SDK, apply the same exclusions to `nacos-maintainer-client`. **Retain `com.fasterxml.jackson.core:jackson-annotations`**: these model annotations are shared by Jackson 2 and 3 and do not mean that the application still uses Jackson 2 databind. Other dependencies may also bring in Jackson 2, so inspect the final dependency tree. Retain their required dependencies if they still use Jackson 2 types.

## 4. Verify and Troubleshoot

Inspect the dependency tree, then start the application using the same packaging method as your deployment:

```bash
mvn dependency:tree '-Dincludes=com.alibaba.nacos:*,com.fasterxml.jackson.core:*,tools.jackson.core:*'
```

Check that Nacos module versions match and that the selected Jackson core, databind, and annotations are present and compatible. With the pure SDK distribution, also include matching `nacos-api` and `nacos-common` versions as described in the [usage guide](./usage.md).

Run this JSON read/write example inside the application, then verify SDK login and an actual business operation:

```java
import com.alibaba.nacos.api.utils.json.JsonUtils;
import com.alibaba.nacos.api.utils.json.NacosTypeReference;
import java.util.Map;

Map<String, String> value = JsonUtils.toObj(
        "{\"name\":\"nacos\"}", new NacosTypeReference<Map<String, String>>() {});
System.out.println(JsonUtils.toJson(value));
```

| Symptom | What to check |
| --- | --- |
| `No available JSON adapter found` | Check for missing `nacos-common`, JSON dependencies, or packaged SPI service descriptors. |
| `Configured JSON adapter ... is not available` | Check the explicit selection, runtime dependencies, and Java version. |
| `UnsupportedClassVersionError` | Check whether the Java version used by the running process meets the selected Jackson version's requirements. |
| `NoClassDefFoundError`, `NoSuchMethodError` | Check the class named in the exception, dependency conflicts, and packaging omissions, especially partial exclusions or mixed module versions. |
| Legacy utility methods still require Jackson 2 types after switching adapters | Check for calls to Jackson-specific `JacksonUtils` APIs; use `JsonUtils` for new code. |

## 5. Design Rationale

The JSON adapter layer consists of a shared API, an SPI, and concrete adapters:

| Layer | Responsibility |
| --- | --- |
| `JsonUtils`, `NacosTypeReference<T>` | Provide JSON operations and generic type descriptions without requiring callers to depend on a particular generation of Jackson core/databind types. |
| `NacosJsonAdapter` | Defines adapter capabilities; implementations are discovered through SPI. |
| Jackson 2/3 adapters | Check dependency availability, load the corresponding implementation when needed, and perform serialization and deserialization. |

This separation keeps the SDK's public models and calling code stable. Adapters check dependencies before loading their implementations, so missing dependencies for an unused Jackson generation do not prevent SDK startup.

Legacy `JacksonUtils` compatibility APIs remain, but their exposed Jackson 2 types do not become Jackson 3 types when the adapter changes. Using the shared API in new code reduces the impact of future dependency upgrades on callers.
