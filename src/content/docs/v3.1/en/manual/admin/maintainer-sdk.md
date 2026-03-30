---
title: Maintainer SDK
keywords: [ Java,Admin,Maintainer,SDK,Manual ]
description: This document describes the usage of the Nacos Operations and Maintenance SDK (nacos-maintainer-sdk), including how to configure the SDK and utilize its APIs.
sidebar:
  order: 11
---

# 运维SDK

Nacos 的 运维SDK（或称Nacos-Maintainer-SDK），是一个针对 Nacos 配置中心、服务注册中心、分布式锁等功能`运维`场景下的的 Java
SDK。旨在为Nacos的运维人员或部分特殊应用场景（如`网关类应用`，`控制台类应用`
）提供稳定易用的配置中心、服务注册中心、分布式锁等功能，方便运维人员或特殊应用访问Nacos进行配置、服务和分布式锁的操作。

因为Nacos 的 运维SDK的定位，Nacos的运维SDK会提供大范围的数据获取API，因此Nacos的运维SDK需要使用较高权限的身份进行登录后才能使用，以防止存在数据泄漏的隐患。

如果您的使用场景不是运维人员操作或特殊应用场景（如`网关类应用`，`控制台类应用`），请使用`Nacos Client`
（如[Nacos Java Client](../user/java-sdk/usage.md), [Nacos Go Client](../user/go-sdk/usage.md)等)。

> 目前 Nacos 的 运维SDK只支持Java SDK，后续会支持更多语言的SDK。
>
> Nacos的运维SDK基于[Nacos Admin API](./admin-api.md)实现，相同的能力可以通过对应的[Nacos Admin API](./admin-api.md)进行操作。

## 1. 引用概述

### 1.1. Java 版本依赖

Nacos 的 Java SDK需要 JDK 1.8 及以上版本的Java运行环境。

### 1.2. Maven 坐标

```
<!-- 3.0.0 及以上 版本支持 -->
<dependency>-->
    <groupId>com.alibaba.nacos</groupId>-->
    <artifactId>nacos-maintainer-client</artifactId>-->
    <version>${nacos.client.version}</version>-->
</dependency>-->
```

## 2. 初始化SDK

Nacos 初始化SDK时需要使用对应的工厂 `Factory` 类进行不同模块的创建：

```java

Properties properties = new Properties();
# 指定Nacos-Server的地址
properties.setProperty("serverAddr","localhost:8848");

# 设置Nacos的管理员用户密码
properties.setProperty("username","nacos");
properties.setProperty("password","{your_admin_password}");

# 初始化配置中心的Nacos Maintainer Service
ConfigMaintainerService configMaintainerService = ConfigMaintainerFactory.createConfigMaintainerService(properties);

# 初始化注册中心的Nacos Maintainer Service
NamingMaintainerService maintainService = NamingMaintainerFactory.createNamingMaintainerService(properties);
```

## 3. 配置中心运维 API

### 3.1. 获取配置

#### 描述

从 Nacos 获取配置。

```java
ConfigDetailInfo getConfig(String dataId) throws NacosException;

ConfigDetailInfo getConfig(String dataId, String groupName) throws NacosException;

ConfigDetailInfo getConfig(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| namespaceId | long   | 配置所属的命名空间ID。                                         |

#### 返回值

| 参数类型             | 描述      |
|:-----------------|:--------|
| ConfigDetailInfo | 配置的具体信息 |

具体ConfigDetailInfo的内容如下：

| 参数名              | 参数类型   | 描述                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | 配置在实际存储介质中的ID，没有业务含义，仅作为配置在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId      | string | 配置所属的命名空间ID。                                         |
| groupName        | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId           | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5              | string | 配置内容的md5值。                                           |
| type             | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName          | string | 配置所属的应用名称。                                           |
| createTime       | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime       | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |
| content          | string | 配置内容。                                                |
| desc             | string | 配置的描述信息。                                             |
| encryptedDataKey | string | 配置的加密密钥，当使用配置的加密功能时，该字段才有值。                          |
| createUser       | string | 创建此配置的用户名。                                           |
| createIp         | string | 创建此配置的来源IP。                                          |
| configTags       | string | 此配置的标签，多个标签用逗号`,`分隔。                                 |

#### 请求示例

```java
try {
    # 以下3种调用均会获得 `public`命名空间下，groupName为`DEFAULT_GROUP`，dataId为`maintain.client.test`的配置信息。
    ConfigDetailInfo configDetailInfo = configMaintainerService.getConfig("maintain.client.test");
    configDetailInfo = configMaintainerService.getConfig("maintain.client.test", Constants.DEFAULT_GROUP);
    configDetailInfo = configMaintainerService.getConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.2. 发布配置

#### 描述

用于发布 Nacos 配置，以便通过自动化手段降低运维成本。

:::note
创建和修改配置时使用的同一个发布接口，当配置不存在时会创建配置，当配置已存在时会更新配置。
:::

```java
boolean publishConfig(String dataId, String content) throws NacosException;

boolean publishConfig(String dataId, String groupName, String content) throws NacosExceptio;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content, String desc) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content, String desc, String type) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content, String appName, String srcUser, String configTags, String desc, String type) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                                             |
|:------------|:-------|:-------------------------------------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 256 字节。                           |
| groupName   | string | 配置分组。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 128 字节。                            |
| namespaceId | long   | 配置所属的命名空间ID。                                                                   |
| content     | string | 配置内容，不超过 100K 字节。                                                              |
| desc        | string | 配置的描述内容。                                                                       |
| type        | string | 配置类型，见 `com.alibaba.nacos.api.config.ConfigType`，默认为TEXT                       |
| appName     | string | 配置所属的应用名称。                                                                     |
| srcUser     | string | 创建此配置的用户名，即代理此用户进行配置发布，此配置的`createUser`将为此用户，若传入空字串，则表示当前登录的用户名作为`createUser`。 |
| configTags  | string | 此配置的标签，多个标签用逗号`,`分隔。                                                           |

#### 返回参数

| 参数类型    | 描述     |
|:--------|:-------|
| boolean | 是否发布成功 |

#### 请求示例

```java
try {
# 以下调用均会在 `public`命名空间下，创建groupName为`DEFAULT_GROUP`，dataId为`maintain.client.test`的配置, 配置内容为`testContent`。
    boolean result = configMaintainerService.publishConfig("maintain.client.test", "testContent");
    result = configMaintainerService.publishConfig("maintain.client.test", Constants.DEFAULT_GROUP, "testContent");
    result = configMaintainerService.publishConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testContent");
    result = configMaintainerService.publishConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testContent", "test");
    result = configMaintainerService.publishConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testContent", "test", "TEXT");
    result = configMaintainerService.publishConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testContent", "testApp", null, "testTag", "test", "TEXT");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.3. 删除配置

#### 描述

用于删除 Nacos 配置，以便通过自动化手段降低运维成本。

:::note
当配置已存在时会删除该配置，当配置不存在时会直接返回成功消息。
:::

```java
boolean deleteConfig(String dataId) throws NacosException;

boolean deleteConfig(String dataId, String groupName) throws NacosException;

boolean deleteConfig(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| namespaceId | long   | 配置所属的命名空间ID。                                         |

#### 返回参数

| 参数类型    | 描述     |
|:--------|:-------|
| boolean | 是否删除成功 |

#### 请求示例

```java
try {
    # 以下3种调用均会删除 `public`命名空间下，groupName为`DEFAULT_GROUP`，dataId为`maintain.client.test`的配置信息。
    boolean result =  configMaintainerService.deleteConfig("maintain.client.test");
    result = configMaintainerService.deleteConfig("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.deleteConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.4. 批量删除配置

#### 描述

用于批量删除 Nacos 配置，以便通过自动化手段降低运维成本。

```java
boolean deleteConfigs(List<Long> ids) throws NacosException;
```

#### 请求参数

| 参数名 | 参数类型        | 描述                                                                                  |
|:----|:------------|:------------------------------------------------------------------------------------|
| ids | List\<Long> | 待删除配置的ID列表，此ID为配置在实际存储介质中的ID，需要从[获取配置](#31-获取配置)或[获取配置列表](#35-获取配置列表)API中的`id`字段获取。 |

#### 返回值

| 参数类型    | 描述     |
|:--------|:-------|
| boolean | 是否删除成功 |

#### 请求示例

```java
try {
    ConfigDetailInfo configDetailInfo = configMaintainerService.getConfig("maintain.client.test");
    boolean result = configMaintainerService.deleteConfigs(Collections.singletonList(configDetailInfo.getId()));
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.5. 获取配置列表

#### 描述

可以通过此API，获取获取满足条件的配置列表，不支持模糊查询，若需要进行模糊查询，请使用[搜索配置列表](#36-搜索配置列表)API。

```java
Page<ConfigBasicInfo> listConfigs(String namespaceId) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId, String type) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId, String type, String configTags, String appName) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId, String type, String configTags, String appName, int pageNo, int pageSize) throws NacosException;

```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                                                |
|:------------|:-------|:----------------------------------------------------------------------------------|
| namespaceId | long   | 配置所属的命名空间ID。                                                                      |                                                                                                 |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节, 默认为""，不为空时则只会匹配dataId为此值的配置。 |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节，默认为""，不为空时则只会匹配groupName为此值的配置。    |
| type        | string | 配置类型，见 `com.alibaba.nacos.api.config.ConfigType`，默认为""，不为空时则只会匹配类型为此值的配置。         |
| configTags  | string | 此配置的标签，多个标签用逗号`,`分隔，默认为""，不为空时则只会匹配标签为此值的配置。                                      |
| appName     | string | 配置所属的应用名称，默认为""，不为空时则只会匹配应用名为此值的配置。                                               |
| pageNo      | int    | 配置列表的分页页码，默认为1。                                                                   |
| pageSize    | int    | 配置列表的分页大小，默认为100。                                                                 |

#### 返回参数

| 参数类型                   | 描述        |
|:-----------------------|:----------|
| Page\<ConfigBasicInfo> | 配置列表的分页结果 |

具体Page及ConfigBasicInfo的内容如下：

| 参数名            | 参数类型                   | 描述           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | 符合该条件下的配置总数。 |
| pageNumber     | int                    | 当前页码。        |
| pagesAvailable | int                    | 分页的总页数。      |
| pageItems      | List\<ConfigBasicInfo> | 当前页的配置列表。    |

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | 配置在实际存储介质中的ID，没有业务含义，仅作为配置在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId | string | 配置所属的命名空间ID。                                         |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5         | string | 配置内容的md5值。                                           |
| type        | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName     | string | 配置所属的应用名称。                                           |
| createTime  | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime  | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |

#### 请求示例

```java
try {
    # 获取`public`命名空间下所有配置的第一页（最大100个）。
    Page<ConfigBasicInfo> result = configMaintainerService.listConfigs(Constants.DEFAULT_NAMESPACE_ID);
    # 获取`public`命名空间下配置分组为`DEFAULT_GROUP`的所有配置的第一页（最大100个）。
    result = configMaintainerService.listConfigs("", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
    # 获取`public`命名空间下类型为`JSON`的所有配置的第一页（最大100个）。
    result = configMaintainerService.listConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "JSON");
    # 获取`public`命名空间下带有标签为`testTag1`且配置所属应用为`testApp`的所有配置的第一页（最大100个）。
    result = configMaintainerService.listConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "testTag1", "testApp");
    # 获取`public`命名空间下所有配置的第一页（最大10个）。
    result = configMaintainerService.listConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "", "", 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.6. 搜索配置列表

#### 描述

可以通过此API，获取获取满足条件的配置列表，支持模糊查询，若需要进行精确查询，请使用[查询配置列表](#35-获取配置列表)API。

:::note
此接口较为消耗性能，建议谨慎使用，特别是通过`配置内容`进行搜索时，性能将严重下降。
:::

```java
Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String type) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String configDetail, String type) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String configDetail, String type, String configTags, String appName) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String configDetail, String type, String configTags, String appName, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名          | 参数类型   | 描述                                                                                     |
|:-------------|:-------|:---------------------------------------------------------------------------------------|
| namespaceId  | long   | 配置所属的命名空间ID。                                                                           |                                                                                                 |
| dataId       | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节, 默认为""，不为空时则只会匹配所有dataId`包含`此值的配置。 |
| groupName    | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节，默认为""，不为空时则只会匹配groupName`包含`此值的配置。      |
| type         | string | 配置类型，见 `com.alibaba.nacos.api.config.ConfigType`，默认为""，不为空时则只会匹配类型为此值的配置。              |
| configDetail | string | 配置的内容，默认为""，不为空时则只会匹配配置内容包含此值的配置。                                                      |
| configTags   | string | 此配置的标签，多个标签用逗号`,`分隔，默认为""，不为空时则只会匹配标签为此值的配置。                                           |
| appName      | string | 配置所属的应用名称，默认为""，不为空时则只会匹配应用名为此值的配置。                                                    |
| pageNo       | int    | 配置列表的分页页码，默认为1。                                                                        |
| pageSize     | int    | 配置列表的分页大小，默认为100。                                                                      |

#### 返回参数

| 参数类型                   | 描述        |
|:-----------------------|:----------|
| Page\<ConfigBasicInfo> | 配置列表的分页结果 |

具体Page及ConfigBasicInfo的内容如下：

| 参数名            | 参数类型                   | 描述           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | 符合该条件下的配置总数。 |
| pageNumber     | int                    | 当前页码。        |
| pagesAvailable | int                    | 分页的总页数。      |
| pageItems      | List\<ConfigBasicInfo> | 当前页的配置列表。    |

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | 配置在实际存储介质中的ID，没有业务含义，仅作为配置在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId | string | 配置所属的命名空间ID。                                         |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5         | string | 配置内容的md5值。                                           |
| type        | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName     | string | 配置所属的应用名称。                                           |
| createTime  | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime  | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |

#### 请求示例

```java
try {
    # 获取`public`命名空间下配置分组包含`test`字符的所有配置的第一页（最大100个）。
    Page<ConfigBasicInfo> result = configMaintainerService.searchConfigs("", "test", Constants.DEFAULT_NAMESPACE_ID);
    # 获取`public`命名空间下类型为`JSON`的所有配置的第一页（最大100个）。
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "JSON");
    # 获取`public`命名空间下配置内容包含`test`字符的所有配置的第一页（最大100个）。
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "test", "");
    # 获取`public`命名空间下标签为`testTag1`且配置所属应用为`testApp`的所有配置的第一页（最大100个）。
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "", "testTag1", "testApp");
    # 获取`public`命名空间下所有配置的第一页（最大10个）。
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "", "", "", 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.7. 克隆配置

#### 描述

通过此API，可以将所指定的配置克隆到另一个命名空间下，克隆时可以指定新的`groupName`及`dataId`.

```java
Map<String, Object> cloneConfig(String namespaceId, List<ConfigCloneInfo> cloneInfos, String srcUser, SameConfigPolicy policy) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型                   | 描述                                                                               |
|:------------|:-----------------------|:---------------------------------------------------------------------------------|
| namespaceId | string                 | 克隆的目标命名空间ID                                                                      |
| cloneInfos  | List\<ConfigCloneInfo> | 需要克隆的配置列表                                                                        |
| srcUser     | string                 | 克隆此配置的用户名，即代理此用户进行配置克隆，克隆的配置的`createUser`将为此用户，若传入空字串，则表示当前登录的用户名作为`createUser`。 |
| policy      | SameConfigPolicy       | 克隆配置时出现冲突后的处理策略，默认为`ABORT`，可选值为`ABORT`(终止）,`SKIP`（跳过）,`OVERWRITE`（覆盖）。           |

其中ConfigCloneInfo中的参数详情为：

| 参数名             | 参数类型   | 描述                                                                    |
|:----------------|:-------|:----------------------------------------------------------------------|
| configId        | long   | 配置在实际存储介质中的ID，没有业务含义，仅作为配置在存储介质中的唯一标识。一般为唯一自增ID。                      |
| targetGroupName | string | 目标配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节，为空时则使用配置当前的分组。       |
| targetDataId    | string | 目标配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节，为空时则使用配置当前的 ID。 |

#### 返回参数

| 参数类型                | 描述                                                 |
|:--------------------|:---------------------------------------------------|
| Map<String, Object> | 克隆配置的结果，根据`policy`的不同，可能返回成功的数量，失败的数量，跳过的数量，或覆盖的数量 |

#### 请求示例

```java
try {
    # 将配置ID为1的配置克隆到`cloue-test`命名空间下，克隆策略为`ABORT`，即如果目标命名空间下有同名配置，则克隆失败。
    ConfigCloneInfo configCloneInfo = new ConfigCloneInfo();    
    configCloneInfo.setConfigId(1L);
    Map<String, Object> result = configMaintainerService.cloneConfig("cloue-test", Collections.singletonList(configCloneInfo), "", SameConfigPolicy.ABORT);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.8. 获取命名空间下所有配置列表

#### 描述

通过此接口，可以获取指定命名空间下所有的配置列表。

:::note
此API不同于[查询配置列表](#35-获取配置列表)，不会进行分页，而是将命名空间下所有的配置一次性返回，需要确保使用此API时，命名空间下的配置数量不能太大，否则可能会导致内存溢出。
尽量使用[查询配置列表](#35-获取配置列表)，进行分页查询。
:::

```java
List<ConfigBasicInfo> getConfigListByNamespace(String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述          |
|:------------|:-------|:------------|
| namespaceId | string | 配置所属的命名空间ID |

#### 返回参数

| 参数类型                   | 描述        |
|:-----------------------|:----------|
| List\<ConfigBasicInfo> | 配置列表的分页结果 |

具体ConfigBasicInfo的内容如下：

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | 配置在实际存储介质中的ID，没有业务含义，仅作为配置在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId | string | 配置所属的命名空间ID。                                         |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5         | string | 配置内容的md5值。                                           |
| type        | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName     | string | 配置所属的应用名称。                                           |
| createTime  | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime  | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |

#### 请求示例

```java
try {
    List<ConfigBasicInfo> result = configMaintainerService.getConfigListByNamespace(Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.9. 获取配置订阅者列表

#### 描述

通过此接口，可以获取某个配置的订阅者列表。若希望获取某个配置订阅者订阅了哪些配置，请使用[获取某个订阅者订阅的所有配置列表](#310-获取某个订阅者订阅的所有配置列表)。

```java
ConfigListenerInfo getListeners(String dataId, String groupName) throws NacosException;

ConfigListenerInfo getListeners(String dataId, String groupName, String namespaceId, boolean aggregation) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型    | 描述                                                            |
|:------------|:--------|:--------------------------------------------------------------|
| groupName   | string  | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。               |
| dataId      | string  | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。          |
| namespaceId | string  | 配置所属的命名空间ID。                                                  |
| aggregation | boolean | 是否聚合查询，默认为true，为false时仅查询请求所在节点的订阅者列表，为true时查询整个集群中此配置的订阅者列表。 |

#### 返回参数

| 参数类型               | 描述       |
|:-------------------|:---------|
| ConfigListenerInfo | 配置的订阅者信息 |

其中ConfigListenerInfo的内容如下：

| 参数名             | 参数类型                        | 描述                                     |
|:----------------|:----------------------------|:---------------------------------------|
| queryType       | string                      | 此接口固定返回`config`                        |
| listenersStatus | Map\<String, List\<String>> | 订阅者列表，key为订阅者的IP，value为此订阅者订阅到的配置的md5值 |

#### 请求示例

```java
try {
    # 以下两种调用，均获取`public`命名空间ID，`DEFAULT_GROUP`分组，`maintain.client.test`配置的全集群的订阅者列表。
    ConfigListenerInfo result = configMaintainerService.getListeners("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.getListeners("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.10. 获取某个订阅者订阅的所有配置列表

#### 描述

通过此接口，可以获取某个配置订阅者所订阅的配置列表。若希望查询配置的订阅者列表，请使用[获取配置订阅者列表](#39-获取配置订阅者列表)。

```java
ConfigListenerInfo getAllSubClientConfigByIp(String ip, boolean all, String namespaceId, boolean aggregation) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型    | 描述                                                                                            |
|:------------|:--------|:----------------------------------------------------------------------------------------------|
| ip          | string  | 配置订阅者的IP                                                                                      |
| all         | boolean | 是否查询所有相同IP的订阅者所订阅的配置列表，默认为false，为false时仅返回第一个匹配到`ip`的订阅者订阅的配置列表，为true时返回所有匹配到`ip`的订阅者订阅的配置列表。 |
| namespaceId | string  | 配置所属的命名空间ID。                                                                                  |
| aggregation | boolean | 是否聚合查询，默认为true，为false时仅查询请求所在节点的订阅者列表，为true时查询整个集群中此配置的订阅者列表。                                 |

#### 返回参数

| 参数类型               | 描述       |
|:-------------------|:---------|
| ConfigListenerInfo | 配置的订阅者信息 |

其中ConfigListenerInfo的内容如下：

| 参数名             | 参数类型                        | 描述                                                                   |
|:----------------|:----------------------------|:---------------------------------------------------------------------|
| queryType       | string                      | 此接口固定返回`ip`                                                          |
| listenersStatus | Map\<String, List\<String>> | 订阅者列表，key为订阅的配置的`dataId+groupName+namespaceId`，value为此订阅者订阅到的配置的md5值 |

#### 请求示例

```java
try {
    ConfigListenerInfo result = configMaintainerService.getAllSubClientConfigByIp("127.0.0.1", false, Constants.DEFAULT_NAMESPACE_ID, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.11. 发布Beta灰度配置

#### 描述

用于灰度发布 Nacos 配置，方便修改配置时进行测试，降低因配置错误导致的应用故障范围。

:::note
灰度发布的配置不能重复灰度，若该配置已经存在一个Beta灰度配置存在，则该接口将发布失败，需要先[停止灰度](#312-停止配置Beta灰度)后，再重新发布。
:::

```java
boolean publishBetaConfig(String dataId, String groupName, String namespaceId, String content, String appName, String srcUser, String configTags, String desc, String type, String betaIps) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                                             |
|:------------|:-------|:-------------------------------------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 256 字节。                           |
| groupName   | string | 配置分组。只允许英文字符和 4 种特殊字符（“.”、“:”、“-”、“\_”），不超过 128 字节。                            |
| namespaceId | long   | 配置所属的命名空间ID。                                                                   |
| content     | string | 配置内容，不超过 100K 字节。                                                              |
| desc        | string | 配置的描述内容。                                                                       |
| type        | string | 配置类型，见 `com.alibaba.nacos.api.config.ConfigType`，默认为TEXT                       |
| appName     | string | 配置所属的应用名称。                                                                     |
| srcUser     | string | 创建此配置的用户名，即代理此用户进行配置发布，此配置的`createUser`将为此用户，若传入空字串，则表示当前登录的用户名作为`createUser`。 |
| configTags  | string | 此配置的标签，多个标签用逗号`,`分隔。                                                           |
| betaIps     | string | 配置的灰度IP列表，多个IP用逗号`,`分隔。                                                        |

#### 返回参数

| 参数类型    | 描述     |
|:--------|:-------|
| boolean | 是否发布成功 |

#### 请求示例

```java
try {
    # 对`127.0.0.1`这个ip进行`maintain.client.test`配置的Beta灰度。
    boolean result = configMaintainerService.publishBetaConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testBeta", "testApp", "", "testTag1", "test", "TEXT", "127.0.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.12. 停止配置Beta灰度

#### 描述

停止指定配置的Beta配置

:::note
只有通过[发布Beta灰度配置](#311-发布beta灰度配置)将配置变更为Beta发布中的状态，调用此接口才能停止Beta发布状态。
:::

```java
boolean stopBeta(String dataId, String groupName) throws NacosException;

boolean stopBeta(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| namespaceId | string | 配置所属的命名空间ID。                                         |

#### 返回参数

| 参数类型    | 描述           |
|:--------|:-------------|
| boolean | 是否停止Beta灰度成功 |

#### 请求示例

```java
try {
    # 对`127.0.0.1`这个ip进行`maintain.client.test`配置的Beta灰度。
    boolean result = configMaintainerService.publishBetaConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testBeta", "testApp", "", "testTag1", "test", "TEXT", "127.0.0.1");
    # 停止`maintain.client.test`配置的Beta灰度
    result = configMaintainerService.stopBeta("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.stopBeta("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.13. 查询Beta灰度的配置

#### 描述

查询指定配置的Beta配置

:::note
只有通过[发布Beta灰度配置](#311-发布beta灰度配置)将配置变更为Beta发布中的状态，调用此接口才能查询Beta发布状态。
:::

```java
ConfigGrayInfo queryBeta(String dataId, String groupName) throws NacosException;

ConfigGrayInfo queryBeta(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| namespaceId | string | 配置所属的命名空间ID。                                         |


#### 返回参数

| 参数类型           | 描述      |
|:---------------|:--------|
| ConfigGrayInfo | 灰度配置的信息 |

其中ConfigGrayInfo的内容如下：

| 参数名              | 参数类型   | 描述                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | 配置在实际存储介质中的ID，没有业务含义，仅作为配置在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId      | string | 配置所属的命名空间ID。                                         |
| groupName        | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId           | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5              | string | 配置内容的md5值。                                           |
| type             | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName          | string | 配置所属的应用名称。                                           |
| createTime       | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime       | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |
| content          | string | 配置内容。                                                |
| desc             | string | 配置的描述信息。                                             |
| encryptedDataKey | string | 配置的加密密钥，当使用配置的加密功能时，该字段才有值。                          |
| createUser       | string | 创建此配置的用户名。                                           |
| createIp         | string | 创建此配置的来源IP。                                          |
| configTags       | string | 此配置的标签，多个标签用逗号`,`分隔。                                 |
| grayName         | string | 灰度名称，固定为`beta`                                       |
| grayRule         | string | 灰度的规则，格式为`json`,其中的`expr`为灰度的ip列表                    |

#### 请求示例

```java
try {
    # 对`127.0.0.1`这个ip进行`maintain.client.test`配置的Beta灰度。
    boolean publishResult = configMaintainerService.publishBetaConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testBeta", "testApp", "", "testTag1", "test", "TEXT", "127.0.0.1");
    # 查询`maintain.client.test`配置的Beta灰度
    ConfigGrayInfo result = configMaintainerService.queryBeta("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.queryBeta("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);} 
catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.14. 获取配置历史历史版本列表

#### 描述

获取指定配置的历史版本列表

```java
Page<ConfigHistoryBasicInfo> listConfigHistory(String dataId, String group, String namespaceId, Integer pageNo, Integer pageSize) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| namespaceId | string | 配置所属的命名空间ID。                                         |
| pageNo      | int    | 配置历史版本列表的分页页码，默认为1。                                  |
| pageSize    | int    | 配置历史版本列表的分页大小，默认为100。                                |


#### 返回参数

| 参数类型                          | 描述            |
|:------------------------------|:--------------|
| Page\<ConfigHistoryBasicInfo> | 配置历史版本列表的分页结果 |

其中Page及ConfigHistoryBasicInfo的内容如下：

| 参数名            | 参数类型                          | 描述               |
|:---------------|:------------------------------|:-----------------|
| totalCount     | int                           | 符合该条件下的配置历史版本总数。 |
| pageNumber     | int                           | 当前页码。            |
| pagesAvailable | int                           | 分页的总页数。          |
| pageItems      | List\<ConfigHistoryBasicInfo> | 当前页的配置历史版本列表。    |

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | 配置历史版本的ID，没有业务含义，仅作为配置历史版本在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId | string | 配置所属的命名空间ID。                                         |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5         | string | 配置内容的md5值。                                           |
| type        | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName     | string | 配置所属的应用名称。                                           |
| createTime  | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime  | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |
| srcUser     | string | 操作此版本的用户名。                                           |
| srcIp       | string | 操作此版本的来源IP。                                          |
| opType      | string | 此历史版本的操作类型，`I`为创建，`U`为更新，`D`为删除                      |
| publishType | string | 此历史版本的发布类型，`formal`为正式发布，`gray`为灰度发布                 |

#### 请求示例

```java
try {
    # 查询`maintain.client.test`配置的历史版本列表。
    Page<ConfigHistoryBasicInfo> configHistoryBasicInfoPage = configMaintainerService.listConfigHistory("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.15. 获取配置历史历史版本详情

#### 描述

通过此API，可以查询某一配置的某一个历史版本详情。

```java
ConfigHistoryDetailInfo getConfigHistoryInfo(String dataId, String groupName, String namespaceId, Long nid) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| namespaceId | string | 配置所属的命名空间ID。                                         |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| nid         | long   | 目标历史版本在的Id， 通过[获取配置历史历史版本列表](#314-获取配置历史历史版本列表)接口获取。 |

#### 返回参数

| 参数类型                    | 描述          |
|:------------------------|:------------|
| ConfigHistoryDetailInfo | 配置历史版本的详细信息 |

其中ConfigHistoryDetailInfo的内容如下：

| 参数名              | 参数类型   | 描述                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | 配置历史版本的ID，没有业务含义，仅作为配置历史版本在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId      | string | 配置所属的命名空间ID。                                         |
| groupName        | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId           | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5              | string | 配置内容的md5值。                                           |
| type             | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName          | string | 配置所属的应用名称。                                           |
| createTime       | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime       | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |
| content          | string | 配置历史版本的内容。                                           |
| encryptedDataKey | string | 配置解密的密钥，仅当配置为加密配置时返回。                                |
| grayName         | string | 配置历史版本的灰度发布名称，当此次历史版本为灰度发布时存在，一般为`beta`              |
| extInfo          | string | 历史版本的扩展信息，目前存储灰度发布时的发布规则，如灰度的ip地址列表，格式为`json`。       |

#### 请求示例

```java
try {
    # 查询`maintain.client.test`配置的历史版本列表。
    Page<ConfigHistoryBasicInfo> configHistoryBasicInfoPage = configMaintainerService.listConfigHistory("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, 1, 10);
    int nid = configHistoryBasicInfoPage.getPageItems().get(0).getId();
    # 查询`maintain.client.test`配置的历史版本列表中第一个历史版本的详细信息。
    ConfigHistoryDetailInfo result = configMaintainerService.getConfigHistoryInfo("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, nid);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.16. 查询配置上一版本信息详情

#### 描述

获取指定配置的上一历史版本的信息详情

```java
ConfigHistoryDetailInfo getPreviousConfigHistoryInfo(String dataId, String groupName, String namespaceId, Long id) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                   |
|:------------|:-------|:-----------------------------------------------------|
| namespaceId | string | 配置所属的命名空间ID。                                         |
| groupName   | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId      | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| id          | long   | 配置在实际存储介质中的ID，通过[获取配置](#31-获取配置) 获取              |

#### 返回参数

| 参数类型                    | 描述          |
|:------------------------|:------------|
| ConfigHistoryDetailInfo | 配置历史版本的详细信息 |

其中ConfigHistoryDetailInfo的内容如下：

| 参数名              | 参数类型   | 描述                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | 配置历史版本的ID，没有业务含义，仅作为配置历史版本在存储介质中的唯一标识。一般为唯一自增ID。     |
| namespaceId      | string | 配置所属的命名空间ID。                                         |
| groupName        | string | 配置分组。只允许英文字符和4种特殊字符（"."、":"、"-"、"\_"），不超过128字节。      |
| dataId           | string | 配置 ID。只允许英文字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| md5              | string | 配置内容的md5值。                                           |
| type             | string | 配置的类型，如properties、json、yaml等，主要用于标记和展示。              |
| appName          | string | 配置所属的应用名称。                                           |
| createTime       | long   | 配置的创建时间，为时间戳，单位为毫秒。                                  |
| modifyTime       | long   | 配置的最新更新时间，为时间戳，单位为毫秒。                                |
| content          | string | 配置历史版本的内容。                                           |
| encryptedDataKey | string | 配置解密的密钥，仅当配置为加密配置时返回。                                |
| grayName         | string | 配置历史版本的灰度发布名称，当此次历史版本为灰度发布时存在，一般为`beta`              |
| extInfo          | string | 历史版本的扩展信息，目前存储灰度发布时的发布规则，如灰度的ip地址列表，格式为`json`。       |

#### 请求示例

```java
try {
    # 获取`maintain.client.test`配置的ID。
    int id = configMaintainerService.getConfig("maintain.client.test").getId();
    # 获取`maintain.client.test`配置的上一历史版本的详细信息。
    ConfigHistoryDetailInfo result = configMaintainerService.getPreviousConfigHistoryInfo("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, id);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.17. 触发Nacos Server从存储介质中dump数据到磁盘缓存中

#### 描述

手动触发从存储中加载所有配置数据到Nacos Server本地缓存。

```java
String updateLocalCacheFromStore() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型   | 描述            |
|:-------|:--------------|
| String | 触发dump操作的返回信息 |

#### 请求示例

```java
try {
    configMaintainerService.updateLocalCacheFromStore();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.18. 设置配置中心日志级别

#### 描述

动态设置指定模块的日志级别

```java
String setLogLevel(String logName, String logLevel) throws NacosException;
```

#### 请求参数

| 参数名      | 参数类型   | 描述                                      |
|:---------|:-------|:----------------------------------------|
| logName  | string | 日志模块名称，如`config-server`, `config-dump`等 |
| logLevel |  string      | 日志级别（如`INFO`、`DEBUG`）                   |

#### 返回参数

| 参数类型   | 描述          |
|:-------|:------------|
| String | 设置日志级别的结果信息 |

#### 请求示例

```java
try {
    configMaintainerService.setLogLevel("config-server", "DEBUG");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 3.19. 更新配置的元数据

#### 描述

更新配置的元数据，如配置的描述和标签信息

```java
boolean updateConfigMetadata(String dataId, String groupName, String namespaceId, String description, String configTags) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                                  |
|:------------|:-------|:----------------------------------------------------|
| dataId      | string | 配置 ID。只允许英字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 256 字节。 |
| groupName   | string | 配置分组。只允许英字符和 4 种特殊字符（"."、":"、"-"、"\_"），不超过 128 字节。  |
| namespaceId | string | 配置所属的命名空间ID。                                        |
| description | string | 配置的描述信息                                             |
| configTags  | string | 此配置的标签，多个标签用逗号`,`分隔。                                |

#### 返回参数

| 参数类型    | 描述     |
|:--------|:-------|
| boolean | 是否更新成功 |

#### 请求示例

```java
try {
    configMaintainerService.updateConfigMetadata("maintain.client.test", "DEFAULT_GROUP", "public", "this is a description", "tag1,tag2");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

## 4. 服务发现运维API

### 4.1. 创建服务

#### 描述

创建一个新的空服务，默认为持久化服务。

```java
String createService(String serviceName) throws NacosException;

String createService(String groupName, String serviceName) throws NacosException;

String createService(String namespaceId, String groupName, String serviceName) throws NacosException;

String createService(String namespaceId, String groupName, String serviceName, boolean ephemeral) throws NacosException;

String createService(String namespaceId, String groupName, String serviceName, boolean ephemeral, float protectThreshold) throws NacosException;

String createService(Service service) throws NacosException;
```

#### 请求参数

| 参数名                                        | 参数类型               | 描述                |
|:-------------------------------------------|:-------------------|:------------------|
| serviceName(Service.serviceName)           | string             | 服务的名称             |
| groupName(Service.groupName)               | string             | 服务的分组名称           |
| namespaceId(Service.namespaceId)           | string             | 服务所属的命名空间ID       |
| ephemeral(Service.ephemeral)               | boolean            | 是否临时服务，默认为`false` |
| protectThreshold(Service.protectThreshold) | float              | 服务的防护阈值，默认为`0.0`  |
| Service.metadata                           | Map<String,String> | 服务的元数据            |
| Service.selector                           | Selector           | 服务的实例选择器，默认为None  |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 创建服务的结果描述 |

#### 请求示例

```java
try {
    # 以下请求均创建一个名为`maintain.client.test`的持久化服务。
    String result = namingMaintainerService.createService("maintain.client.test");
    result = namingMaintainerService.createService("maintain.client.test", Constants.DEFAULT_GROUP);
    result = namingMaintainerService.createService("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainerService.createService("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, false);
    result = namingMaintainerService.createService("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, false, 0.0f);
    Service service = new Service();
    service.setName("maintain.client.test");
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainerService.createService(service); 
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.2. 更新服务

#### 描述

更新服务信息，包括`保护阈值`、`元数据`、`实例选择器`等，服务的`名称`，`分组`，`命名空间`及`持久化`信息无法修改。

:::note
该接口更新时会覆盖掉服务原来的内容信息，因此更新时需要传入完整的服务信息，避免在更新部分数据时将其他信息丢失。

另外当服务不存在时，更新时将会失败，请使用[创建服务](#41-创建服务)。
:::

```java
String updateService(String serviceName, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(String groupName, String serviceName, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(String namespaceId, String groupName, String serviceName, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(String namespaceId, String groupName, String serviceName, boolean ephemeral, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(Service service) throws NacosException;
```

#### 请求参数

| 参数名                                        | 参数类型               | 描述                |
|:-------------------------------------------|:-------------------|:------------------|
| serviceName(Service.serviceName)           | string             | 服务的名称             |
| groupName(Service.groupName)               | string             | 服务的分组名称           |
| namespaceId(Service.namespaceId)           | string             | 服务所属的命名空间ID       |
| ephemeral(Service.ephemeral)               | boolean            | 是否临时服务，默认为`false` |
| protectThreshold(Service.protectThreshold) | float              | 服务的防护阈值，默认为`0.0`  |
| Service.metadata                           | Map<String,String> | 服务的元数据            |
| Service.selector                           | Selector           | 服务的实例选择器，默认为None  |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 更新服务的结果描述 |

#### 请求示例

```java
try {
    # 以下请求均对名为`maintain.client.test`的持久化服务进行更新
    String result = namingMaintainerService.updateService("maintain.client.test", new HashMap<>(), 0.0f, new NoneSelector());
    result = namingMaintainerService.updateService("maintain.client.test", Constants.DEFAULT_GROUP, new HashMap<>(), 0.0f, new NoneSelector());
    result = namingMaintainerService.updateService("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, new HashMap<>(), 0.0f, new NoneSelector());
    result = namingMaintainerService.updateService("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, false, new HashMap<>(), 0.0f, new NoneSelector());
    Service service = new Service();
    service.setName("maintain.client.test");
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainerService.updateService(service); 
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.3. 删除服务

#### 描述

删除服务，仅在服务下不存在实例时可以进行删除。若删除的服务已经不存在，则也会返回删除成功。

```java
String removeService(String serviceName) throws NacosException;

String removeService(String groupName, String serviceName) throws NacosException;

String removeService(String namespaceId, String groupName, String serviceName) throws NacosException;

String removeService(Service service) throws NacosException;
```

#### 请求参数

| 参数名                              | 参数类型   | 描述          |
|:---------------------------------|:-------|:------------|
| serviceName(Service.serviceName) | string | 服务的名称       |
| groupName(Service.groupName)     | string | 服务的分组名称     |
| namespaceId(Service.namespaceId) | string | 服务所属的命名空间ID |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 删除服务的结果描述 |

#### 请求示例

```java
try {
    # 以下请求均删除一个名为`maintain.client.test`的服务。
    String result = namingMaintainerService.removeService("maintain.client.test");
    result = namingMaintainerService.removeService("maintain.client.test", Constants.DEFAULT_GROUP);
    result = namingMaintainerService.removeService("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
    Service service = new Service();
    service.setName("maintain.client.test");
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainerService.removeService(service); 
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.4. 查询服务详情

#### 描述

查询服务详情，返回服务的元数据、保护阈值、实例选择器以及服务下的逻辑集群`Cluster`的元数据等。

:::note
此接口返回的服务详情不包含服务下的实例列表数据，仅包含元数据等信息，若需要获取服务下的实例列表及实例信息，请使用[查询服务实例列表](#415-查询服务实例列表)
:::

```java
ServiceDetailInfo getServiceDetail(String serviceName) throws NacosException;

ServiceDetailInfo getServiceDetail(String groupName, String serviceName) throws NacosException;

ServiceDetailInfo getServiceDetail(String namespaceId, String groupName, String serviceName) throws NacosException;

ServiceDetailInfo getServiceDetail(Service service) throws NacosException;
```

#### 请求参数

| 参数名                              | 参数类型   | 描述          |
|:---------------------------------|:-------|:------------|
| serviceName(Service.serviceName) | string | 服务的名称       |
| groupName(Service.groupName)     | string | 服务的分组名称     |
| namespaceId(Service.namespaceId) | string | 服务所属的命名空间ID |

#### 返回参数

| 参数类型              | 描述      |
|:------------------|:--------|
| ServiceDetailInfo | 服务的详细信息 |

其中ServiceDetailInfo中的详细内容有：

| 参数名                                       | 参数类型                      | 描述                                    |
|:------------------------------------------|:--------------------------|:--------------------------------------|
| namespaceId                               | string                    | 服务的命名空间ID                             |
| groupName                                 | string                    | 服务的分组名称                               |
| serviceName                               | string                    | 服务的名称                                 |
| ephemeral                                 | boolean                   | 服务的持久化属性                              |
| protectThreshold                          | float                     | 服务的保护阈值                               |
| selector                                  | Selector                  | 服务的实例选择器                              |
| metadata                                  | Map\<String,String>       | 服务的元数据                                |
| clusterMap                                | Map\<String, ClusterInfo> | 服务下的逻辑集群信息Map，其中key为逻辑集群名称，value为详细信息 |
| clusterMap.${key}.clusterName             | string                    | 逻辑集群的名称                               |
| clusterMap.${key}.healthyCheckPort        | int                       | 逻辑集群的健康检查断藕                           |
| clusterMap.${key}.useInstancePortForCheck | boolean                   | 逻辑集群是否使用实例信息的端口进行健康检查                 |
| clusterMap.${key}.healthChecker           | AbstractHealthChecker     | 逻辑集群的健康检查类型                           |
| clusterMap.${key}.metadata                | Map\<String,String>       | 逻辑集群的元数据                              |


#### 请求示例

```java
try {
    # 以下请求均获取一个名为`maintain.client.test`的服务详情信息。
    ServiceDetailInfo result = namingMaintainService.getServiceDetail("maintain.client.test");
    result = namingMaintainService.getServiceDetail("maintain.client.test", Constants.DEFAULT_GROUP);
    result = namingMaintainService.getServiceDetail("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
    Service service = new Service();
    service.setName("maintain.client.test");
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
result = namingMaintainService.getServiceDetail(service);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.5. 查询服务列表

#### 描述

获取满足条件的服务列表。通过该接口获得的服务列表不带有实例信息，若需要获取服务下的实例列表及实例信息，请使用[查询服务实例列表](#415-查询服务实例列表)

```java
Page<ServiceView> listServices(String namespaceId) throws NacosException;

Page<ServiceView> listServices(String namespaceId, String groupNameParam, String serviceNameParam) throws NacosException;

Page<ServiceView> listServices(String namespaceId, String groupNameParam, String serviceNameParam, boolean ignoreEmptyService, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名                | 参数类型    | 描述                                      |
|:-------------------|:--------|:----------------------------------------|
| namespaceId        | string  | 服务所属的命名空间ID                             |
| groupNameParam     | string  | 服务的分组名称模版，支持使用`*`进行前缀后缀的模糊匹配，为空时获取所有分组。 |
| serviceNameParam   | string  | 服务的名称模版，支持使用`*`进行前缀后缀的模糊匹配，为空时获取所有服务。   |
| ignoreEmptyService | boolean | 是否忽略空服务，默认为`true`，为`true`将不返回空服务。       |
| pageNo             | int     | 分页页码，默认为1。                              |
| pageSize           | int     | 分页每页大小，默认为100。                          |

#### 返回参数

| 参数类型               | 描述            |
|:-------------------|:--------------|
| Page\<ServiceView> | 满足条件服务列表的分页结果 |

具体Page及ServiceView的内容如下：

| 参数名            | 参数类型                   | 描述           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | 符合该条件下的服务总数。 |
| pageNumber     | int                    | 当前页码。        |
| pagesAvailable | int                    | 分页的总页数。      |
| pageItems      | List\<ConfigBasicInfo> | 当前页的服务列表。    |

| 参数名                  | 参数类型    | 描述         |
|:---------------------|:--------|:-----------|
| name                 | string  | 服务的名称      |
| groupName            | string  | 服务的分组名称    |
| clusterCount         | int     | 服务下逻辑集群的个数 |
| ipCount              | int     | 服务下的实例总数   |
| healthyInstanceCount | int     | 服务下的健康实例总数 |
| triggerFlag          | boolean | 是否触发了阈值保护  |

#### 请求示例

```java
try {
    # 以下请求均获取所有服务列表(最多前100个)。
    Page<ServiceView> result = namingMaintainService.listServices(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainService.listServices(Constants.DEFAULT_NAMESPACE_ID, "", "");
    result = namingMaintainService.listServices(Constants.DEFAULT_NAMESPACE_ID, "", "", true, 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.6. 查询服务列表（携带实例信息）

#### 描述

获取满足条件的服务列表。通过该接口获得的服务列表会带有实例信息。

:::note
此接口性能较差，可能返回很大量的数据导致带宽，内存处于高负载状态，请谨慎使用；建议使用[获取服务列表](#45-获取服务列表)配合[查询服务实例列表](#415-查询服务实例列表)按需获取。
:::

```java
Page<ServiceDetailInfo> listServicesWithDetail(String namespaceId) throws NacosException;

Page<ServiceDetailInfo> listServicesWithDetail(String namespaceId, String groupNameParam, String serviceNameParam) throws NacosException;

Page<ServiceDetailInfo> listServicesWithDetail(String namespaceId, String groupNameParam, String serviceNameParam, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名          | 参数类型   | 描述                                                                                     |
|:-------------|:-------|:---------------------------------------------------------------------------------------|
| namespaceId        | string  | 服务所属的命名空间ID                             |
| groupNameParam     | string  | 服务的分组名称模版，支持使用`*`进行前缀后缀的模糊匹配，为空时获取所有分组。 |
| serviceNameParam   | string  | 服务的名称模版，支持使用`*`进行前缀后缀的模糊匹配，为空时获取所有服务。   |
| pageNo             | int     | 分页页码，默认为1。                              |
| pageSize           | int     | 分页每页大小，默认为100。                          |

#### 返回参数

| 参数类型                     | 描述            |
|:-------------------------|:--------------|
| Page\<ServiceDetailInfo> | 满足条件服务列表的分页结果 |

具体Page及ServiceDetailInfo的内容如下：

| 参数名            | 参数类型                   | 描述           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | 符合该条件下的服务总数。 |
| pageNumber     | int                    | 当前页码。        |
| pagesAvailable | int                    | 分页的总页数。      |
| pageItems      | List\<ConfigBasicInfo> | 当前页的服务列表。    |

| 参数名                                       | 参数类型                      | 描述                                    |
|:------------------------------------------|:--------------------------|:--------------------------------------|
| namespaceId                               | string                    | 服务的命名空间ID                             |
| groupName                                 | string                    | 服务的分组名称                               |
| serviceName                               | string                    | 服务的名称                                 |
| ephemeral                                 | boolean                   | 服务的持久化属性                              |
| protectThreshold                          | float                     | 服务的保护阈值                               |
| selector                                  | Selector                  | 服务的实例选择器                              |
| metadata                                  | Map\<String,String>       | 服务的元数据                                |
| clusterMap                                | Map\<String, ClusterInfo> | 服务下的逻辑集群信息Map，其中key为逻辑集群名称，value为详细信息 |
| clusterMap.${key}.clusterName             | string                    | 逻辑集群的名称                               |
| clusterMap.${key}.healthyCheckPort        | int                       | 逻辑集群的健康检查断藕                           |
| clusterMap.${key}.useInstancePortForCheck | boolean                   | 逻辑集群是否使用实例信息的端口进行健康检查                 |
| clusterMap.${key}.healthChecker           | AbstractHealthChecker     | 逻辑集群的健康检查类型                           |
| clusterMap.${key}.metadata                | Map\<String,String>       | 逻辑集群的元数据                              |

#### 请求示例

```java
try {
    # 以下请求均获取所有服务列表(最多前100个)。
    Page<ServiceDetailInfo> result = namingMaintainService.listServicesWithDetail(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainService.listServicesWithDetail(Constants.DEFAULT_NAMESPACE_ID, "", "");
    result = namingMaintainService.listServicesWithDetail(Constants.DEFAULT_NAMESPACE_ID, "", "", 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.7. 查询服务的订阅者列表

#### 描述

查询指定服务的订阅者列表。

```java
Page<SubscriberInfo> getSubscribers(String serviceName) throws NacosException;

Page<SubscriberInfo> getSubscribers(String groupName, String serviceName) throws NacosException;

Page<SubscriberInfo> getSubscribers(String namespaceId, String groupName, String serviceName) throws NacosException;

Page<SubscriberInfo> getSubscribers(String namespaceId, String groupName, String serviceName, int pageNo, int pageSize) throws NacosException;

Page<SubscriberInfo> getSubscribers(String namespaceId, String groupName, String serviceName, int pageNo, int pageSize, boolean aggregation) throws NacosException;

Page<SubscriberInfo> getSubscribers(Service service, int pageNo, int pageSize, boolean aggregation) throws NacosException;
```

#### 请求参数

| 参数名                              | 参数类型    | 描述                                                             |
|:---------------------------------|:--------|:---------------------------------------------------------------|
| serviceName(Service.serviceName) | string  | 服务的名称                                                          |
| groupName(Service.groupName)     | string  | 服务的分组名称                                                        |
| namespaceId(Service.namespaceId) | string  | 服务所属的命名空间ID                                                    |
| pageNo                           | int     | 分页页码，默认为1。                                                     |
| pageSize                         | int     | 分页每页大小，默认为100。                                                 |
| aggregation                      | boolean | 是否聚合查询，默认为false，为false时仅查询请求所在节点的订阅者列表，为true时查询整个集群中此配置的订阅者列表。 |

#### 返回参数

| 参数类型                  | 描述         |
|:----------------------|:-----------|
| Page\<SubscriberInfo> | 订阅者列表的分页结果 |

#### 请求示例

```java
try {
    # 以下请求均获取服务`maintain.client.test`的所有订阅者列表(最多前100个)。
    Page<SubscriberInfo> result = namingMaintainService.getSubscribers("maintain.client.test");
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_GROUP, "maintain.client.test");
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test");
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", 1, 100);
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", 1, 100, false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.8. 查询支持的服务实例选择器列表

#### 描述

通过此接口获取支持的服务实例选择器列表，仅返回实例选择器的名称列表。

```java
List<String> listSelectorTypes() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型          | 描述         |
|:--------------|:-----------|
| List\<String> | 实例选择器的名称列表 |

#### 请求示例

```java
try {
    List<String> result = namingMaintainService.listSelectorTypes();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.9. 注册实例

#### 描述

通过该接口注册一个服务的实例，默认注册为持久化实例。

:::note
若通过此接口注册临时实例（Instance对象的ephemeral属性为true），则实例会在一段时间后被自动移除，因为运维SDK被定位为 运维人员或控制台类应用进行数据管控时使用，因此不会进行心跳等实例续约。

若需要注册临时实例，建议使用`Nacos Client`（如[Nacos Java Client](../user/java-sdk/usage.md), [Nacos Go Client](../user/go-sdk/usage.md)等)的注册实例API。
:::

```java
String registerInstance(String serviceName, String ip, int port) throws NacosException;

String registerInstance(String groupName, String serviceName, String ip, int port) throws NacosException;

String registerInstance(String namespaceId, String groupName, String serviceName, String ip, int port) throws NacosException;

String registerInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

String registerInstance(String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

String registerInstance(String namespaceId, String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

String registerInstance(String serviceName, Instance instance) throws NacosException;

String registerInstance(String groupName, String serviceName, Instance instance) throws NacosException;

String registerInstance(String namespaceId, String groupName, String serviceName, Instance instance);

String registerInstance(Service service, Instance instance) throws NacosException;
```

#### 请求参数

| 参数名                               | 参数类型                | 描述                |
|:----------------------------------|:--------------------|:------------------|
| serviceName(Service.serviceName)  | string              | 服务的名称             |
| groupName(Service.groupName)      | string              | 服务的分组名称           |
| namespaceId(Service.namespaceId)  | string              | 服务所属的命名空间ID       |
| clusterName(Instance.clusterName) | string              | 实例所属的逻辑集群名称       | 
| ip(Instance.ip)                    | string              | 实例的IP地址，支持域名      |
| port(Instance.port)               | int                 | 实例的端口信息，取值0~65535 |
| Instance.ephemeral                | boolean             | 实例的持久化属性          |
| Instance.weight                   | double              | 实例的权重             |
| Instance.healthy                  | boolean             | 实例的健康状态           |
| Instance.enabled                  | boolean             | 实例的上下线状态          |
| Instance.instanceId               | string              | 实例的ID             |
| Instance.metadata                 | Map\<String,String> | 实例的元数据信息          |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 实例的注册结果描述 |

#### 请求示例

```java
try {
    # 以下请求均给服务`maintain.client.test`注册一个实例，实例的ip为`127.0.0.1`，端口为`8080`。
    String result = namingMaintainService.registerInstance("maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.registerInstance("maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_GROUP,"maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP,"maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    instance.setEphemeral(false);
    result = namingMaintainService.registerInstance("maintain.client.test", instance);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_GROUP,"maintain.client.test", instance);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", instance);
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    result = namingMaintainService.registerInstance(service, instance);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.10. 注销实例

#### 描述

通过该接口注销一个服务的实例。

:::note
若注销的是临时实例，则返回注销成功，但实例未被删除；这是因为临时实例如果是通过`Nacos Client`注册的，那么对应的`Nacos Client`会定时对此实例进行续约，即使实例被注销，该实例也立即由其注册的`Nacos Client`进行重新注册。

若需要注销临时实例且临时实例是由`Nacos Client`注册的，建议使用`Nacos Client`（如[Nacos Java Client](../user/java-sdk/usage.md), [Nacos Go Client](../user/go-sdk/usage.md)等）的注销实例API。
:::

```java
String deregisterInstance(String serviceName, String ip, int port) throws NacosException;

String deregisterInstance(String groupName, String serviceName, String ip, int port) throws NacosException;

String deregisterInstance(String namespaceId, String groupName, String serviceName, String ip, int port) throws NacosException;

String deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;

String deregisterInstance(String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

String deregisterInstance(String namespaceId, String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

String deregisterInstance(String serviceName, Instance instance) throws NacosException;

String deregisterInstance(String groupName, String serviceName, Instance instance) throws NacosException;

String deregisterInstance(String namespaceId, String groupName, String serviceName, Instance instance) throws NacosException;

String deregisterInstance(Service service, Instance instance) throws NacosException;
```

#### 请求参数

| 参数名                               | 参数类型    | 描述                |
|:----------------------------------|:--------|:------------------|
| serviceName(Service.serviceName)  | string  | 服务的名称             |
| groupName(Service.groupName)      | string  | 服务的分组名称           |
| namespaceId(Service.namespaceId)  | string  | 服务所属的命名空间ID       |
| clusterName(Instance.clusterName) | string  | 实例所属的逻辑集群名称       | 
| ip(Instance.ip)                   | string  | 实例的IP地址，支持域名      |
| port(Instance.port)               | int     | 实例的端口信息，取值0~65535 |
| Instance.ephemeral                | boolean | 实例的持久化属性          |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 实例的注销结果描述 |

#### 请求示例

```java
try {
    # 以下请求均给服务`maintain.client.test`注销一个实例，实例的ip为`127.0.0.1`，端口为`8080`。
    String result = namingMaintainService.registerInstance("maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.deregisterInstance("maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_GROUP,"maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP,"maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    instance.setEphemeral(false);
    result = namingMaintainService.deregisterInstance("maintain.client.test", instance);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_GROUP,"maintain.client.test", instance);
    result = namingMaintainService.deregisterInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", instance);
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    result = namingMaintainService.deregisterInstance(service, instance);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.11. 更新实例

#### 描述

通过该接口注销一个服务实例的元数据信息，但实例的`所属服务`，`IP地址`，`端口`，`逻辑集群`**无法修改**。

:::note
此接口更新的实例实例元数据信息（包括权重等），会覆盖之前更新的元数据信息。在使用时请尽量传递全量信息，避免因修改部分内容而导致丢失其他信息。

通过该接口更新的元数据拥有更高的优先级（相比注册实例时的元数据），且具有记忆能力；会在对应实例删除后，依旧存在一段时间，如果在此期间实例重新注册，该元数据依旧生效；您可以通过`nacos.naming.clean.expired-metadata.expired-time`及`nacos.naming.clean.expired-metadata.interval`对记忆时间进行修改。
:::

```java
String updateInstance(String serviceName, Instance instance) throws NacosException;

String updateInstance(String groupName, String serviceName, Instance instance) throws NacosException;

String updateInstance(String namespaceId, String groupName, String serviceName, Instance instance) throws NacosException;

String updateInstance(Service service, Instance instance) throws NacosException;
```

#### 请求参数

| 参数名                              | 参数类型                | 描述                |
|:---------------------------------|:--------------------|:------------------|
| serviceName(Service.serviceName) | string              | 服务的名称             |
| groupName(Service.groupName)     | string              | 服务的分组名称           |
| namespaceId(Service.namespaceId) | string              | 服务所属的命名空间ID       |
| Instance.clusterName             | string              | 实例所属的逻辑集群名称       | 
| Instance.ip                      | string              | 实例的IP地址，支持域名      |
| Instance.port                    | int                 | 实例的端口信息，取值0~65535 |
| Instance.ephemeral               | boolean             | 实例的持久化属性          |
| Instance.weight                  | double              | 实例的权重             |
| Instance.healthy                 | boolean             | 实例的健康状态           |
| Instance.enabled                 | boolean             | 实例的上下线状态          |
| Instance.instanceId              | string              | 实例的ID             |
| Instance.metadata                | Map\<String,String> | 实例的元数据信息          |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 实例的更新结果描述 |

#### 请求示例

```java
try {
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    instance.setEphemeral(false);
    instance.setEnabled(false);
    # 以下请求均给更新服务`maintain.client.test`下的一个实例，实例的ip为`127.0.0.1`，端口为`8080`， 将实例的`enabled`修改为`false`。
    String result = namingMaintainService.registerInstance("maintain.client.test", instance);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_GROUP,"maintain.client.test", instance);
    result = namingMaintainService.registerInstance(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", instance);
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    result = namingMaintainService.registerInstance(service, instance);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.12. 批量更新实例元数据

#### 描述

批量对指定服务下部分或全部实例更新元数据。

:::note
此接口仅支持更新元数据`metadata`,不支持更新`权重`、`上下线状态`、`健康状态`等属性。
:::

```java
InstanceMetadataBatchResult batchUpdateInstanceMetadata(Service service, List<Instance> instances, Map<String, String> newMetadata) throws NacosException;
```

#### 请求参数

| 参数名                 | 参数类型                | 描述                                          |
|:--------------------|:--------------------|:--------------------------------------------|
| Service.serviceName | string              | 服务的名称                                       |
| Service.groupName   | string              | 服务的分组名称                                     |
| Service.namespaceId | string              | 服务所属的命名空间ID                                 |
| instances           | List\<Instance>     | 需要更新元数据的实例列表，仅需要传入`ip`,`port`,`clusterName` |
| newMetadata         | Map\<String,String> | 新的元数据信息                                     |

#### 返回参数

| 参数类型                        | 描述         |
|:----------------------------|:-----------|
| InstanceMetadataBatchResult | 实例元数据更新的结果 |

其中InstanceMetadataBatchResult中的内容为：

| 参数名     | 参数类型          | 描述        |
|:--------|:--------------|:----------|
| updated | List\<String> | 更新成功的实例id |

#### 请求示例

```java
try {
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    Map<String, String> newMetadata = Collections.singletonMap("testK", "testV");
    InstanceMetadataBatchResult result = namingMaintainService.batchUpdateInstanceMetadata(service, Collections.singletonList(instance), newMetadata);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.13. 批量移除实例元数据

#### 描述

批量对指定服务下部分或全部实例移除元数据。

:::note
此接口仅支持移除元数据`metadata`,不支持更新`权重`、`上下线状态`、`健康状态`等属性。
:::

```java
InstanceMetadataBatchResult batchDeleteInstanceMetadata(Service service, List<Instance> instances, Map<String, String> newMetadata) throws NacosException;
```

#### 请求参数

| 参数名                 | 参数类型                | 描述                                          |
|:--------------------|:--------------------|:--------------------------------------------|
| Service.serviceName | string              | 服务的名称                                       |
| Service.groupName   | string              | 服务的分组名称                                     |
| Service.namespaceId | string              | 服务所属的命名空间ID                                 |
| instances           | List\<Instance>     | 需要更新元数据的实例列表，仅需要传入`ip`,`port`,`clusterName` |
| newMetadata         | Map\<String,String> | 需要移除的元数据信息                                  |

#### 返回参数

| 参数类型                        | 描述         |
|:----------------------------|:-----------|
| InstanceMetadataBatchResult | 实例元数据更新的结果 |

其中InstanceMetadataBatchResult中的内容为：

| 参数名     | 参数类型          | 描述        |
|:--------|:--------------|:----------|
| updated | List\<String> | 移除成功的实例id |

#### 请求示例

```java
try {
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    Map<String, String> newMetadata = Collections.singletonMap("testK", "testV");
    InstanceMetadataBatchResult result = namingMaintainService.batchDeleteInstanceMetadata(service, Collections.singletonList(instance), newMetadata);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.14. 更新实例的部分元数据

#### 描述

更新实例的部分元数据。相比[更新实例](#411-更新实例)API，仅会更新有传入内容的元数据，若实例元数据中的key不再接口传入的参数中时，则不进行更新。

>例如当前元数据为`k1=v1,k2=v2`，接口传入`k2=v3`，则元数据变为`k1=v1,k2=v3`,而不是`k2=v3`。
> 
>但需要注意的是，`Instance`对象中部分内容存在默认值（如`权重`等），需要传入对应值，否则会默认值被覆盖。

```java
String partialUpdateInstance(Service service, Instance instance) throws NacosException;
```

#### 请求参数

| 参数名                  | 参数类型                | 描述                |
|:---------------------|:--------------------|:------------------|
| Service.serviceName  | string              | 服务的名称             |
| Service.groupName    | string              | 服务的分组名称           |
| Service.namespaceId  | string              | 服务所属的命名空间ID       |
| Instance.clusterName | string              | 实例所属的逻辑集群名称       | 
| Instance.ip          | string              | 实例的IP地址，支持域名      |
| Instance.port        | int                 | 实例的端口信息，取值0~65535 |
| Instance.ephemeral   | boolean             | 实例的持久化属性          |
| Instance.weight      | double              | 实例的权重             |
| Instance.healthy     | boolean             | 实例的健康状态           |
| Instance.enabled     | boolean             | 实例的上下线状态          |
| Instance.metadata    | Map\<String,String> | 实例的元数据信息          |

#### 返回参数

| 参数类型   | 描述        |
|:-------|:----------|
| String | 实例的更新结果描述 |

#### 请求示例

```java
try {

} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.15. 查询服务实例列表

#### 描述

查询指定服务下满足条件的所有实例列表。

```java
List<Instance> listInstances(String serviceName, String clusterName, boolean healthyOnly) throws NacosException;

List<Instance> listInstances(String groupName, String serviceName, String clusterName, boolean healthyOnly) throws NacosException;

List<Instance> listInstances(String namespaceId, String groupName, String serviceName, String clusterName, boolean healthyOnly) throws NacosException;

List<Instance> listInstances(Service service, String clusterName, boolean healthyOnly) throws NacosException;
```

#### 请求参数

| 参数名                              | 参数类型    | 描述                                               |
|:---------------------------------|:--------|:-------------------------------------------------|
| serviceName(Service.serviceName) | string  | 服务的名称                                            |
| groupName(Service.groupName)     | string  | 服务的分组名称                                          |
| namespaceId(Service.namespaceId) | string  | 服务所属的命名空间ID                                      |
| clusterName                      | string  | 实例所属的逻辑集群名称，为空时返回所有逻辑集群的实例，需要查询多个逻辑集群是，使用逗号`,`分割 | 
| healthyOnly                      | boolean | 是否仅返回健康的实例                                       |

#### 返回参数

| 参数类型            | 描述     |
|:----------------|:-------|
| List\<Instance> | 实例信息列表 |

#### 请求示例

```java
try {
    List<Instance> result = namingMaintainService.listInstances("maintain.client.test", "", false);
    result = namingMaintainService.listInstances(Constants.DEFAULT_GROUP, "maintain.client.test", "", false);
    result = namingMaintainService.listInstances(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "", false);
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    result = namingMaintainService.listInstances(service, "", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.16. 查询指定服务实例的详情

#### 描述

查询指定服务实例的详情，主要用于查询该实例的元数据及其他附属信息（如权重等）。

```java
Instance getInstanceDetail(String serviceName, String ip, int port) throws NacosException;

Instance getInstanceDetail(String groupName, String serviceName, String ip, int port) throws NacosException;

Instance getInstanceDetail(String namespaceId, String groupName, String serviceName, String ip, int port) throws NacosException;

Instance getInstanceDetail(String serviceName, String ip, int port, String clusterName) throws NacosException;

Instance getInstanceDetail(String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

Instance getInstanceDetail(String namespaceId, String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

Instance getInstanceDetail(Service service, Instance instance) throws NacosException;
```

#### 请求参数

| 参数名                               | 参数类型   | 描述                |
|:----------------------------------|:-------|:------------------|
| serviceName(Service.serviceName)  | string | 服务的名称             |
| groupName(Service.groupName)      | string | 服务的分组名称           |
| namespaceId(Service.namespaceId)  | string | 服务所属的命名空间ID       |
| clusterName(Instance.clusterName) | string | 实例所属的逻辑集群名称       | 
| ip(Instance.ip)                   | string | 实例的IP地址，支持域名      |
| port(Instance.port)               | int    | 实例的端口信息，取值0~65535 |

#### 返回参数

| 参数类型                   | 描述        |
|:-----------------------|:----------|

#### 请求示例

```java
try {
    Instance result = namingMaintainService.getInstanceDetail("maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.getInstanceDetail(Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.getInstanceDetail(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "127.0.0.1", 8080);
    result = namingMaintainService.getInstanceDetail("maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.getInstanceDetail(Constants.DEFAULT_GROUP,"maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.getInstanceDetail(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP,"maintain.client.test", "127.0.0.1", 8080, Constants.DEFAULT_CLUSTER_NAME);
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    instance.setClusterName(Constants.DEFAULT_CLUSTER_NAME);
    result = namingMaintainService.getInstanceDetail(service, instance);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.17. 查询注册中心相关的统计信息

#### 描述

查询注册中心相关的统计信息，主要用于查询注册中心中可用状态，实例个数，服务个数等。

```java
MetricsInfo getMetrics(boolean onlyStatus) throws NacosException;
```

#### 请求参数

| 参数名        | 参数类型    | 描述         |
|:-----------|:--------|:-----------|
| onlyStatus | boolean | 是否仅查询可用状态。 |

#### 返回参数

| 参数类型        | 描述        |
|:------------|:----------|
| MetricsInfo | 注册中心的统计信息 |

其中MetricsInfo中内容如下：

| 参数名                         | 参数类型   | 描述                                                                                                                                                    |
|:----------------------------|:-------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| status                      | string | 注册中心的可用状态，如`UP`。                                                                                                                                      |
| serviceCount                | int    | 服务总个数                                                                                                                                                 |
| instanceCount               | int    | 服务实例总个数                                                                                                                                               |
| subscribeCount              | int    | 服务订阅者总个数                                                                                                                                              |
| clientCount                 | int    | 客户端连接总个数                                                                                                                                              |
| connectionBasedClientCount  | int    | 基于长连接的客户端总个数，对应SDK版本大于2.0以上的客户端数量                                                                                                                     |
| ephemeralIpPortClientCount  | int    | 基于IP端口的临时客户端总个数，对应SDK版本小于2.0的版本客户端数量，及包括通过http openAPI及运维API注册的临时客户端。                                                                                 |    
| persistentIpPortClientCount | int    | 基于IP端口的持久化客户端总个数，对应持久化实例的客户端数量。                                                                                                                       |                                                                  |
| responsibleClientCount      | int    | 由此Nacos Server节点负责维护的客户端总个数， 包括直接长连接在此节点的`connectionBasedClientCount`以及Distro协议认为应该由此节点负责的`ephemeralIpPortClientCount`和`persistentIpPortClientCount`。 |

#### 请求示例

```java
try {
    MetricsInfo metricsInfo = namingMaintainService.getMetrics(false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.18. 设置注册中心的日志级别

#### 描述

设置注册中心相关模块日志的日志级别。

```java
String setLogLevel(String logName, String logLevel) throws NacosException;
```

#### 请求参数

| 参数名        | 参数类型     | 描述                                        |
|:-----------|:---------|:------------------------------------------|
| :--------- | :------- | :---------------------------------------- |
| logName    | string   | 日志模块名称，如`naming-server`, `naming-event`等  |
| logLevel   | string   | 日志级别（如`INFO`、`DEBUG`）                     |

#### 返回参数

| 参数类型   | 描述          |
|:-------|:------------|
| String | 设置日志级别的结果信息 |

#### 请求示例

```java
try {
    String result = namingMaintainService.setLogLevel("naming-server", "DEBUG");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.19. 更新持久化实例的健康状态。

#### 描述

更新持久化实例的健康状态。

:::note
此API针对无需自动检测且需要由管理员手动修改健康状态的持久化实例。因此该API仅在满足以下条件时生效：
1. 实例必须是持久化实例；
2. 该实例所属集群的健康检查器必须配置为 `NONE`。

如需修改集群的健康检查器，请参考[更新逻辑集群的元数据](#420-更新逻辑集群的元数据)
:::

```java
String updateInstanceHealthStatus(Service service, Instance instance) throws NacosException;
```

#### 请求参数

| 参数名                               | 参数类型    | 描述                |
|:----------------------------------|:--------|:------------------|
| serviceName(Service.serviceName)  | string  | 服务的名称             |
| groupName(Service.groupName)      | string  | 服务的分组名称           |
| namespaceId(Service.namespaceId)  | string  | 服务所属的命名空间ID       |
| clusterName(Instance.clusterName) | string  | 实例所属的逻辑集群名称       | 
| ip(Instance.ip)                   | string  | 实例的IP地址，支持域名      |
| port(Instance.port)               | int     | 实例的端口信息，取值0~65535 |
| healthy(Instance.healthy)         | boolean | 实例的目标健康状态         |

#### 返回参数

| 参数类型   | 描述         |
|:-------|:-----------|
| String | 更新健康状态结果描述 |


#### 请求示例

```java
try {
    # 更新`maintain.client.test`下的实例`127.0.0.1:8080`的健康状态为false.
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    instance.setClusterName(Constants.DEFAULT_CLUSTER_NAME);
    instance.setEphemeral(false)
    instance.setHealthy(false);
    String result = namingMaintainService.updateInstanceHealthStatus(service, instance);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.20. 查询支持的健康检查类型

#### 描述

通过此接口查询支持的健康检查类型。

```java
Map<String, AbstractHealthChecker> getHealthCheckers() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型                                | 描述                                         |
|:------------------------------------|:-------------------------------------------|
| Map\<String, AbstractHealthChecker> | 支持的健康检查方式的Map，key为类型，value为具体的健康检查器的对应配置内容 |

#### 请求示例

```java
try {
    Map<String, AbstractHealthChecker> result = namingMaintainService.getHealthCheckers();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.21. 更新逻辑集群的元数据

#### 描述

更新指定服务下指定逻辑集群的元数据。

```java
String updateCluster(Service service, ClusterInfo cluster) throws NacosException;
```

#### 请求参数

| 参数名                                 | 参数类型               | 描述                                                  |
|:------------------------------------|:-------------------|:----------------------------------------------------|
| Service.serviceName                 | string             | 服务的名称                                               |
| Service.groupName                   | string             | 服务的分组名称                                             |
| Service.namespaceId                 | string             | 服务所属的命名空间ID                                         |
| ClusterInfo.clusterName             | string             | 逻辑集群的名称                                             | 
| ClusterInfo.healthChecker           | string             | 逻辑集群的健康检查类型，通过[查询支持的健康检查类型](#419-查询支持的健康检查类型)获取     | 
| ClusterInfo.healthyCheckPort        | string             | 健康检查的端口                                             | 
| ClusterInfo.useInstancePortForCheck | string             | 是否使用实例所注册的端口进行健康检查，为true时将忽略`healthyCheckPort`设置的端口 | 
| ClusterInfo.metadata                | Map<String,String> | 实例所属的元数据信息                                          | 

#### 返回参数

| 参数类型                   | 描述        |
|:-----------------------|:----------|

#### 请求示例

```java
try {
    Service service = new Service();
    service.setNamespaceId(Constants.DEFAULT_NAMESPACE_ID);
    service.setGroupName(Constants.DEFAULT_GROUP);
    service.setName("maintain.client.test");
    ClusterInfo clusterInfo = new ClusterInfo();
    clusterInfo.setClusterName(Constants.DEFAULT_CLUSTER_NAME);
    clusterInfo.setHealthChecker(new AbstractHealthChecker.None());
    clusterInfo.setUseInstancePortForCheck(true);
    clusterInfo.setMetadata(Collections.singletonMap("testK", "testV"));
    String result = namingMaintainService.updateCluster(service, clusterInfo);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.22. 查询服务客户端列表

#### 描述

获取注册中心中所有注册或订阅服务的客户端的列表。

```java
List<String> getClientList() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型          | 描述             |
|:--------------|:---------------|
| List\<String> | 客户端的clientId列表 |

#### 请求示例

```java
try {
    List<String> result = namingMaintainService.getClientList();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.23. 查询服务客户端详情

#### 描述

查询服务客户端的详细信息。不同版本的客户端信息，返回的内容可能有所不同。

```java
ClientSummaryInfo getClientDetail(String clientId) throws NacosException;
```

#### 请求参数

| 参数名      | 参数类型   | 描述                                               |
|:---------|:-------|:-------------------------------------------------|
| clientId | string | 客户端的clientId，可通过日志或[查询服务客户端列表](#421-查询服务客户端列表)获得 |

#### 返回参数

| 参数类型              | 描述      |
|:------------------|:--------|
| ClientSummaryInfo | 客户端总结信息 |

其中ClientSummaryInfo中的内容如下：

| 参数名             | 参数类型    | 描述                                                                                  |
|:----------------|:--------|:------------------------------------------------------------------------------------|
| clientId        | string  | 客户端id                                                                               |
| ephemeral       | boolean | 是否为持久化服务的客户端                                                                        |
| lastUpdatedTime | long    | 客户端最后一次进行更新（注册或注销）的时间戳                                                              |
| clientType      | string  | 客户端的类型，`ipPort`或`connection`，分别对应1.X客户端或HTTP openAPI访问 和 2.X及以上的客户端或GRPC openAPI访问。 |
| connectType     | string  | 当`clientType`为`connection`时，该字段表示客户端的连接类型，当前为`grpc`。                                |
| appName         | string  | 客户端的应用名称，需要在客户端连接时添加在连接元数据中，默认为`unknown`。                                           |
| version         | string  | 客户端的版本，如`Nacos-Java-Client:v3.0.0`                                                  |
| clientIp        | string  | 客户端的IP地址， 由于存在代理注册（如Nacos-Sync）的场景，此IP地址可能与此客户端所注册的服务实例的IP地址不同。                     |
| clientPort      | int     | 客户端的Port地址， 表示此连接的remote port。                                                      |

#### 请求示例

```java
try {
    ClientSummaryInfo result = namingMaintainService.getClientDetail("127.0.0.1:8080#true");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.24. 查询指定服务客户端所注册的服务列表

#### 描述

查询指定服务客户端所注册的服务列表。

```java
List<ClientServiceInfo> getPublishedServiceList(String clientId) throws NacosException;
```

#### 请求参数

| 参数名      | 参数类型   | 描述                                               |
|:---------|:-------|:-------------------------------------------------|
| clientId | string | 客户端的clientId，可通过日志或[查询服务客户端列表](#421-查询服务客户端列表)获得 |

#### 返回参数

| 参数类型                     | 描述            |
|:-------------------------|:--------------|
| List\<ClientServiceInfo> | 客户端所注册的服务列表信息 |

其中ClientServiceInfo的内容如下：

| 参数名                       | 参数类型                | 描述               |
|:--------------------------|:--------------------|:-----------------|
| namespaceId               | string              | 服务所属的namespaceId |
| groupName                 | string              | 服务的分组名称          |
| serviceName               | string              | 服务的名称            |
| publisherInfo             | ClientPublisherInfo | 客户端所注册的服务实例信息    |
| publisherInfo.ip          | string              | 实例的IP            |
| publisherInfo.port        | string              | 实例的端口            |
| publisherInfo.clusterName | string              | 实例的逻辑集群名称        |

#### 请求示例

```java
try {
    List<ClientServiceInfo> result = namingMaintainService.getPublishedServiceList("127.0.0.1:8080#true");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.25. 查询指定服务客户端所订阅的服务列表

#### 描述

查询指定服务客户端所订阅的服务列表。

```java
List<ClientServiceInfo> getSubscribeServiceList(String clientId) throws NacosException;
```

#### 请求参数

| 参数名          | 参数类型   | 描述                                                                                     |
|:-------------|:-------|:---------------------------------------------------------------------------------------|
| clientId | string | 客户端的clientId，可通过日志或[查询服务客户端列表](#421-查询服务客户端列表)获得 |

#### 返回参数

| 参数类型                     | 描述            |
|:-------------------------|:--------------|
| List\<ClientServiceInfo> | 客户端所订阅的服务列表信息 |

其中ClientServiceInfo的内容如下：

| 参数名                    | 参数类型                 | 描述                     |
|:-----------------------|:---------------------|:-----------------------|
| namespaceId            | string               | 服务所属的namespaceId       |
| groupName              | string               | 服务的分组名称                |
| serviceName            | string               | 服务的名称                  |
| subscriberInfo         | ClientSubscriberInfo | 客户端的订阅者信息              |
| subscriberInfo.appName | string               | 订阅者所属的应用名称，默认`unknown` |
| subscriberInfo.agent   | string               | 订阅者的客户端版本              |
| subscriberInfo.address | string               | 订阅者的地址信息格式为`IP:PORT`   |

#### 请求示例

```java
try {
    List<ClientServiceInfo> result = namingMaintainService.getSubscribeServiceList("127.0.0.1:8080#true");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.26. 查询注册了指定服务的服务客户端列表

#### 描述

查询哪些客户端注册了指定的服务。

```java
List<ClientPublisherInfo> getPublishedClientList(String namespaceId, String groupName, String serviceName, String ip, Integer port) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                    |
|:------------|:-------|:----------------------|
| namespaceId | string | 服务所属的namespaceId      |
| groupName   | string | 服务的分组名称               |
| serviceName | string | 服务的名称                 |
| ip          | string | 服务实例的ip，为空时表示匹配所有服务实例 |
| port        | int    | 服务实例的端口，为空时表示匹配所有服务实例 |

#### 返回参数

| 参数类型                       | 描述           |
|:---------------------------|:-------------|
| List\<ClientPublisherInfo> | 注册服务实例的客户端信息 |

其中ClientPublisherInfo的内容如下：

| 参数名         | 参数类型   | 描述           |
|:------------|:-------|:-------------|
| clientId    | string | 注册服务的客户端ID   |
| ip          | string | 注册的实例的IP     |
| port        | string | 注册的实例的端口     |
| clusterName | string | 注册的实例的逻辑集群名称 |

#### 请求示例

```java
try {
    List<ClientPublisherInfo> result = namingMaintainService.getPublishedClientList(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 4.27. 查询订阅了指定服务的服务客户端列表

#### 描述

查询哪些客户端订阅了指定的服务。

```java
List<ClientSubscriberInfo> getSubscribeClientList(String namespaceId, String groupName, String serviceName, String ip, Integer port) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                    |
|:------------|:-------|:----------------------|
| namespaceId | string | 服务所属的namespaceId      |
| groupName   | string | 服务的分组名称               |
| serviceName | string | 服务的名称                 |
| ip          | string | 服务订阅者的ip，为空时表示匹配所有订阅者 |
| port        | int    | 服务订阅者的端口，为空时表示匹配所有订阅者 |

#### 返回参数

| 参数类型                        | 描述         |
|:----------------------------|:-----------|
| List\<ClientSubscriberInfo> | 订阅服务的客户端信息 |

其中ClientSubscriberInfo的内容如下：

| 参数名      | 参数类型   | 描述                     |
|:---------|:-------|:-----------------------|
| clientId | string | 订阅服务的客户端ID             |
| appName  | string | 订阅者所属的应用名称，默认`unknown` |
| agent    | string | 订阅者的客户端版本              |
| address  | string | 订阅者的地址信息格式为`IP:PORT`   |

#### 请求示例

```java
try {
    List<ClientSubscriberInfo> result = namingMaintainService.getSubscribeClientList(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

## 5. 其他Nacos核心运维API

Nacos核心的运维API可以通过`NacosNamingMaintainerService`或`NacosConfigMaintainerService`进行调用。

### 5.1. 查询Nacos Server的状态信息

#### 描述

查询Nacos Server的状态信息，状态信息包括`版本号`, `运行模式`, `开启鉴权`, `运行的模块`等信息

```java
Map<String, String> getServerState() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型                 | 描述                 |
|:---------------------|:-------------------|
| Map\<String, String> | Nacos Server 的状态信息 |

#### 请求示例

```java
try {
    Map<String,String> result = namingMaintainService.getServerState();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.2. 获取Nacos Server的存活状态

#### 描述

获取Nacos Server的存活状态

```java
Boolean liveness() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型    | 描述                       |
|:--------|:-------------------------|
| boolean | `true`代表存活，`false`代表存在问题 |

#### 请求示例

```java
try {
    boolean result = namingMaintainService.liveness();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.3. 获取Nacos Server的就绪状态

#### 描述

获取Nacos Server的就绪状态

```java
Boolean readiness() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型    | 描述                      |
|:--------|:------------------------|
| boolean | `true`代表就绪，`false`代表未就绪 |

#### 请求示例

```java
try {
    boolean result = namingMaintainService.readiness();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.4. Nacos Raft操作

#### 描述

通过此接口， 可以对Nacos Server中的Raft协议进行一定的运维操作，如`重新选主`，`进行快照`等。

```java
String raftOps(String command, String value, String groupId) throws NacosException;
```

#### 请求参数

| 参数名     | 参数类型   | 描述                                                                  |
|:--------|:-------|:--------------------------------------------------------------------|
| command | string | Raft 操作命令，见`com.alibaba.nacos.core.distributed.raft.utils.JRaftOps` |
| value   | string | Raft 操作的目标值                                                         |
| groupId | string | 操作的目标Raft Group, 为空时会对所有的Raft Group进行操作。                            |

#### 返回参数

| 参数类型   | 描述   |
|:-------|:-----|
| String | 操作结果 |

#### 请求示例

```java
try {
    String result = namingMaintainService.raftOps("doSnapshot", "172.0.0.1:7848", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.5. 查询Nacos Server支持的分布式ID生成器列表

#### 描述

查询Nacos Server支持的分布式ID生成器列表。如雪花Id生成器

```java
List<IdGeneratorInfo> getIdGenerators() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型                   | 描述        |
|:-----------------------|:----------|
| List\<IdGeneratorInfo> | Id生成器信息列表 |

#### 请求示例

```java
try {
    List<IdGeneratorInfo> result = namingMaintainService.getIdGenerators();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.6. 更新核心模块日志级别

#### 描述

更新核心模块日志级别

```java
void updateLogLevel(String logName, String logLevel) throws NacosException;
```

#### 请求参数

| 参数名      | 参数类型   | 描述                    |
|:---------|:-------|:----------------------|
| logName  | string | 日志模块名称，如`core-auth`等  |
| logLevel | string | 日志级别（如`INFO`、`DEBUG`） |

#### 返回参数

无

#### 请求示例

```java
try {
    namingMaintainService.updateLogLevel("core-auth", "INFO");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.7. 查询Nacos Server节点列表

#### 描述

查询Nacos Server节点列表。

```java
Collection<NacosMember> listClusterNodes(String address, String state) throws NacosException;
```

#### 请求参数

| 参数名     | 参数类型   | 描述                                               |
|:--------|:-------|:-------------------------------------------------|
| address | string | Server节点的地址，默认为""，为空时返回所有节点，不为空时返回满足前缀匹配的节点      |
| state   | string | Server节点的状态，如`UP`，默认为""，为空时返回所有节点，不为空时返回满足此状态的节点 |

#### 返回参数

| 参数类型                     | 描述               |
|:-------------------------|:-----------------|
| Collection\<NacosMember> | Nacos Server节点列表 |

其中NacosMember的字段说明如下：

| 参数名        | 参数类型                | 描述                       |
|:-----------|:--------------------|:-------------------------|
| ip         | string              | Server节点的IP              |
| port       | int                 | Server节点的主端口             |
| state      | NodeState           | Server节点的运行状态            |
| extendInfo | Map<String, Object> | Server节点的拓展数据，如Raft的相关信息 |

#### 请求示例

```java
try {
    Collection<NacosMember> result = namingMaintainService.namingMaintainService("", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.8. 更新Nacos Server的地址发现模式

#### 描述

Nacos Server的地址发现模式是控制Nacos Server发现同集群的其他节点地址的方式，用于在Nacos Server启动和运行中组建Nacos集群。

通过此接口可以动态的修改Nacos Server的地址发现模式，实现使用不同的方式进行Nacos集群的组建。

```java
Boolean updateLookupMode(String type) throws NacosException;
```

#### 请求参数

| 参数名  | 参数类型   | 描述                             |
|:-----|:-------|:-------------------------------|
| type | string | 地址发现模式的类型，默认支持`file`和`address` |

#### 返回参数

| 参数类型    | 描述           |
|:--------|:-------------|
| boolean | `true`代表更新成功 |

#### 请求示例

```java
try {

} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.9. 查询当前Nacos Server节点的长连接列表

#### 描述

查询连接到当前Nacos Server节点的长连接列表。

```java
Map<String, ConnectionInfo> getCurrentClients() throws NacosException;
```

#### 请求参数

无
#### 返回参数

| 参数类型                         | 描述                           |
|:-----------------------------|:-----------------------------|
| Map\<String, ConnectionInfo> | 长连接列表，key为连接ID，value为连接的详细信息 |

#### 请求示例

```java
try {
    Map<String, ConnectionInfo> result = namingMaintainService.getCurrentClients();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.10. 均匀Nacos Server节点的长连接负载

#### 描述

Nacos Server节点的长连接负载是控制Nacos Server节点的长连接负载的方式，用于在Nacos Server节点之间均匀的负载长连接。

```java
String reloadConnectionCount(Integer count, String redirectAddress) throws NacosException;
```

#### 请求参数

| 参数名             | 参数类型   | 描述                     |
|:----------------|:-------|:-----------------------|
| count           | int    | 预期保留的长连接个数             |
| redirectAddress | string | 预期重定向地址，默认为空，为空为随机进行负载 |

#### 返回参数

| 参数类型   | 描述      |
|:-------|:--------|
| String | 均匀连接的结果 |

#### 请求示例

```java
try {
    String result = namingMaintainService.reloadConnectionCount(10, "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.11. 自动均匀Nacos Server节点的长连接负载

#### 描述

让Nacos Server根据长连接数量自动进行Server见的均匀负载。

```java
String smartReloadCluster(String loaderFactorStr) throws NacosException;
```

#### 请求参数

| 参数名             | 参数类型   | 描述                                                       |
|:----------------|:-------|:---------------------------------------------------------|
| loaderFactorStr | string | 自动均匀负载时的方差比例，默认0.1f，代表自动均匀负载时，集群节点间最大的连接数和最小的连接数差异在10%以内 |

#### 返回参数

| 参数类型   | 描述      |
|:-------|:--------|
| String | 均匀连接的结果 |

#### 请求示例

```java
try {
    String result = namingMaintainService.smartReloadCluster("0.1f");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.12. 指定单个Nacos客户端连接进行重载

#### 描述

指定单个Nacos客户端连接进行重载。

```java
String reloadSingleClient(String connectionId, String redirectAddress) throws NacosException;
```

#### 请求参数

| 参数名             | 参数类型   | 描述                     |
|:----------------|:-------|:-----------------------|
| connectionId    | string | 连接Id                   |
| redirectAddress | string | 预期重定向地址，默认为空，为空为随机进行负载 |

#### 返回参数

| 参数类型   | 描述      |
|:-------|:--------|
| String | 均匀连接的结果 |

#### 请求示例

```java
try {
    String result = namingMaintainService.reloadSingleClient("111111111_127.0.0.1_10000");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.13. 查询Nacos Server长连接负载统计信息

#### 描述

查询Nacos Server长连接负载统计信息。

```java
ServerLoaderMetrics getClusterLoaderMetrics() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型                | 描述        |
|:--------------------|:----------|
| ServerLoaderMetrics | 长连接负载统计信息 |

#### 请求示例

```java
try {
    ServerLoaderMetrics result = namingMaintainService.getClusterLoaderMetrics();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.14. 查询命名空间列表

#### 描述

查询命名空间列表。

```java
List<Namespace> getNamespaceList() throws NacosException;
```

#### 请求参数

无

#### 返回参数

| 参数类型             | 描述     |
|:-----------------|:-------|
| List\<Namespace> | 命名空间列表 |

其中Namespace中的属性如下：

| 参数名               | 参数类型   | 描述                                          |
|:------------------|:-------|:--------------------------------------------|
| namespace         | string | 命名空间id                                      |
| namespaceShowName | string | 命名空间的名字                                     |
| namespaceDesc     | string | 命名空间的描述                                     |
| quota             | int    | 命名空间下配置的个数配额（需要配合配置中心的容量管理使用，否则不实际生效），默认200 |
| configCount       | int    | 命名空间下配置的个数                                  |
| type              | int    | 命名空间的类型，预留字段，目前均为1                          |

#### 请求示例

```java
try {
    List<Namespace> result = namingMaintainService.getNamespaceList();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.15. 查询指定命名空间

#### 描述

查询指定命名空间。

```java
Namespace getNamespace(String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述     |
|:------------|:-------|:-------|
| namespaceId | string | 命名空间ID |

#### 返回参数

| 参数类型      | 描述      |
|:----------|:--------|
| Namespace | 命名空间的详情 |

其中Namespace中的属性如下：

| 参数名               | 参数类型   | 描述                                          |
|:------------------|:-------|:--------------------------------------------|
| namespace         | string | 命名空间id                                      |
| namespaceShowName | string | 命名空间的名字                                     |
| namespaceDesc     | string | 命名空间的描述                                     |
| quota             | int    | 命名空间下配置的个数配额（需要配合配置中心的容量管理使用，否则不实际生效），默认200 |
| configCount       | int    | 命名空间下配置的个数                                  |
| type              | int    | 命名空间的类型，预留字段，目前均为1                          |

#### 请求示例

```java
try {
    Namespace result = namingMaintainService.getNamespace("public");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.16. 创建命名空间

#### 描述

创建命名空间。

```java
Boolean createNamespace(String namespaceName, String namespaceDesc) throws NacosException;

Boolean createNamespace(String namespaceId, String namespaceName, String namespaceDesc) throws NacosException;
```

#### 请求参数

| 参数名           | 参数类型   | 描述                                            |
|:--------------|:-------|:----------------------------------------------|
| namespaceName | string | 命名空间的名字                                       |
| namespaceDesc | string | 命名空间的描述                                       |
| namespaceId   | string | 自定义的命名空间ID，默认为""，为空时将会由Nacos自动生成的UUID作为命名空间ID |

#### 返回参数

| 参数类型    | 描述        |
|:--------|:----------|
| boolean | 创建命名空间的结果 |

#### 请求示例

```java
try {
    boolean result = namingMaintainService.createNamespace("test", "test");
    result = namingMaintainService.createNamespace("test", "test", "test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.17. 更新命名空间

#### 描述

更新指定命名空间的名字或描述。

```java
Boolean updateNamespace(String namespaceId, String namespaceName, String namespaceDesc) throws NacosException;
```

#### 请求参数

| 参数名           | 参数类型   | 描述           |
|:--------------|:-------|:-------------|
| namespaceId   | string | 需要更新的命名空间ID。 |
| namespaceName | string | 修改后的命名空间名称。  |
| namespaceDesc | string | 修改后的命名空间描述。  |

#### 返回参数

| 参数类型    | 描述        |
|:--------|:----------|
| boolean | 更新命名空间的结果 |

#### 请求示例

```java
try {
    boolean result = namingMaintainService.updateNamespace("test", "testNamespaceName", "testNamespaceDesc");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.18. 删除命名空间

#### 描述

删除指定命名空间。

```java
Boolean deleteNamespace(String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述         |
|:------------|:-------|:-----------|
| namespaceId | string | 要删除的命名空间id |

#### 返回参数

| 参数类型    | 描述        |
|:--------|:----------|
| boolean | 删除命名空间的结果 |

#### 请求示例

```java
try {
    boolean result = namingMaintainService.deleteNamespace("test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 5.14. 检查命名空间是否存在

#### 描述

检查命名空间是否存在。

```java
Boolean checkNamespaceIdExist(String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述         |
|:------------|:-------|:-----------|
| namespaceId | string | 待检查的命名空间id |

#### 返回参数

| 参数类型    | 描述                           |
|:--------|:-----------------------------|
| boolean | 命名空间的检查结果，`true`表示该命名空间id已存在 |

#### 请求示例

```java
try {
    boolean result = namingMaintainService.checkNamespaceIdExist("test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

## 6. MCP 服务

### 6.1. 获取MCP服务列表

#### 描述

通过mcpName，精确获取MCP服务列表，若传入的mcpName为空，则返回所有MCP服务列表。

```java
Page<McpServerBasicInfo> listMcpServer() throws NacosException;

Page<McpServerBasicInfo> listMcpServer(int pageNo, int pageSize) throws NacosException;

Page<McpServerBasicInfo> listMcpServer(String mcpName, int pageNo, int pageSize) throws NacosException;

Page<McpServerBasicInfo> listMcpServer(String namespaceId, String mcpName, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                     |
|:------------|:-------|:---------------------------------------|
| pageNo      | int    | MCP服务列表的分页页码，默认为1。                     |
| pageSize    | int    | MCP服务的分页大小，默认为100。                     |
| mcpName     | String | MCP服务的准确名字，若传入的mcpName为空，则返回所有MCP服务列表。 |
| namespaceId | String | MCP服务所属的命名空间id， 默认为`public`。           |

#### 返回参数

| 参数类型                      | 描述           |
|:--------------------------|:-------------|
| Page\<McpServerBasicInfo> | MCP服务列表的分页结果 |

#### 请求示例

```java
try {
    Page<McpServerBasicInfo> result = aiMaintainerService.listMcpServer();
    result = aiMaintainerService.listMcpServer(1, 100);
    result = aiMaintainerService.listMcpServer("", 1, 100);
    result = aiMaintainerService.listMcpServer("public", "", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 6.2. 搜索MCP服务列表

#### 描述

通过mcpName，模糊搜索MCP服务列表，若传入的mcpName为空，则返回所有MCP服务列表。

```java
Page<McpServerBasicInfo> searchMcpServer(String mcpName) throws NacosException;

Page<McpServerBasicInfo> searchMcpServer(String mcpName, int pageNo, int pageSize) throws NacosException;

Page<McpServerBasicInfo> searchMcpServer(String namespaceId, String mcpName, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                     |
|:------------|:-------|:---------------------------------------|
| pageNo      | int    | MCP服务列表的分页页码，默认为1。                     |
| pageSize    | int    | MCP服务的分页大小，默认为100。                     |
| mcpName     | String | MCP服务的准确名字，若传入的mcpName为空，则返回所有MCP服务列表。 |
| namespaceId | String | MCP服务所属的命名空间id， 默认为`public`。           |

#### 返回参数

| 参数类型                      | 描述           |
|:--------------------------|:-------------|
| Page\<McpServerBasicInfo> | MCP服务列表的分页结果 |

#### 请求示例

```java
try {
    Page<McpServerBasicInfo> result = aiMaintainerService.searchMcpServer("");
    result = aiMaintainerService.searchMcpServer("", 1, 100);
    result = aiMaintainerService.searchMcpServer("public", "", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 6.3. 获取MCP服务详情

#### 描述

通过mcpName，获取详细的MCP服务信息。

```java
McpServerDetailInfo getMcpServerDetail(String mcpName) throws NacosException;

McpServerDetailInfo getMcpServerDetail(String mcpName, String version) throws NacosException;

McpServerDetailInfo getMcpServerDetail(String namespaceId, String mcpName, String version) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                           |
|:------------|:-------|:-----------------------------|
| mcpName     | String | MCP服务的准确名字                   |
| version     | String | MCP服务的版本号，不指定时默认返回最新版本。      |
| namespaceId | String | MCP服务所属的命名空间id， 默认为`public`。 |

#### 返回参数

| 参数类型    | 描述                           |
|:--------|:-----------------------------|

#### 请求示例

```java
try {
    McpServerDetailInfo result = aiMaintainerService.getMcpServerDetail("test");
    result = aiMaintainerService.getMcpServerDetail("test", "1.0.0");
    result = aiMaintainerService.getMcpServerDetail("public", "test", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 6.4. 创建Local(stdio)类型的MCP服务

#### 描述

创建类型为Local(stdio)的MCP服务。

```java
String createLocalMcpServer(String mcpName, String version) throws NacosException;

String createLocalMcpServer(String mcpName, String version, String description) throws NacosException;

String createLocalMcpServer(String mcpName, String version, String description, McpToolSpecification toolSpec) throws NacosException;

String createLocalMcpServer(String mcpName, String version, String description, Map<String, Object> localServerConfig, McpToolSpecification toolSpec) throws NacosException;

String createLocalMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec) throws NacosException;
```

#### 请求参数

| 参数名               | 参数类型                 | 描述                                                                                                   |
|:------------------|:---------------------|:-----------------------------------------------------------------------------------------------------|
| mcpName           | String               | 创建的MCP服务的名字                                                                                          | 
| version           | String               | 创建的MCP服务的版本                                                                                          |
| description       | String               | MCP服务的描述                                                                                             |
| localServerConfig | Map<String, Object>  | stdio类型的MCP服务配置信息，可参考此MCP服务的启动配置进行配置                                                                 |
| toolSpec          | McpToolSpecification | MCP服务所支持的工具定义内容                                                                                      |
| serverSpec        | McpServerBasicInfo   | MCP服务的定义内容，可由`mcpName`, `version`,`description`,`localServerConfig`组成，也可以自行创建详细的`McpServerBasicInfo` |

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 创建成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    String result = aiMaintainerService.createLocalMcpServer("test", "1.0.0");
    result = aiMaintainerService.createLocalMcpServer("test", "1.0.0", "test for mcp server");
    result = aiMaintainerService.createLocalMcpServer("test", "1.0.0", "test for mcp server", null);
    result = aiMaintainerService.createLocalMcpServer("test", "1.0.0", "test for mcp server", Collections.emptyMap(), null);
    McpServerBasicInfo mcpSpec = new McpServerBasicInfo();
    mcpSpec.setName("test");
    mcpSpec.setProtocol(AiConstants.Mcp.MCP_PROTOCOL_STDIO);
    mcpSpec.setDescription("test for mcp server");
    mcpSpec.setLocalServerConfig(Collections.emptyMap());
    ServerVersionDetail versionDetail = new ServerVersionDetail();
    versionDetail.setVersion("1.0.0");
    mcpSpec.setVersionDetail(versionDetail);
    result = aiMaintainerService.createLocalMcpServer("test", mcpSpec, null);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 6.5. 创建Remote(sse, streamable等)类型的MCP服务

#### 描述

创建类型为Remote(sse, streamable等)的MCP服务。

```java
String createRemoteMcpServer(String mcpName, String version, String protocol, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, String version, String protocol, McpServerRemoteServiceConfig remoteServiceConfig, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, String version, String description, String protocol, McpServerRemoteServiceConfig remoteServiceConfig, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, String version, String description, String protocol, McpServerRemoteServiceConfig remoteServiceConfig, McpEndpointSpec endpointSpec, McpToolSpecification toolSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;
```

#### 请求参数

| 参数名                 | 参数类型                         | 描述                                                                                                   |
|:--------------------|:-----------------------------|:-----------------------------------------------------------------------------------------------------|
| mcpName             | String                       | 创建的MCP服务的名字                                                                                          | 
| version             | String                       | 创建的MCP服务的版本                                                                                          |
| description         | String                       | MCP服务的描述                                                                                             |
| protocol            | String                       | MCP服务所支持的协议类型，目前支持sse, streamable等协议                                                                 |   
| endpointSpec        | McpEndpointSpec              | MCP服务Remote Endpoint定义内容，可选`REF`或`DIRECT`类型进行配置。                                                     |
| remoteServiceConfig | McpServerRemoteServiceConfig | sse或streamable类型的MCP服务配置信息，可参考此MCP服务的启动配置进行配置                                                        |
| toolSpec            | McpToolSpecification         | MCP服务所支持的工具定义内容                                                                                      |
| serverSpec          | McpServerBasicInfo           | MCP服务的定义内容，可由`mcpName`, `version`,`description`,`localServerConfig`组成，也可以自行创建详细的`McpServerBasicInfo` |

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 创建成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    McpEndpointSpec mcpEndpointSpec = new McpEndpointSpec();
    mcpEndpointSpec.setType(AiConstants.Mcp.MCP_ENDPOINT_TYPE_DIRECT);
    mcpEndpointSpec.getData().put("address", "127.0.0.1");
    mcpEndpointSpec.getData().put("port", "8080");
    String result = aiMaintainerService.createRemoteMcpServer("test", "1.0.0", AiConstants.Mcp.MCP_PROTOCOL_SSE, mcpEndpointSpec);
    result = aiMaintainerService.createRemoteMcpServer("test", "1.0.0", AiConstants.Mcp.MCP_PROTOCOL_SSE, new McpServerRemoteServiceConfig(), mcpEndpointSpec);
    result = aiMaintainerService.createRemoteMcpServer("test", "1.0.0", "test for mcp server", AiConstants.Mcp.MCP_PROTOCOL_SSE, new McpServerRemoteServiceConfig(), mcpEndpointSpec);
    result = aiMaintainerService.createRemoteMcpServer("test", "1.0.0", "test for mcp server", AiConstants.Mcp.MCP_PROTOCOL_SSE, new McpServerRemoteServiceConfig(), mcpEndpointSpec, null);
    McpServerBasicInfo mcpSpec = new McpServerBasicInfo();
    mcpSpec.setName("test");
    mcpSpec.setDescription("test for mcp server");
    mcpSpec.setProtocol(AiConstants.Mcp.MCP_PROTOCOL_SSE);
    mcpSpec.setRemoteServerConfig(new McpServerRemoteServiceConfig());
    ServerVersionDetail versionDetail = new ServerVersionDetail();
    versionDetail.setVersion("1.0.0");
    mcpSpec.setVersionDetail(versionDetail);
    result = aiMaintainerService.createRemoteMcpServer("test", mcpSpec, mcpEndpointSpec);
    result = aiMaintainerService.createRemoteMcpServer("test", mcpSpec, null, mcpEndpointSpec);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 6.6. 更新MCP服务

#### 描述

更新指定的MCP服务。

```java
boolean updateMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;

boolean updateMcpServer(String mcpName, boolean isLatest, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;

boolean updateMcpServer(String namespaceId, String mcpName, boolean isLatest, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;
```

#### 请求参数

| 参数名          | 参数类型                 | 描述                          |
|:-------------|:---------------------|:----------------------------|
| mcpName      | String               | MCP服务的名称                    |
| namespaceId  | String               | MCP服务所属的命名空间ID，默认为`public`  |
| isLatest     | boolean              | 更新的MCP服务版本是否为最新版本，默认为`true` |
| serverSpec   | McpServerBasicInfo   | 新版本的MCP服务的服务定义内容            |
| toolSpec     | McpToolSpecification | 新版本的MCP服务的工具定义内容            |
| endpointSpec | McpEndpointSpec      | 新版本的MCP服务的Endpoint定义内容      | 

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 更新成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    McpServerBasicInfo mcpSpec = new McpServerBasicInfo();
    mcpSpec.setName("test");
    mcpSpec.setDescription("test for mcp server");
    mcpSpec.setProtocol(AiConstants.Mcp.MCP_PROTOCOL_STDIO);
    Map<String, Object> localServerConfig = Collections.singletonMap("test", new HashMap<>());
    mcpSpec.setLocalServerConfig(localServerConfig);
    ServerVersionDetail versionDetail = new ServerVersionDetail();
    versionDetail.setVersion("1.0.1");
    mcpSpec.setVersionDetail(versionDetail);
    boolean result = aiMaintainerService.updateMcpServer("test", mcpSpec, null, null);
    result = aiMaintainerService.updateMcpServer("test", true, null, null, null);
    result = aiMaintainerService.updateMcpServer("public", "test", true, null, null, null);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 6.7. 删除MCP服务

#### 描述

删除指定的MCP服务。

```java
boolean deleteMcpServer(String mcpName) throws NacosException;

boolean deleteMcpServer(String namespaceId, String mcpName) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                         |
|:------------|:-------|:---------------------------|
| mcpName     | String | MCP服务的名称                   |
| namespaceId | String | MCP服务所属的命名空间ID，默认为`public` |

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 删除成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    boolean result = aiMaintainerService.deleteMcpServer("test");
    result = aiMaintainerService.deleteMcpServer("public", "test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

## 7. A2A 注册中心

### 7.1. 发布AgentCard

#### 描述

发布AgentCard到指定的命名空间下。

```java
boolean registerAgent(AgentCard agentCard) throws NacosException;

boolean registerAgent(AgentCard agentCard, String namespaceId) throws NacosException;

boolean registerAgent(AgentCard agentCard, String namespaceId, String registrationType) throws NacosException;
```

#### 请求参数

| 参数名              | 参数类型      | 描述                                                                                                                     |
|:-----------------|:----------|:-----------------------------------------------------------------------------------------------------------------------|
| agentCard        | AgentCard | AgentCard对象                                                                                                            |
| namespaceId      | String    | AgentCard所属的命名空间ID，默认为`public`                                                                                         |
| registrationType | String    | 注册方式，可选值为`URL`和`SERVICE`，默认为`URL`，设置此AgentCard默认的`url`获取方式，`URL`代表直接读取注册时的`url`，`SERVICE`代表根据注册在Nacos中的endpoint生成`url` |

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 注册成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    AgentCard agentCard = new AgentCard();
    agentCard.setName("test");
    agentCard.setDescription("test for agent card");
    agentCard.setUrl("http://localhost:8848");
    agentCard.setVersion("1.0.0");
    agentCard.setProtocolVersion("0.3.0");
    boolean result = aiMaintainerService.registerAgent(agentCard);
    result = aiMaintainerService.registerAgent(agentCard, "public");
    result = aiMaintainerService.registerAgent(agentCard, "public", "URL");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 7.2. 查询AgentCard

#### 描述

查询指定命名空间下的AgentCard。

```java
AgentCardDetailInfo getAgentCard(String agentName) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String namespaceId) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String namespaceId, String registrationType) throws NacosException;
```

#### 请求参数

| 参数名              | 参数类型   | 描述                                                                                      |
|:-----------------|:-------|:----------------------------------------------------------------------------------------|
| agentName        | String | AgentCard的名称                                                                            |
| namespaceId      | String | AgentCard所属的命名空间ID，默认为`public`                                                          |
| registrationType | String | 注册方式，可选值为`URL`和`SERVICE`，默认为`URL`，可选，若为空，则根据注册此AgentCard时设置的`registrationType`自动选择`url` |

#### 返回参数

| 参数类型                | 描述            |
|:--------------------|:--------------|
| AgentCardDetailInfo | AgentCard详情对象 |

#### 请求示例

```java
try {
    AgentCardDetailInfo result = aiMaintainerService.getAgentCard("test");
    result = aiMaintainerService.getAgentCard("test", "public");
    result = aiMaintainerService.getAgentCard("test", "public", "URL");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 7.3. 更新AgentCard

#### 描述

更新指定命名空间下的AgentCard。

```java
boolean updateAgentCard(AgentCard agentCard) throws NacosException;

boolean updateAgentCard(AgentCard agentCard, String namespaceId) throws NacosException;

boolean updateAgentCard(AgentCard agentCard, String namespaceId, boolean setAsLatest) throws NacosException;

boolean updateAgentCard(AgentCard agentCard, String namespaceId, boolean setAsLatest, String registrationType) throws NacosException;
```

#### 请求参数

| 参数名              | 参数类型      | 描述                                                                                                                     |
|:-----------------|:----------|:-----------------------------------------------------------------------------------------------------------------------|
| agentCard        | AgentCard | AgentCard对象                                                                                                            |
| namespaceId      | String    | AgentCard所属的命名空间ID，默认为`public`                                                                                         |
| setAsLatest      | boolean   | 是否将此AgentCard设置为最新版本                                                                                                   |
| registrationType | String    | 注册方式，可选值为`URL`和`SERVICE`，默认为`URL`，设置此AgentCard默认的`url`获取方式，`URL`代表直接读取注册时的`url`，`SERVICE`代表根据注册在Nacos中的endpoint生成`url` |

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 更新成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    AgentCard agentCard = new AgentCard();
    agentCard.setName("test");
    agentCard.setDescription("test for agent card");
    agentCard.setUrl("http://localhost:8848");
    agentCard.setVersion("1.0.0");
    agentCard.setProtocolVersion("0.3.0");
    boolean result = aiMaintainerService.updateAgentCard(agentCard);
    result = aiMaintainerService.updateAgentCard(agentCard, "public");
    result = aiMaintainerService.updateAgentCard(agentCard, "public", true);
    result = aiMaintainerService.updateAgentCard(agentCard, "public", true, "URL");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 7.4. 删除AgentCard

#### 描述

删除指定命名空间下的AgentCard。

```java
boolean deleteAgent(String agentName) throws NacosException;

boolean deleteAgent(String agentName, String namespaceId) throws NacosException;

boolean deleteAgent(String agentName, String namespaceId, String version) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                             |
|:------------|:-------|:-------------------------------|
| agentName   | String | AgentCard的名称                   |
| namespaceId | String | AgentCard所属的命名空间ID，默认为`public` |
| version     | String | AgentCard的版本，若为空，则删除所有版本       |

#### 返回参数

| 参数类型    | 描述                     |
|:--------|:-----------------------|
| boolean | 删除成功为`true`，其他为`false` |

#### 请求示例

```java
try {
    boolean result = aiMaintainerService.deleteAgent("test");
    result = aiMaintainerService.deleteAgent("test", "public");
    result = aiMaintainerService.deleteAgent("test", "public", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 7.5. 查询指定AgentCard的所有版本

#### 描述

查询指定命名空间下的指定AgentCard的所有版本。

```java
List<AgentVersionDetail> listAllVersionOfAgent(String agentName) throws NacosException;

List<AgentVersionDetail> listAllVersionOfAgent(String agentName, String namespaceId) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                             |
|:------------|:-------|:-------------------------------|
| agentName   | String | AgentCard的名称                   |
| namespaceId | String | AgentCard所属的命名空间ID，默认为`public` |

#### 返回参数

| 参数类型                     | 描述               |
|:-------------------------|:-----------------|
| List<AgentVersionDetail> | AgentCard的所有版本列表 |

#### 请求示例

```java
try {
    List<AgentVersionDetail> result = aiMaintainerService.listAllVersionOfAgent("test");
    result = aiMaintainerService.listAllVersionOfAgent("test", "public");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 7.6. 根据AgentCard名称搜索AgentCard

#### 描述

根据AgentCard名称搜索AgentCard。每次仅能搜索单个命名空间下的AgentCard。

```java
Page<AgentCardVersionInfo> searchAgentCardsByName(String agentNamePattern) throws NacosException;

default Page<AgentCardVersionInfo> searchAgentCardsByName(String agentNamePattern, int pageNo, int pageSize) throws NacosException;

Page<AgentCardVersionInfo> searchAgentCardsByName(String namespaceId, String agentNamePattern, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名              | 参数类型   | 描述                             |
|:-----------------|:-------|:-------------------------------|
| agentNamePattern | String | AgentCard的名称的格式匹配字符串           |
| namespaceId      | String | AgentCard所属的命名空间ID，默认为`public` |
| pageNo           | int    | 页码，默认为1                        |
| pageSize         | int    | 每页大小，默认为100                    |

#### 返回参数

| 参数类型                       | 描述      |
|:---------------------------|:--------|
| Page<AgentCardVersionInfo> | 搜索的分页结果 |

#### 请求示例

```java
try {
    Page<AgentCardVersionInfo> result = aiMaintainerService.searchAgentCardsByName("test");
    result = aiMaintainerService.searchAgentCardsByName("test", 1, 100);
    result = aiMaintainerService.searchAgentCardsByName("test", "public", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。

### 7.7. 分页查询AgentCard列表

#### 描述

分页查询AgentCard列表。每次仅能查询单个命名空间下的AgentCard。

```java
Page<AgentCardVersionInfo> listAgentCards() throws NacosException;

Page<AgentCardVersionInfo> listAgentCards(int pageNo, int pageSize) throws NacosException;

Page<AgentCardVersionInfo> listAgentCards(String namespaceId, int pageNo, int pageSize) throws NacosException;

Page<AgentCardVersionInfo> listAgentCards(String namespaceId, String agentName, int pageNo, int pageSize) throws NacosException;
```

#### 请求参数

| 参数名         | 参数类型   | 描述                                   |
|:------------|:-------|:-------------------------------------|
| namespaceId | String | AgentCard所属的命名空间ID，默认为`public`       |
| pageNo      | int    | 页码，默认为1                              |
| pageSize    | int    | 每页大小，默认为100                          |
| agentName   | String | AgentCard的名称，精确匹配，若为空，则查询所有AgentCard |

#### 返回参数

| 参数类型                       | 描述      |
|:---------------------------|:--------|
| Page<AgentCardVersionInfo> | 查询的分页结果 |

#### 请求示例

```java
try {
    Page<AgentCardVersionInfo> result = aiMaintainerService.listAgentCards();
    result = aiMaintainerService.listAgentCards(1, 100);
    result = aiMaintainerService.listAgentCards("public", 1, 100);
    result = aiMaintainerService.listAgentCards("test", "public", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### 异常说明

读取配置超时或网络异常，抛出 NacosException 异常。
