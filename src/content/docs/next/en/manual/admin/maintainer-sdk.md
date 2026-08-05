---
title: Maintainer SDK
keywords: [ Java,Admin,Maintainer,SDK,Manual ]
description: This document describes the usage of the Nacos Operations and Maintenance SDK (nacos-maintainer-sdk), including how to configure the SDK and utilize its APIs.
sidebar:
  order: 11
---

# Maintainer SDK

The Nacos Maintainer SDK, also known as Nacos-Maintainer-SDK, is a Java SDK for maintenance scenarios of Nacos features such as the config center, service registry, and distributed locks. It provides stable and easy-to-use config center, service registry, and distributed lock capabilities for Nacos maintainers and special application scenarios such as gateway applications and console applications, making it easier to operate configs, services, and distributed locks in Nacos.

Because of its maintainer-oriented positioning, the Nacos Maintainer SDK provides broad data access APIs. Therefore, it must be used with an identity that has higher privileges to prevent potential data leakage.

If your scenario is not maintainer operations or a special application scenario such as a gateway application or console application, use `Nacos Client` instead, such as [Nacos Java Client](../user/java-sdk/usage.md) or [Nacos Go Client](../user/go-sdk/usage.md).

> Currently, the Nacos Maintainer SDK only supports Java. More languages will be supported later.
>
> The Nacos Maintainer SDK is implemented based on [Nacos Admin API](./admin-api.md). The same capabilities can also be operated through the corresponding [Nacos Admin API](./admin-api.md).

## 1. Dependency Overview

### 1.1. Java Version Requirement

The Nacos Java SDK requires JDK 1.8 or later.

### 1.2. Maven Coordinates

```
<!-- Supported in version 3.0.0 and later -->
<dependency>
    <groupId>com.alibaba.nacos</groupId>
    <artifactId>nacos-maintainer-client</artifactId>
    <version>${nacos.client.version}</version>
</dependency>
```

## 2. Initialize the SDK

When initializing the Nacos SDK, use the corresponding `Factory` class to create services for different modules:

```java

Properties properties = new Properties();
// Specify the Nacos Server address
properties.setProperty("serverAddr","localhost:8848");

// Set the Nacos administrator username and password
properties.setProperty("username","nacos");
properties.setProperty("password","{your_admin_password}");

// Initialize the Nacos Maintainer Service for the config center
ConfigMaintainerService configMaintainerService = ConfigMaintainerFactory.createConfigMaintainerService(properties);

// Initialize the Nacos Maintainer Service for the service registry
NamingMaintainerService maintainService = NamingMaintainerFactory.createNamingMaintainerService(properties);

// Initialize the Nacos Maintainer Service for the AI module
AiMaintainerService aiMaintainerService = AiMaintainerFactory.createAiMaintainerService(properties);
```

## 3. Config Center Maintainer APIs

### 3.1. Get Config

#### Description

Gets a config from Nacos.

```java
ConfigDetailInfo getConfig(String dataId) throws NacosException;

ConfigDetailInfo getConfig(String dataId, String groupName) throws NacosException;

ConfigDetailInfo getConfig(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| namespaceId | string | Namespace ID to which the config belongs.                                         |

#### Return Value

| Parameter Type             | Description      |
|:-----------------|:--------|
| ConfigDetailInfo | Detailed config information. |

The specific `ConfigDetailInfo` content is as follows:

| Parameter Name              | Parameter Type   | Description                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | ID of the config in the actual storage medium. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId      | string | Namespace ID to which the config belongs.                                         |
| groupName        | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId           | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5              | string | MD5 value of the config content.                                           |
| type             | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName          | string | Application name to which the config belongs.                                           |
| createTime       | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime       | long   | Latest config update time as a timestamp in milliseconds.                                |
| content          | string | Config content.                                                |
| desc             | string | Config description.                                             |
| encryptedDataKey | string | Config encryption key. This field has a value only when config encryption is used.                          |
| createUser       | string | Username that created this config.                                           |
| createIp         | string | Source IP address that created this config.                                          |
| configTags       | string | Tags of this config. Multiple tags are separated by commas `,`.                                 |

#### Request Example

```java
try {
    // The following three calls all obtain config information for dataId `maintain.client.test` and groupName `DEFAULT_GROUP` under the `public` namespace.
    ConfigDetailInfo configDetailInfo = configMaintainerService.getConfig("maintain.client.test");
    configDetailInfo = configMaintainerService.getConfig("maintain.client.test", Constants.DEFAULT_GROUP);
    configDetailInfo = configMaintainerService.getConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.2. Publish Config

#### Description

Publishes a Nacos config to reduce maintenance costs through automation.

:::note
The same publish API is used to create and modify configs. If the config does not exist, it is created. If the config already exists, it is updated.
:::

```java
boolean publishConfig(String dataId, String content) throws NacosException;

boolean publishConfig(String dataId, String groupName, String content) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content, String desc) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content, String desc, String type) throws NacosException;

boolean publishConfig(String dataId, String groupName, String namespaceId, String content, String appName, String srcUser, String configTags, String desc, String type) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                                             |
|:------------|:-------|:-------------------------------------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes.                           |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.                            |
| namespaceId | string | Namespace ID to which the config belongs.                                                                   |
| content     | string | Config content. The length cannot exceed 100 KB.                                                              |
| desc        | string | Config description.                                                                       |
| type        | string | Config type. See `com.alibaba.nacos.api.config.ConfigType`. The default value is `TEXT`.                       |
| appName     | string | Application name to which the config belongs.                                                                     |
| srcUser     | string | Username used to publish this config. The config is published on behalf of this user, and the config `createUser` is set to this user. If an empty string is passed, the current logged-in username is used as `createUser`. |
| configTags  | string | Tags of this config. Multiple tags are separated by commas `,`.                                                           |

#### Response Parameters

| Parameter Type    | Description     |
|:--------|:-------|
| boolean | Whether publishing succeeds. |

#### Request Example

```java
try {
    // The following calls all create a config with groupName `DEFAULT_GROUP`, dataId `maintain.client.test`, and content `testContent` under the `public` namespace.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.3. Delete Config

#### Description

Deletes a Nacos config to reduce maintenance costs through automation.

:::note
If the config exists, it is deleted. If the config does not exist, a success message is returned directly.
:::

```java
boolean deleteConfig(String dataId) throws NacosException;

boolean deleteConfig(String dataId, String groupName) throws NacosException;

boolean deleteConfig(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| namespaceId | string | Namespace ID to which the config belongs.                                         |

#### Response Parameters

| Parameter Type    | Description     |
|:--------|:-------|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    // The following three calls all delete the config with groupName `DEFAULT_GROUP` and dataId `maintain.client.test` under the `public` namespace.
    boolean result =  configMaintainerService.deleteConfig("maintain.client.test");
    result = configMaintainerService.deleteConfig("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.deleteConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.4. Batch Delete Configs

#### Description

Deletes Nacos configs in batches to reduce maintenance costs through automation.

```java
boolean deleteConfigs(List<Long> ids) throws NacosException;

boolean deleteConfigs(List<Long> ids, String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type        | Description                                                                                  |
|:----|:------------|:------------------------------------------------------------------------------------|
| ids | List\<Long> | List of config IDs to delete. This ID is the ID of the config in the actual storage medium. Obtain it from the `id` field returned by the [Get Config](#31-get-config) or [Get Config List](#35-get-config-list) API. |
| namespaceId | string | Namespace ID of the configs. The default is `public` when omitted. |

#### Return Value

| Parameter Type    | Description     |
|:--------|:-------|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    ConfigDetailInfo configDetailInfo = configMaintainerService.getConfig("maintain.client.test");
    boolean result = configMaintainerService.deleteConfigs(Collections.singletonList(configDetailInfo.getId()));
    // To specify the namespace explicitly, use:
    // boolean result = configMaintainerService.deleteConfigs(Collections.singletonList(configDetailInfo.getId()), Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.5. Get Config List

#### Description

Use this API to obtain a config list that matches the specified conditions. Fuzzy search is not supported. To perform fuzzy search, use the [Search Config List](#36-search-config-list) API.

```java
Page<ConfigBasicInfo> listConfigs(String namespaceId) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId, String type) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId, String type, String configTags, String appName) throws NacosException;

Page<ConfigBasicInfo> listConfigs(String dataId, String groupName, String namespaceId, String type, String configTags, String appName, int pageNo, int pageSize) throws NacosException;

```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                                                |
|:------------|:-------|:----------------------------------------------------------------------------------|
| namespaceId | string | Namespace ID to which the config belongs. |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. The default value is `""`. If it is not empty, only configs whose dataId equals this value are matched. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes. The default value is `""`. If it is not empty, only configs whose groupName equals this value are matched.    |
| type        | string | Config type. See `com.alibaba.nacos.api.config.ConfigType`. The default value is `""`, If it is not empty, only configs whose type equals this value are matched.         |
| configTags  | string | Tags of this config. Multiple tags are separated by commas `,`. The default value is `""`. If it is not empty, only configs whose tag equals this value are matched.                                      |
| appName     | string | Application name to which the config belongs. The default value is `""`. If it is not empty, only configs whose application name equals this value are matched.                                               |
| pageNo      | int    | Page number of the config list. The default value is 1.                                                                   |
| pageSize    | int    | Page size of the config list. The default value is 100.                                                                 |

#### Response Parameters

| Parameter Type                   | Description        |
|:-----------------------|:----------|
| Page\<ConfigBasicInfo> | Paginated config list result. |

The specific `Page` and `ConfigBasicInfo` content is as follows:

| Parameter Name            | Parameter Type                   | Description           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | Total number of configs that match the condition. |
| pageNumber     | int                    | Current page number.        |
| pagesAvailable | int                    | Total number of pages.      |
| pageItems      | List\<ConfigBasicInfo> | Config list on the current page.    |

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | ID of the config in the actual storage medium. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5         | string | MD5 value of the config content.                                           |
| type        | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName     | string | Application name to which the config belongs.                                           |
| createTime  | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime  | long   | Latest config update time as a timestamp in milliseconds.                                |

#### Request Example

```java
try {
    // Gets the first page of all configs under the `public` namespace (up to 100 configs).
    Page<ConfigBasicInfo> result = configMaintainerService.listConfigs(Constants.DEFAULT_NAMESPACE_ID);
    // Gets the first page of all configs whose config group is `DEFAULT_GROUP` under the `public` namespace (up to 100 configs).
    result = configMaintainerService.listConfigs("", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
    // Gets the first page of all configs whose type is `JSON` under the `public` namespace (up to 100 configs).
    result = configMaintainerService.listConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "JSON");
    // Gets the first page of all configs under the `public` namespace whose tag is `testTag1` and application is `testApp` (up to 100 configs).
    result = configMaintainerService.listConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "testTag1", "testApp");
    // Gets the first page of all configs under the `public` namespace (up to 10 configs).
    result = configMaintainerService.listConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "", "", 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.6. Search Config List

#### Description

Use this API to obtain a config list that matches the specified conditions. Fuzzy search is supported. To perform exact search, use the [Query Config List](#35-get-config-list) API.

:::note
This API is performance-intensive. Use it with caution, especially when searching by `Config content`, because performance will degrade significantly.
:::

```java
Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String type) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String configDetail, String type) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String configDetail, String type, String configTags, String appName) throws NacosException;

Page<ConfigBasicInfo> searchConfigs(String dataId, String groupName, String namespaceId, String configDetail, String type, String configTags, String appName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name          | Parameter Type   | Description                                                                                     |
|:-------------|:-------|:---------------------------------------------------------------------------------------|
| namespaceId  | string | Namespace ID to which the config belongs. |
| dataId       | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. The default value is `""`. If it is not empty, only configs whose dataId contains this value are matched. |
| groupName    | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes. The default value is `""`. If it is not empty, only configs whose groupName contains this value are matched.      |
| type         | string | Config type. See `com.alibaba.nacos.api.config.ConfigType`. The default value is `""`, If it is not empty, only configs whose type equals this value are matched.              |
| configDetail | string | Config content. The default value is `""`. If it is not empty, only configs whose content contains this value are matched.                                                      |
| configTags   | string | Tags of this config. Multiple tags are separated by commas `,`. The default value is `""`. If it is not empty, only configs whose tag equals this value are matched.                                           |
| appName      | string | Application name to which the config belongs. The default value is `""`. If it is not empty, only configs whose application name equals this value are matched.                                                    |
| pageNo       | int    | Page number of the config list. The default value is 1.                                                                        |
| pageSize     | int    | Page size of the config list. The default value is 100.                                                                      |

#### Response Parameters

| Parameter Type                   | Description        |
|:-----------------------|:----------|
| Page\<ConfigBasicInfo> | Paginated config list result. |

The specific `Page` and `ConfigBasicInfo` content is as follows:

| Parameter Name            | Parameter Type                   | Description           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | Total number of configs that match the condition. |
| pageNumber     | int                    | Current page number.        |
| pagesAvailable | int                    | Total number of pages.      |
| pageItems      | List\<ConfigBasicInfo> | Config list on the current page.    |

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | ID of the config in the actual storage medium. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5         | string | MD5 value of the config content.                                           |
| type        | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName     | string | Application name to which the config belongs.                                           |
| createTime  | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime  | long   | Latest config update time as a timestamp in milliseconds.                                |

#### Request Example

```java
try {
    // Gets the first page of all configs under the `public` namespace whose config group contains `test` (up to 100 configs).
    Page<ConfigBasicInfo> result = configMaintainerService.searchConfigs("", "test", Constants.DEFAULT_NAMESPACE_ID);
    // Gets the first page of all configs whose type is `JSON` under the `public` namespace (up to 100 configs).
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "JSON");
    // Gets the first page of all configs under the `public` namespace whose content contains `test` (up to 100 configs).
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "test", "");
    // Gets the first page of all configs under the `public` namespace whose tag is `testTag1` and application is `testApp` (up to 100 configs).
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "", "testTag1", "testApp");
    // Gets the first page of all configs under the `public` namespace (up to 10 configs).
    result = configMaintainerService.searchConfigs("", "", Constants.DEFAULT_NAMESPACE_ID, "", "", "", "", 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.7. Clone Config

#### Description

Use this API to clone the specified config to another namespace. You can specify a new `groupName` and `dataId` during cloning.

```java
Map<String, Object> cloneConfig(String namespaceId, List<ConfigCloneInfo> cloneInfos, String srcUser, SameConfigPolicy policy) throws NacosException;

Map<String, Object> cloneConfig(String sourceNamespaceId, String targetNamespaceId, List<ConfigCloneInfo> cloneInfos, String srcUser, SameConfigPolicy policy) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type                   | Description                                                                               |
|:------------|:-----------------------|:---------------------------------------------------------------------------------|
| namespaceId | string                 | Namespace ID used for both source lookup and clone target. The default is `public` when omitted. |
| sourceNamespaceId | string           | Source namespace ID. The default is `public` when omitted. |
| targetNamespaceId | string           | Target namespace ID. The default is `public` when omitted. |
| cloneInfos  | List\<ConfigCloneInfo> | List of configs to clone.                                                                        |
| srcUser     | string                 | Username used to clone this config. The cloned config uses this user as `createUser`. If an empty string is passed, the current logged-in username is used as `createUser`. |
| policy      | SameConfigPolicy       | Conflict handling policy used when cloning configs. The default value is `ABORT`. Optional values are `ABORT` (abort), `SKIP` (skip), and `OVERWRITE` (overwrite).           |

The parameters in `ConfigCloneInfo` are as follows:

| Parameter Name             | Parameter Type   | Description                                                                    |
|:----------------|:-------|:----------------------------------------------------------------------|
| configId        | long   | ID of the config in the actual storage medium. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.                      |
| targetGroupName | string | Target config group. Only English characters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length must not exceed 128 bytes. If empty, the current group of the config is used.       |
| targetDataId    | string | Target config ID. Only English characters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length must not exceed 256 bytes. If empty, the current ID of the config is used. |

#### Response Parameters

| Parameter Type                | Description                                                 |
|:--------------------|:---------------------------------------------------|
| Map<String, Object> | Config clone result. Depending on `policy`, it may return the number of successful, failed, skipped, or overwritten configs. |

#### Request Example

```java
try {
    // Clones the config whose ID is 1 to the `clone-test` namespace with the clone policy `ABORT`. If a config with the same name exists in the target namespace, the clone fails.
    ConfigCloneInfo configCloneInfo = new ConfigCloneInfo();
    configCloneInfo.setConfigId(1L);
    Map<String, Object> result = configMaintainerService.cloneConfig("clone-test", Collections.singletonList(configCloneInfo), "", SameConfigPolicy.ABORT);
    // Clone the config from the public namespace to the clone-test namespace.
    // result = configMaintainerService.cloneConfig(Constants.DEFAULT_NAMESPACE_ID, "clone-test", Collections.singletonList(configCloneInfo), "", SameConfigPolicy.ABORT);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.8. Get All Configs Under a Namespace

#### Description

Use this API to obtain all configs under the specified namespace.

:::note
Unlike [Query Config List](#35-get-config-list), this API does not paginate results. It returns all configs under the namespace at once. Make sure the namespace does not contain too many configs when using this API, otherwise an out-of-memory error may occur.
Prefer [Query Config List](#35-get-config-list) for paginated queries.
:::

```java
List<ConfigBasicInfo> getConfigListByNamespace(String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description          |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID to which the config belongs. |

#### Response Parameters

| Parameter Type                   | Description        |
|:-----------------------|:----------|
| List\<ConfigBasicInfo> | Paginated config list result. |

The specific `ConfigBasicInfo` content is as follows:

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | ID of the config in the actual storage medium. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5         | string | MD5 value of the config content.                                           |
| type        | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName     | string | Application name to which the config belongs.                                           |
| createTime  | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime  | long   | Latest config update time as a timestamp in milliseconds.                                |

#### Request Example

```java
try {
    List<ConfigBasicInfo> result = configMaintainerService.getConfigListByNamespace(Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.9. Get Config Subscriber List

#### Description

Use this API to obtain the subscriber list of a config. To obtain the configs subscribed to by a config subscriber, use [Get All Configs Subscribed to by a Subscriber](#310-get-all-configs-subscribed-to-by-a-subscriber).

```java
ConfigListenerInfo getListeners(String dataId, String groupName) throws NacosException;

ConfigListenerInfo getListeners(String dataId, String groupName, String namespaceId, boolean aggregation) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type    | Description                                                            |
|:------------|:--------|:--------------------------------------------------------------|
| groupName   | string  | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.               |
| dataId      | string  | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes.          |
| namespaceId | string  | Namespace ID to which the config belongs.                                                  |
| aggregation | boolean | Whether to perform an aggregated query. The default value is true. If false, only the subscriber list on the node that receives the request is queried. If true, the subscriber list of this config in the entire cluster is queried. |

#### Response Parameters

| Parameter Type               | Description       |
|:-------------------|:---------|
| ConfigListenerInfo | Config subscriber information. |

The ConfigListenerInfo content is as follows:

| Parameter Name             | Parameter Type                        | Description                                     |
|:----------------|:----------------------------|:---------------------------------------|
| queryType       | string                      | This API always returns `config`.                        |
| listenersStatus | Map\<String, List\<String>> | Subscriber list. The key is the subscriber IP, and the value is the MD5 value of the config subscribed to by this subscriber. |

#### Request Example

```java
try {
    // The following two calls both obtain the cluster-wide subscriber list of config `maintain.client.test` in group `DEFAULT_GROUP` under namespace `public`.
    ConfigListenerInfo result = configMaintainerService.getListeners("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.getListeners("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.10. Get All Configs Subscribed to by a Subscriber

#### Description

Use this API to obtain the config list subscribed to by a config subscriber. To query the subscriber list of a config, use [Get Config Subscriber List](#39-get-config-subscriber-list).

```java
ConfigListenerInfo getAllSubClientConfigByIp(String ip, boolean all, String namespaceId, boolean aggregation) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type    | Description                                                                                            |
|:------------|:--------|:----------------------------------------------------------------------------------------------|
| ip          | string  | IP address of the config subscriber.                                                                                      |
| all         | boolean | Whether to query the config lists subscribed to by all subscribers with the same IP. The default value is false. If false, only the config list subscribed to by the first subscriber that matches `ip` is returned. If true, the config lists subscribed to by all subscribers that match `ip` are returned. |
| namespaceId | string  | Namespace ID to which the config belongs.                                                                                  |
| aggregation | boolean | Whether to perform an aggregated query. The default value is true. If false, only the subscriber list on the node that receives the request is queried. If true, the subscriber list of this config in the entire cluster is queried.                                 |

#### Response Parameters

| Parameter Type               | Description       |
|:-------------------|:---------|
| ConfigListenerInfo | Config subscriber information. |

The ConfigListenerInfo content is as follows:

| Parameter Name             | Parameter Type                        | Description                                                                   |
|:----------------|:----------------------------|:---------------------------------------------------------------------|
| queryType       | string                      | This API always returns `ip`.                                                          |
| listenersStatus | Map\<String, List\<String>> | Subscriber list. The key is `dataId+groupName+namespaceId` of the subscribed config, and the value is the MD5 value of the config subscribed to by this subscriber. |

#### Request Example

```java
try {
    ConfigListenerInfo result = configMaintainerService.getAllSubClientConfigByIp("127.0.0.1", false, Constants.DEFAULT_NAMESPACE_ID, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.11. Publish Beta Gray Config

#### Description

Publishes a Nacos config in gray mode so changes can be tested and the impact of config errors can be reduced.

:::note
A config cannot have duplicate gray releases. If a beta gray config already exists for the config, this API fails. You must [stop the gray release](#312-stop-config-beta-gray-release) before publishing again.
:::

```java
boolean publishBetaConfig(String dataId, String groupName, String namespaceId, String content, String appName, String srcUser, String configTags, String desc, String type, String betaIps) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                                             |
|:------------|:-------|:-------------------------------------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes.                           |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.                            |
| namespaceId | string | Namespace ID to which the config belongs.                                                                   |
| content     | string | Config content. The length cannot exceed 100 KB.                                                              |
| desc        | string | Config description.                                                                       |
| type        | string | Config type. See `com.alibaba.nacos.api.config.ConfigType`. The default value is `TEXT`.                       |
| appName     | string | Application name to which the config belongs.                                                                     |
| srcUser     | string | Username used to publish this config. The config is published on behalf of this user, and the config `createUser` is set to this user. If an empty string is passed, the current logged-in username is used as `createUser`. |
| configTags  | string | Tags of this config. Multiple tags are separated by commas `,`.                                                           |
| betaIps     | string | Gray IP list of the config. Multiple IP addresses are separated by commas `,`.                                                        |

#### Response Parameters

| Parameter Type    | Description     |
|:--------|:-------|
| boolean | Whether publishing succeeds. |

#### Request Example

```java
try {
    // Performs beta gray release of config `maintain.client.test` for IP `127.0.0.1`.
    boolean result = configMaintainerService.publishBetaConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testBeta", "testApp", "", "testTag1", "test", "TEXT", "127.0.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.12. Stop Config Beta Gray Release

#### Description

Stops the beta config of the specified config.

:::note
This API can stop the beta publish state only after the config has been changed to beta publishing by [Publish Beta Gray Config](#311-publish-beta-gray-config).
:::

```java
boolean stopBeta(String dataId, String groupName) throws NacosException;

boolean stopBeta(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| namespaceId | string | Namespace ID to which the config belongs.                                         |

#### Response Parameters

| Parameter Type    | Description           |
|:--------|:-------------|
| boolean | Whether stopping beta gray release succeeds. |

#### Request Example

```java
try {
    // Performs beta gray release of config `maintain.client.test` for IP `127.0.0.1`.
    boolean result = configMaintainerService.publishBetaConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testBeta", "testApp", "", "testTag1", "test", "TEXT", "127.0.0.1");
    // Stops the beta gray release of config `maintain.client.test`.
    result = configMaintainerService.stopBeta("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.stopBeta("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.13. Query Beta Gray Config

#### Description

Queries the beta config of the specified config.

:::note
This API can query the beta publish state only after the config has been changed to beta publishing by [Publish Beta Gray Config](#311-publish-beta-gray-config).
:::

```java
ConfigGrayInfo queryBeta(String dataId, String groupName) throws NacosException;

ConfigGrayInfo queryBeta(String dataId, String groupName, String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| namespaceId | string | Namespace ID to which the config belongs.                                         |


#### Response Parameters

| Parameter Type           | Description      |
|:---------------|:--------|
| ConfigGrayInfo | Gray config information. |

The ConfigGrayInfo content is as follows:

| Parameter Name              | Parameter Type   | Description                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | ID of the config in the actual storage medium. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId      | string | Namespace ID to which the config belongs.                                         |
| groupName        | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId           | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5              | string | MD5 value of the config content.                                           |
| type             | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName          | string | Application name to which the config belongs.                                           |
| createTime       | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime       | long   | Latest config update time as a timestamp in milliseconds.                                |
| content          | string | Config content.                                                |
| desc             | string | Config description.                                             |
| encryptedDataKey | string | Config encryption key. This field has a value only when config encryption is used.                          |
| createUser       | string | Username that created this config.                                           |
| createIp         | string | Source IP address that created this config.                                          |
| configTags       | string | Tags of this config. Multiple tags are separated by commas `,`.                                 |
| grayName         | string | Gray name. The value is fixed to `beta`.                                       |
| grayRule         | string | Gray rule in `json` format. The `expr` field is the gray IP list.                    |

#### Request Example

```java
try {
    // Performs beta gray release of config `maintain.client.test` for IP `127.0.0.1`.
    boolean publishResult = configMaintainerService.publishBetaConfig("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, "testBeta", "testApp", "", "testTag1", "test", "TEXT", "127.0.0.1");
    // Queries the beta gray release of config `maintain.client.test`.
    ConfigGrayInfo result = configMaintainerService.queryBeta("maintain.client.test", Constants.DEFAULT_GROUP);
    result = configMaintainerService.queryBeta("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID);}
catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.14. Get Config History Version List

#### Description

Gets the historical version list of the specified config.

```java
Page<ConfigHistoryBasicInfo> listConfigHistory(String dataId, String groupName, String namespaceId, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| pageNo      | int    | Page number of the config history list. The default value is 1.                                  |
| pageSize    | int    | Page size of the config history list. The default value is 100.                                |


#### Response Parameters

| Parameter Type                          | Description            |
|:------------------------------|:--------------|
| Page\<ConfigHistoryBasicInfo> | Paginated config history list result. |

The `Page` and `ConfigHistoryBasicInfo` content is as follows:

| Parameter Name            | Parameter Type                          | Description               |
|:---------------|:------------------------------|:-----------------|
| totalCount     | int                           | Total number of config history versions that match the condition. |
| pageNumber     | int                           | Current page number.            |
| pagesAvailable | int                           | Total number of pages.          |
| pageItems      | List\<ConfigHistoryBasicInfo> | Config history version list on the current page.    |

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| id          | long   | ID of the config history version. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5         | string | MD5 value of the config content.                                           |
| type        | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName     | string | Application name to which the config belongs.                                           |
| createTime  | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime  | long   | Latest config update time as a timestamp in milliseconds.                                |
| srcUser     | string | Username that operated this version.                                           |
| srcIp       | string | Source IP address that operated this version.                                          |
| opType      | string | Operation type of this historical version. `I` indicates creation, `U` indicates update, and `D` indicates deletion.                      |
| publishType | string | Publish type of this historical version. `formal` indicates formal release, and `gray` indicates gray release.                 |

#### Request Example

```java
try {
    // Queries the historical version list of config `maintain.client.test`.
    Page<ConfigHistoryBasicInfo> configHistoryBasicInfoPage = configMaintainerService.listConfigHistory("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.15. Get Config History Version Details

#### Description

Use this API to query the details of a historical version of a config.

```java
ConfigHistoryDetailInfo getConfigHistoryInfo(String dataId, String groupName, String namespaceId, Long nid) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| nid         | long   | ID of the target historical version. Obtain it through the [Get Config History Version List](#314-get-config-history-version-list) API. |

#### Response Parameters

| Parameter Type                    | Description          |
|:------------------------|:------------|
| ConfigHistoryDetailInfo | Detailed information about the config history version. |

The ConfigHistoryDetailInfo content is as follows:

| Parameter Name              | Parameter Type   | Description                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | ID of the config history version. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId      | string | Namespace ID to which the config belongs.                                         |
| groupName        | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId           | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5              | string | MD5 value of the config content.                                           |
| type             | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName          | string | Application name to which the config belongs.                                           |
| createTime       | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime       | long   | Latest config update time as a timestamp in milliseconds.                                |
| content          | string | Content of the config history version.                                           |
| encryptedDataKey | string | Config decryption key. It is returned only when the config is encrypted.                                |
| grayName         | string | Gray publish name of the config history version. It exists when this historical version is a gray release and is usually `beta`.              |
| extInfo          | string | Extended information of the historical version. It currently stores gray publish rules, such as the gray IP address list, in `json` format.       |

#### Request Example

```java
try {
    // Queries the historical version list of config `maintain.client.test`.
    Page<ConfigHistoryBasicInfo> configHistoryBasicInfoPage = configMaintainerService.listConfigHistory("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, 1, 10);
    int nid = configHistoryBasicInfoPage.getPageItems().get(0).getId();
    // Queries the details of the first historical version in the historical version list of config `maintain.client.test`.
    ConfigHistoryDetailInfo result = configMaintainerService.getConfigHistoryInfo("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, nid);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.16. Query Previous Config Version Details

#### Description

Gets the details of the previous historical version of the specified config.

```java
ConfigHistoryDetailInfo getPreviousConfigHistoryInfo(String dataId, String groupName, String namespaceId, Long id) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                   |
|:------------|:-------|:-----------------------------------------------------|
| namespaceId | string | Namespace ID to which the config belongs.                                         |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| id          | long   | ID of the config in the actual storage medium. Obtain it through [Get Config](#31-get-config).              |

#### Response Parameters

| Parameter Type                    | Description          |
|:------------------------|:------------|
| ConfigHistoryDetailInfo | Detailed information about the config history version. |

The ConfigHistoryDetailInfo content is as follows:

| Parameter Name              | Parameter Type   | Description                                                   |
|:-----------------|:-------|:-----------------------------------------------------|
| id               | long   | ID of the config history version. It has no business meaning and is only a unique identifier in storage. It is usually an auto-increment ID.     |
| namespaceId      | string | Namespace ID to which the config belongs.                                         |
| groupName        | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.      |
| dataId           | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| md5              | string | MD5 value of the config content.                                           |
| type             | string | Config type, such as properties, json, or yaml. It is mainly used for labeling and display.              |
| appName          | string | Application name to which the config belongs.                                           |
| createTime       | long   | Config creation time as a timestamp in milliseconds.                                  |
| modifyTime       | long   | Latest config update time as a timestamp in milliseconds.                                |
| content          | string | Content of the config history version.                                           |
| encryptedDataKey | string | Config decryption key. It is returned only when the config is encrypted.                                |
| grayName         | string | Gray publish name of the config history version. It exists when this historical version is a gray release and is usually `beta`.              |
| extInfo          | string | Extended information of the historical version. It currently stores gray publish rules, such as the gray IP address list, in `json` format.       |

#### Request Example

```java
try {
    // Gets the ID of config `maintain.client.test`.
    int id = configMaintainerService.getConfig("maintain.client.test").getId();
    // Gets the details of the previous historical version of config `maintain.client.test`.
    ConfigHistoryDetailInfo result = configMaintainerService.getPreviousConfigHistoryInfo("maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID, id);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.17. Trigger Nacos Server to Dump Data from Storage to Disk Cache

#### Description

Manually triggers loading all config data from storage to the local cache of Nacos Server.

```java
String updateLocalCacheFromStore() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type   | Description            |
|:-------|:--------------|
| String | Return information of the dump operation. |

#### Request Example

```java
try {
    configMaintainerService.updateLocalCacheFromStore();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.18. Set Config Center Log Level

#### Description

Dynamically sets the log level of the specified module.

```java
String setLogLevel(String logName, String logLevel) throws NacosException;
```

#### Request Parameters

| Parameter Name      | Parameter Type   | Description                                      |
|:---------|:-------|:----------------------------------------|
| logName  | string | Log module name, such as `config-server` or `config-dump`. |
| logLevel |  string      | Log level, such as `INFO` or `DEBUG`.                   |

#### Response Parameters

| Parameter Type   | Description          |
|:-------|:------------|
| String | Result information of setting the log level. |

#### Request Example

```java
try {
    configMaintainerService.setLogLevel("config-server", "DEBUG");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.19. Update config metadata

#### Description

Update config metadata such as description and config tags.

```java
boolean updateConfigMetadata(String dataId, String groupName, String namespaceId, String description, String configTags) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                  |
|:------------|:-------|:----------------------------------------------------|
| dataId      | string | Config ID. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 256 bytes. |
| groupName   | string | Config group. Only English letters and four special characters (`.`, `:`, `-`, `_`) are allowed. The length cannot exceed 128 bytes.  |
| namespaceId | string | Namespace ID to which the config belongs.                                        |
| description | string | Config description.                                             |
| configTags  | string | Tags of this config. Multiple tags are separated by commas `,`.                                |

#### Response Parameters

| Parameter Type    | Description     |
|:--------|:-------|
| boolean | Whether the update succeeds. |

#### Request Example

```java
try {
    configMaintainerService.updateConfigMetadata("maintain.client.test", "DEFAULT_GROUP", "public", "this is a description", "tag1,tag2");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 3.20. Search config list by details

#### Description

Search config list by dataId, groupName, namespaceId, search mode, config detail, type, tags, app name with pagination.

```java
Page<ConfigBasicInfo> searchConfigByDetails(String dataId, String groupName, String namespaceId, String search,
        String configDetail, String type, String configTags, String appName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                                         |
|:------------|:-------|:-----------------------------------------------------------|
| dataId      | string | Config ID. Fuzzy or exact matching is supported depending on `search`.                                   |
| groupName   | string | Config group.                                                    |
| namespaceId | string | Namespace ID to which the config belongs.                                             |
| search      | string | Search mode: `accurate` for exact search or `blur` for fuzzy search.                                |
| configDetail| string | Config detail filter (optional).                                             |
| type        | string | Config type (optional).                                               |
| configTags  | string | Config tags, separated by commas (optional).                                        |
| appName     | string | Application name to which the config belongs (optional).                                             |
| pageNo      | int    | Page number, starting from 1.                                                |
| pageSize    | int    | Number of items per page.                                                     |

#### Response Parameters

| Parameter Type                 | Description         |
|:---------------------|:-----------|
| Page\<ConfigBasicInfo> | Paginated config list. |

#### Request Example

```java
try {
    Page<ConfigBasicInfo> result = configMaintainerService.searchConfigByDetails(
            "maintain.client.test", Constants.DEFAULT_GROUP, Constants.DEFAULT_NAMESPACE_ID,
            "blur", null, null, null, null, 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

## 4. Service Discovery Maintainer APIs

### 4.1. Create Service

#### Description

Creates a new empty service. The default is a persistent service.

```java
String createService(String serviceName) throws NacosException;

String createService(String groupName, String serviceName) throws NacosException;

String createService(String namespaceId, String groupName, String serviceName) throws NacosException;

String createService(String namespaceId, String groupName, String serviceName, boolean ephemeral) throws NacosException;

String createService(String namespaceId, String groupName, String serviceName, boolean ephemeral, float protectThreshold) throws NacosException;

String createService(Service service) throws NacosException;
```

#### Request Parameters

| Parameter Name                                        | Parameter Type               | Description                |
|:-------------------------------------------|:-------------------|:------------------|
| serviceName(Service.serviceName)           | string             | Service name             |
| groupName(Service.groupName)               | string             | Service group name           |
| namespaceId(Service.namespaceId)           | string             | Namespace ID to which the service belongs       |
| ephemeral(Service.ephemeral)               | boolean            | Whether the service is ephemeral. The default value is `false`. |
| protectThreshold(Service.protectThreshold) | float              | Service protection threshold. The default value is `0.0`.  |
| Service.metadata                           | Map<String,String> | Service metadata            |
| Service.selector                           | Selector           | Service instance selector. The default value is none.  |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of service creation. |

#### Request Example

```java
try {
    // The following requests all create a persistent service named `maintain.client.test`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.2. Update Service

#### Description

Updates service information, including `protection threshold`, `metadata`, and `instance selector`. The service `name`, `group`, `namespace`, and `persistence` information cannot be modified.

:::note
This API overwrites the original service information during update. Therefore, pass complete service information to avoid losing other information when updating partial data.

If the service does not exist, the update fails. Use [Create Service](#41-create-service) instead.
:::

```java
String updateService(String serviceName, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(String groupName, String serviceName, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(String namespaceId, String groupName, String serviceName, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(String namespaceId, String groupName, String serviceName, boolean ephemeral, Map<String, String> newMetadata, float newProtectThreshold, Selector newSelector) throws NacosException;

String updateService(Service service) throws NacosException;
```

#### Request Parameters

| Parameter Name                                        | Parameter Type               | Description                |
|:-------------------------------------------|:-------------------|:------------------|
| serviceName(Service.serviceName)           | string             | Service name             |
| groupName(Service.groupName)               | string             | Service group name           |
| namespaceId(Service.namespaceId)           | string             | Namespace ID to which the service belongs       |
| ephemeral(Service.ephemeral)               | boolean            | Whether the service is ephemeral. The default value is `false`. |
| protectThreshold(Service.protectThreshold) | float              | Service protection threshold. The default value is `0.0`.  |
| Service.metadata                           | Map<String,String> | Service metadata            |
| Service.selector                           | Selector           | Service instance selector. The default value is none.  |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of service update. |

#### Request Example

```java
try {
    // The following requests all update the persistent service named `maintain.client.test`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.3. Delete Service

#### Description

Deletes a service. A service can be deleted only when it has no instances. If the service to delete does not exist, deletion success is also returned.

```java
String removeService(String serviceName) throws NacosException;

String removeService(String groupName, String serviceName) throws NacosException;

String removeService(String namespaceId, String groupName, String serviceName) throws NacosException;

String removeService(Service service) throws NacosException;
```

#### Request Parameters

| Parameter Name                              | Parameter Type   | Description          |
|:---------------------------------|:-------|:------------|
| serviceName(Service.serviceName) | string | Service name       |
| groupName(Service.groupName)     | string | Service group name     |
| namespaceId(Service.namespaceId) | string | Namespace ID to which the service belongs |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of service deletion. |

#### Request Example

```java
try {
    // The following requests all delete a service named `maintain.client.test`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.4. Query Service Details

#### Description

Queries service details, including service metadata, protection threshold, instance selector, and metadata of logical clusters `Cluster` under the service.

:::note
The service details returned by this API do not include the instance list under the service. They only include metadata and related information. To obtain the instance list and instance information under the service, use [Query Service instance List](#415-query-service-instance-list).
:::

```java
ServiceDetailInfo getServiceDetail(String serviceName) throws NacosException;

ServiceDetailInfo getServiceDetail(String groupName, String serviceName) throws NacosException;

ServiceDetailInfo getServiceDetail(String namespaceId, String groupName, String serviceName) throws NacosException;

ServiceDetailInfo getServiceDetail(Service service) throws NacosException;
```

#### Request Parameters

| Parameter Name                              | Parameter Type   | Description          |
|:---------------------------------|:-------|:------------|
| serviceName(Service.serviceName) | string | Service name       |
| groupName(Service.groupName)     | string | Service group name     |
| namespaceId(Service.namespaceId) | string | Namespace ID to which the service belongs |

#### Response Parameters

| Parameter Type              | Description      |
|:------------------|:--------|
| ServiceDetailInfo | Service details. |

The details in `ServiceDetailInfo` are as follows:

| Parameter Name                                       | Parameter Type                      | Description                                    |
|:------------------------------------------|:--------------------------|:--------------------------------------|
| namespaceId                               | string                    | Service namespace ID                             |
| groupName                                 | string                    | Service group name                               |
| serviceName                               | string                    | Service name                                 |
| ephemeral                                 | boolean                   | Service persistence attribute                              |
| protectThreshold                          | float                     | Service protection threshold                               |
| selector                                  | Selector                  | Service instance selector                              |
| metadata                                  | Map\<String,String>       | Service metadata                                |
| clusterMap                                | Map\<String, ClusterInfo> | Map of logical cluster information under the service. The key is the logical cluster name, and the value is detailed information. |
| clusterMap.${key}.clusterName             | string                    | Logical cluster name                               |
| clusterMap.${key}.healthyCheckPort        | int                       | Health check port of the logical cluster                           |
| clusterMap.${key}.useInstancePortForCheck | boolean                   | Whether the logical cluster uses the instance port for health checks                 |
| clusterMap.${key}.healthChecker           | AbstractHealthChecker     | Health check type of the logical cluster                           |
| clusterMap.${key}.metadata                | Map\<String,String>       | Logical cluster metadata                              |


#### Request Example

```java
try {
    // The following requests all obtain details of a service named `maintain.client.test`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.5. Query Service List

#### Description

Gets a service list that matches the conditions. The service list obtained through this API does not contain instance information. To obtain the instance list and instance information under services, use [Query Service instance List](#415-query-service-instance-list).

```java
Page<ServiceView> listServices(String namespaceId) throws NacosException;

Page<ServiceView> listServices(String namespaceId, String groupNameParam, String serviceNameParam) throws NacosException;

Page<ServiceView> listServices(String namespaceId, String groupNameParam, String serviceNameParam, boolean ignoreEmptyService, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name                | Parameter Type    | Description                                      |
|:-------------------|:--------|:----------------------------------------|
| namespaceId        | string  | Namespace ID to which the service belongs                             |
| groupNameParam     | string  | Service group name pattern. `*` can be used for prefix and suffix fuzzy matching. If empty, all groups are returned. |
| serviceNameParam   | string  | Service name pattern. `*` can be used for prefix and suffix fuzzy matching. If empty, all services are returned.   |
| ignoreEmptyService | boolean | Whether to ignore empty services. The default value is `true`. If true, empty services are not returned.       |
| pageNo             | int     | Page number. The default value is 1.                              |
| pageSize           | int     | Page size. The default value is 100.                          |

#### Response Parameters

| Parameter Type               | Description            |
|:-------------------|:--------------|
| Page\<ServiceView> | Paginated result of services that match the conditions. |

The specific `Page` and `ServiceView` content is as follows:

| Parameter Name            | Parameter Type                   | Description           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | Total number of services that match the condition. |
| pageNumber     | int                    | Current page number.        |
| pagesAvailable | int                    | Total number of pages.      |
| pageItems      | List\<ConfigBasicInfo> | Service list on the current page.    |

| Parameter Name                  | Parameter Type    | Description         |
|:---------------------|:--------|:-----------|
| name                 | string  | Service name      |
| groupName            | string  | Service group name    |
| clusterCount         | int     | Number of logical clusters under the service |
| ipCount              | int     | Total number of instances under the service   |
| healthyInstanceCount | int     | Total number of healthy instances under the service |
| triggerFlag          | boolean | Whether threshold protection is triggered  |

#### Request Example

```java
try {
    // The following requests all obtain the service list (up to the first 100 services).
    Page<ServiceView> result = namingMaintainService.listServices(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainService.listServices(Constants.DEFAULT_NAMESPACE_ID, "", "");
    result = namingMaintainService.listServices(Constants.DEFAULT_NAMESPACE_ID, "", "", true, 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.6. Query Service List with instance Information

#### Description

Gets a service list that matches the conditions. The service list obtained through this API includes instance information.

:::note
This API has poor performance and may return a large amount of data, causing high bandwidth and memory load. Use it with caution. We recommend using [Get Service List](#45-query-service-list) together with [Query Service instance List](#415-query-service-instance-list) to retrieve data as needed.
:::

```java
Page<ServiceDetailInfo> listServicesWithDetail(String namespaceId) throws NacosException;

Page<ServiceDetailInfo> listServicesWithDetail(String namespaceId, String groupNameParam, String serviceNameParam) throws NacosException;

Page<ServiceDetailInfo> listServicesWithDetail(String namespaceId, String groupNameParam, String serviceNameParam, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name          | Parameter Type   | Description                                                                                     |
|:-------------|:-------|:---------------------------------------------------------------------------------------|
| namespaceId        | string  | Namespace ID to which the service belongs                             |
| groupNameParam     | string  | Service group name pattern. `*` can be used for prefix and suffix fuzzy matching. If empty, all groups are returned. |
| serviceNameParam   | string  | Service name pattern. `*` can be used for prefix and suffix fuzzy matching. If empty, all services are returned.   |
| pageNo             | int     | Page number. The default value is 1.                              |
| pageSize           | int     | Page size. The default value is 100.                          |

#### Response Parameters

| Parameter Type                     | Description            |
|:-------------------------|:--------------|
| Page\<ServiceDetailInfo> | Paginated result of services that match the conditions. |

The specific `Page` and `ServiceDetailInfo` content is as follows:

| Parameter Name            | Parameter Type                   | Description           |
|:---------------|:-----------------------|:-------------|
| totalCount     | int                    | Total number of services that match the condition. |
| pageNumber     | int                    | Current page number.        |
| pagesAvailable | int                    | Total number of pages.      |
| pageItems      | List\<ConfigBasicInfo> | Service list on the current page.    |

| Parameter Name                                       | Parameter Type                      | Description                                    |
|:------------------------------------------|:--------------------------|:--------------------------------------|
| namespaceId                               | string                    | Service namespace ID                             |
| groupName                                 | string                    | Service group name                               |
| serviceName                               | string                    | Service name                                 |
| ephemeral                                 | boolean                   | Service persistence attribute                              |
| protectThreshold                          | float                     | Service protection threshold                               |
| selector                                  | Selector                  | Service instance selector                              |
| metadata                                  | Map\<String,String>       | Service metadata                                |
| clusterMap                                | Map\<String, ClusterInfo> | Map of logical cluster information under the service. The key is the logical cluster name, and the value is detailed information. |
| clusterMap.${key}.clusterName             | string                    | Logical cluster name                               |
| clusterMap.${key}.healthyCheckPort        | int                       | Health check port of the logical cluster                           |
| clusterMap.${key}.useInstancePortForCheck | boolean                   | Whether the logical cluster uses the instance port for health checks                 |
| clusterMap.${key}.healthChecker           | AbstractHealthChecker     | Health check type of the logical cluster                           |
| clusterMap.${key}.metadata                | Map\<String,String>       | Logical cluster metadata                              |

#### Request Example

```java
try {
    // The following requests all obtain the service list (up to the first 100 services).
    Page<ServiceDetailInfo> result = namingMaintainService.listServicesWithDetail(Constants.DEFAULT_NAMESPACE_ID);
    result = namingMaintainService.listServicesWithDetail(Constants.DEFAULT_NAMESPACE_ID, "", "");
    result = namingMaintainService.listServicesWithDetail(Constants.DEFAULT_NAMESPACE_ID, "", "", 1, 10);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.7. Query Service Subscriber List

#### Description

Queries the subscriber list of the specified service.

```java
Page<SubscriberInfo> getSubscribers(String serviceName) throws NacosException;

Page<SubscriberInfo> getSubscribers(String groupName, String serviceName) throws NacosException;

Page<SubscriberInfo> getSubscribers(String namespaceId, String groupName, String serviceName) throws NacosException;

Page<SubscriberInfo> getSubscribers(String namespaceId, String groupName, String serviceName, int pageNo, int pageSize) throws NacosException;

Page<SubscriberInfo> getSubscribers(String namespaceId, String groupName, String serviceName, int pageNo, int pageSize, boolean aggregation) throws NacosException;

Page<SubscriberInfo> getSubscribers(Service service, int pageNo, int pageSize, boolean aggregation) throws NacosException;
```

#### Request Parameters

| Parameter Name                              | Parameter Type    | Description                                                             |
|:---------------------------------|:--------|:---------------------------------------------------------------|
| serviceName(Service.serviceName) | string  | Service name                                                          |
| groupName(Service.groupName)     | string  | Service group name                                                        |
| namespaceId(Service.namespaceId) | string  | Namespace ID to which the service belongs                                                    |
| pageNo                           | int     | Page number. The default value is 1.                                                     |
| pageSize                         | int     | Page size. The default value is 100.                                                 |
| aggregation                      | boolean | Whether to perform an aggregated query. The default value is false. If false, only the subscriber list on the node that receives the request is queried. If true, the subscriber list in the entire cluster is queried. |

#### Response Parameters

| Parameter Type                  | Description         |
|:----------------------|:-----------|
| Page\<SubscriberInfo> | Paginated subscriber list result. |

#### Request Example

```java
try {
    // The following requests all obtain the subscriber list of service `maintain.client.test` (up to the first 100 subscribers).
    Page<SubscriberInfo> result = namingMaintainService.getSubscribers("maintain.client.test");
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_GROUP, "maintain.client.test");
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test");
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", 1, 100);
    result = namingMaintainService.getSubscribers(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", 1, 100, false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.8. Query Supported Service instance Selectors

#### Description

Use this API to obtain the supported service instance selector list. Only selector names are returned.

```java
List<String> listSelectorTypes() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type          | Description         |
|:--------------|:-----------|
| List\<String> | List of instance selector names. |

#### Request Example

```java
try {
    List<String> result = namingMaintainService.listSelectorTypes();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.9. Register Instance

#### Description

Registers an instance for a service through this API. The instance is registered as persistent by default.

:::note
If an ephemeral instance is registered through this API (`ephemeral` of the `Instance` object is true), the instance is automatically removed after a period of time. Because the Maintainer SDK is intended for maintainers or console applications to manage data, it does not renew instances through heartbeats.

To register ephemeral instances, we recommend using the instance registration API of `Nacos Client`, such as [Nacos Java Client](../user/java-sdk/usage.md) or [Nacos Go Client](../user/go-sdk/usage.md).
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

#### Request Parameters

| Parameter Name                               | Parameter Type                | Description                |
|:----------------------------------|:--------------------|:------------------|
| serviceName(Service.serviceName)  | string              | Service name             |
| groupName(Service.groupName)      | string              | Service group name           |
| namespaceId(Service.namespaceId)  | string              | Namespace ID to which the service belongs       |
| clusterName(Instance.clusterName) | string              | Logical cluster name to which the instance belongs       |
| ip(Instance.ip)                    | string              | instance IP address. Domain names are supported.      |
| port(Instance.port)               | int                 | instance port. Valid values are 0 to 65535. |
| Instance.ephemeral                | boolean             | instance persistence attribute          |
| Instance.weight                   | double              | instance weight             |
| Instance.healthy                  | boolean             | instance health status           |
| Instance.enabled                  | boolean             | instance online/offline status          |
| Instance.instanceId               | string              | instance ID             |
| Instance.metadata                 | Map\<String,String> | instance metadata          |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of instance registration. |

#### Request Example

```java
try {
    // The following requests all register an instance with IP `127.0.0.1` and port `8080` for service `maintain.client.test`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.10. Deregister Instance

#### Description

Deregisters an instance of a service through this API.

:::note
If the deregistered instance is ephemeral, success is returned but the instance is not deleted. This is because if an ephemeral instance is registered through `Nacos Client`, the corresponding `Nacos Client` periodically renews the instance. Even if the instance is deregistered, it is immediately re-registered by the `Nacos Client` that registered it.

To deregister an ephemeral instance that was registered by `Nacos Client`, we recommend using the instance deregistration API of `Nacos Client`, such as [Nacos Java Client](../user/java-sdk/usage.md) or [Nacos Go Client](../user/go-sdk/usage.md).
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

#### Request Parameters

| Parameter Name                               | Parameter Type    | Description                |
|:----------------------------------|:--------|:------------------|
| serviceName(Service.serviceName)  | string  | Service name             |
| groupName(Service.groupName)      | string  | Service group name           |
| namespaceId(Service.namespaceId)  | string  | Namespace ID to which the service belongs       |
| clusterName(Instance.clusterName) | string  | Logical cluster name to which the instance belongs       |
| ip(Instance.ip)                   | string  | instance IP address. Domain names are supported.      |
| port(Instance.port)               | int     | instance port. Valid values are 0 to 65535. |
| Instance.ephemeral                | boolean | instance persistence attribute          |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of instance deregistration. |

#### Request Example

```java
try {
    // The following requests all deregister an instance whose IP is `127.0.0.1` and port is `8080` from service `maintain.client.test`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.11. Update Instance

#### Description

Updates metadata of a service instance through this API, but the instance `service`, `IP address`, `port`, and `logical cluster` **cannot be modified**.

:::note
The instance metadata updated by this API, including weight, overwrites previously updated metadata. Pass complete information when using it to avoid losing other information while modifying only part of the data.

Metadata updated through this API has higher priority than metadata specified during instance registration and is remembered. It remains for a period of time after the corresponding instance is deleted. If the instance is re-registered during this period, the metadata still takes effect. You can modify the retention time through `nacos.naming.clean.expired-metadata.expired-time` and `nacos.naming.clean.expired-metadata.interval`.
:::

```java
String updateInstance(String serviceName, Instance instance) throws NacosException;

String updateInstance(String groupName, String serviceName, Instance instance) throws NacosException;

String updateInstance(String namespaceId, String groupName, String serviceName, Instance instance) throws NacosException;

String updateInstance(Service service, Instance instance) throws NacosException;
```

#### Request Parameters

| Parameter Name                              | Parameter Type                | Description                |
|:---------------------------------|:--------------------|:------------------|
| serviceName(Service.serviceName) | string              | Service name             |
| groupName(Service.groupName)     | string              | Service group name           |
| namespaceId(Service.namespaceId) | string              | Namespace ID to which the service belongs       |
| Instance.clusterName             | string              | Logical cluster name to which the instance belongs       |
| Instance.ip                      | string              | instance IP address. Domain names are supported.      |
| Instance.port                    | int                 | instance port. Valid values are 0 to 65535. |
| Instance.ephemeral               | boolean             | instance persistence attribute          |
| Instance.weight                  | double              | instance weight             |
| Instance.healthy                 | boolean             | instance health status           |
| Instance.enabled                 | boolean             | instance online/offline status          |
| Instance.instanceId              | string              | instance ID             |
| Instance.metadata                | Map\<String,String> | instance metadata          |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of instance update. |

#### Request Example

```java
try {
    Instance instance = new Instance();
    instance.setIp("127.0.0.1");
    instance.setPort(8080);
    instance.setEphemeral(false);
    instance.setEnabled(false);
    // The following requests all update an instance whose IP is `127.0.0.1` and port is `8080` under service `maintain.client.test`, and change the instance `enabled` value to `false`.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.12. Batch Update instance Metadata

#### Description

Updates metadata for some or all instances under the specified service in batches.

:::note
This API only supports updating `metadata`. It does not support updating attributes such as `weight`, `online/offline status`, or `health status`.
:::

```java
InstanceMetadataBatchResult batchUpdateInstanceMetadata(Service service, List<Instance> instances, Map<String, String> newMetadata) throws NacosException;
```

#### Request Parameters

| Parameter Name                 | Parameter Type                | Description                                          |
|:--------------------|:--------------------|:--------------------------------------------|
| Service.serviceName | string              | Service name                                       |
| Service.groupName   | string              | Service group name                                     |
| Service.namespaceId | string              | Namespace ID to which the service belongs                                 |
| instances           | List\<Instance>     | List of instances whose metadata needs to be updated. Only `ip`, `port`, and `clusterName` are required. |
| newMetadata         | Map\<String,String> | New metadata.                                     |

#### Response Parameters

| Parameter Type                        | Description         |
|:----------------------------|:-----------|
| InstanceMetadataBatchResult | instance metadata update result. |

The content of `InstanceMetadataBatchResult` is as follows:

| Parameter Name     | Parameter Type          | Description        |
|:--------|:--------------|:----------|
| updated | List\<String> | IDs of instances updated successfully. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.13. Batch Remove instance Metadata

#### Description

Removes metadata from some or all instances under the specified service in batches.

:::note
This API only supports removing `metadata`. It does not support updating attributes such as `weight`, `online/offline status`, or `health status`.
:::

```java
InstanceMetadataBatchResult batchDeleteInstanceMetadata(Service service, List<Instance> instances, Map<String, String> newMetadata) throws NacosException;
```

#### Request Parameters

| Parameter Name                 | Parameter Type                | Description                                          |
|:--------------------|:--------------------|:--------------------------------------------|
| Service.serviceName | string              | Service name                                       |
| Service.groupName   | string              | Service group name                                     |
| Service.namespaceId | string              | Namespace ID to which the service belongs                                 |
| instances           | List\<Instance>     | List of instances whose metadata needs to be updated. Only `ip`, `port`, and `clusterName` are required. |
| newMetadata         | Map\<String,String> | Metadata to remove.                                  |

#### Response Parameters

| Parameter Type                        | Description         |
|:----------------------------|:-----------|
| InstanceMetadataBatchResult | instance metadata update result. |

The content of `InstanceMetadataBatchResult` is as follows:

| Parameter Name     | Parameter Type          | Description        |
|:--------|:--------------|:----------|
| updated | List\<String> | IDs of instances removed successfully. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.14. Update Partial instance Metadata

#### Description

Updates part of instance metadata. Compared with the [Update Instance](#411-update-instance) API, only metadata passed in the request is updated. If a key in the instance metadata is not included in the request parameters, it is not updated.

> For example, if the current metadata is `k1=v1,k2=v2` and the API receives `k2=v3`, the metadata becomes `k1=v1,k2=v3`, not `k2=v3`.
>
> Note that some fields in the `Instance` object have default values, such as `weight`. Pass the corresponding values, otherwise the defaults may overwrite existing values.

```java
String partialUpdateInstance(Service service, Instance instance) throws NacosException;
```

#### Request Parameters

| Parameter Name                  | Parameter Type                | Description                |
|:---------------------|:--------------------|:------------------|
| Service.serviceName  | string              | Service name             |
| Service.groupName    | string              | Service group name           |
| Service.namespaceId  | string              | Namespace ID to which the service belongs       |
| Instance.clusterName | string              | Logical cluster name to which the instance belongs       |
| Instance.ip          | string              | instance IP address. Domain names are supported.      |
| Instance.port        | int                 | instance port. Valid values are 0 to 65535. |
| Instance.ephemeral   | boolean             | instance persistence attribute          |
| Instance.weight      | double              | instance weight             |
| Instance.healthy     | boolean             | instance health status           |
| Instance.enabled     | boolean             | instance online/offline status          |
| Instance.metadata    | Map\<String,String> | instance metadata          |

#### Response Parameters

| Parameter Type   | Description        |
|:-------|:----------|
| String | Result description of instance update. |

#### Request Example

```java
try {

} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.15. Query Service instance List

#### Description

Queries all instances that match the conditions under the specified service.

```java
List<Instance> listInstances(String serviceName, String clusterName, boolean healthyOnly) throws NacosException;

List<Instance> listInstances(String groupName, String serviceName, String clusterName, boolean healthyOnly) throws NacosException;

List<Instance> listInstances(String namespaceId, String groupName, String serviceName, String clusterName, boolean healthyOnly) throws NacosException;

List<Instance> listInstances(Service service, String clusterName, boolean healthyOnly) throws NacosException;
```

#### Request Parameters

| Parameter Name                              | Parameter Type    | Description                                               |
|:---------------------------------|:--------|:-------------------------------------------------|
| serviceName(Service.serviceName) | string  | Service name                                            |
| groupName(Service.groupName)     | string  | Service group name                                          |
| namespaceId(Service.namespaceId) | string  | Namespace ID to which the service belongs                                      |
| clusterName                      | string  | Logical cluster name to which the instance belongs. If empty, instances in all logical clusters are returned. To query multiple logical clusters, separate them with commas `,`. |
| healthyOnly                      | boolean | Whether to return only healthy instances.                                       |

#### Response Parameters

| Parameter Type            | Description     |
|:----------------|:-------|
| List\<Instance> | instance information list. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.16. Query Details of a Specified Service Instance

#### Description

Queries details of the specified service instance, mainly including metadata and other additional information such as weight.

```java
Instance getInstanceDetail(String serviceName, String ip, int port) throws NacosException;

Instance getInstanceDetail(String groupName, String serviceName, String ip, int port) throws NacosException;

Instance getInstanceDetail(String namespaceId, String groupName, String serviceName, String ip, int port) throws NacosException;

Instance getInstanceDetail(String serviceName, String ip, int port, String clusterName) throws NacosException;

Instance getInstanceDetail(String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

Instance getInstanceDetail(String namespaceId, String groupName, String serviceName, String ip, int port, String clusterName) throws NacosException;

Instance getInstanceDetail(Service service, Instance instance) throws NacosException;
```

#### Request Parameters

| Parameter Name                               | Parameter Type   | Description                |
|:----------------------------------|:-------|:------------------|
| serviceName(Service.serviceName)  | string | Service name             |
| groupName(Service.groupName)      | string | Service group name           |
| namespaceId(Service.namespaceId)  | string | Namespace ID to which the service belongs       |
| clusterName(Instance.clusterName) | string | Logical cluster name to which the instance belongs       |
| ip(Instance.ip)                   | string | instance IP address. Domain names are supported.      |
| port(Instance.port)               | int    | instance port. Valid values are 0 to 65535. |

#### Response Parameters

| Parameter Type                   | Description        |
|:-----------------------|:----------|

#### Request Example

```java
try {
    instance result = namingMaintainService.getInstanceDetail("maintain.client.test", "127.0.0.1", 8080);
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.17. Query Service Registry Statistics

#### Description

Queries service registry statistics, mainly including availability status, instance count, service count, and other information.

```java
MetricsInfo getMetrics(boolean onlyStatus) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type    | Description         |
|:-----------|:--------|:-----------|
| onlyStatus | boolean | Whether to query only availability status. |

#### Response Parameters

| Parameter Type        | Description        |
|:------------|:----------|
| MetricsInfo | Service registry statistics. |

The content of `MetricsInfo` is as follows:

| Parameter Name                         | Parameter Type   | Description                                                                                                                                                    |
|:----------------------------|:-------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| status                      | string | Availability status of the service registry, such as `UP`.                                                                                                                                      |
| serviceCount                | int    | Total number of services.                                                                                                                                                 |
| instanceCount               | int    | Total number of service instances.                                                                                                                                               |
| subscribeCount              | int    | Total number of service subscribers.                                                                                                                                              |
| clientCount                 | int    | Total number of client connections.                                                                                                                                              |
| connectionBasedClientCount  | int    | Total number of connection-based clients, corresponding to clients with SDK version later than 2.0.                                                                                                                     |
| ephemeralIpPortClientCount  | int    | Total number of IP-port-based ephemeral clients, corresponding to clients with SDK versions earlier than 2.0, including ephemeral clients registered through HTTP OpenAPI and maintainer APIs.                                                                                 |
| persistentIpPortClientCount | int    | Total number of IP-port-based persistent clients, corresponding to clients of persistent instances.                                                                                                                       |
| responsibleClientCount      | int    | Total number of clients maintained by this Nacos Server node, including `connectionBasedClientCount` directly connected to this node and `ephemeralIpPortClientCount` and `persistentIpPortClientCount` that the Distro protocol considers this node responsible for. |

#### Request Example

```java
try {
    MetricsInfo metricsInfo = namingMaintainService.getMetrics(false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.18. Set Service Registry Log Level

#### Description

Sets log levels for service registry related modules.

```java
String setLogLevel(String logName, String logLevel) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type     | Description                                        |
|:-----------|:---------|:------------------------------------------|
| :--------- | :------- | :---------------------------------------- |
| logName    | string   | Log module name, such as `naming-server` or `naming-event`.  |
| logLevel   | string   | Log level, such as `INFO` or `DEBUG`.                     |

#### Response Parameters

| Parameter Type   | Description          |
|:-------|:------------|
| String | Result information of setting the log level. |

#### Request Example

```java
try {
    String result = namingMaintainService.setLogLevel("naming-server", "DEBUG");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.19. Update Persistent instance Health Status

#### Description

Updates persistent instance health status.

:::note
This API is for persistent instances that do not need automatic detection and whose health status must be manually modified by an administrator. Therefore, this API takes effect only when the following conditions are met:
1. The instance must be persistent;
2. The health checker of the cluster to which the instance belongs must be configured as `NONE`.

To modify the cluster health checker, see [Update Logical Cluster Metadata](#420-update-logical-cluster-metadata).
:::

```java
String updateInstanceHealthStatus(Service service, Instance instance) throws NacosException;
```

#### Request Parameters

| Parameter Name                               | Parameter Type    | Description                |
|:----------------------------------|:--------|:------------------|
| serviceName(Service.serviceName)  | string  | Service name             |
| groupName(Service.groupName)      | string  | Service group name           |
| namespaceId(Service.namespaceId)  | string  | Namespace ID to which the service belongs       |
| clusterName(Instance.clusterName) | string  | Logical cluster name to which the instance belongs       |
| ip(Instance.ip)                   | string  | instance IP address. Domain names are supported.      |
| port(Instance.port)               | int     | instance port. Valid values are 0 to 65535. |
| healthy(Instance.healthy)         | boolean | Target health status of the instance.         |

#### Response Parameters

| Parameter Type   | Description         |
|:-------|:-----------|
| String | Result description of health status update. |


#### Request Example

```java
try {
    // Updates the health status of instance `127.0.0.1:8080` under `maintain.client.test` to false.
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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.20. Query Supported Health Check Types

#### Description

Queries supported health check types through this API.

```java
Map<String, AbstractHealthChecker> getHealthCheckers() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type                                | Description                                         |
|:------------------------------------|:-------------------------------------------|
| Map\<String, AbstractHealthChecker> | Map of supported health check methods. The key is the type, and the value is the corresponding config content of the specific health checker. |

#### Request Example

```java
try {
    Map<String, AbstractHealthChecker> result = namingMaintainService.getHealthCheckers();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.21. Update Logical Cluster Metadata

#### Description

Updates metadata of the specified logical cluster under the specified service.

```java
String updateCluster(Service service, ClusterInfo cluster) throws NacosException;
```

#### Request Parameters

| Parameter Name                                 | Parameter Type               | Description                                                  |
|:------------------------------------|:-------------------|:----------------------------------------------------|
| Service.serviceName                 | string             | Service name                                               |
| Service.groupName                   | string             | Service group name                                             |
| Service.namespaceId                 | string             | Namespace ID to which the service belongs                                         |
| ClusterInfo.clusterName             | string             | Logical cluster name                                             |
| ClusterInfo.healthChecker           | string             | Health check type of the logical cluster, Obtain it through [Query Supported Health Check Types](#420-query-supported-health-check-types).     |
| ClusterInfo.healthyCheckPort        | string             | Health check port.                                             |
| ClusterInfo.useInstancePortForCheck | string             | Whether to use the port registered by the instance for health checks. If true, the port set by `healthyCheckPort` is ignored. |
| ClusterInfo.metadata                | Map<String,String> | Metadata of the cluster to which the instance belongs.                                          |

#### Response Parameters

| Parameter Type                   | Description        |
|:-----------------------|:----------|

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.22. Query Service Client List

#### Description

Gets the list of all clients that register or subscribe to services in the service registry.

```java
List<String> getClientList() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type          | Description             |
|:--------------|:---------------|
| List\<String> | Client ID list. |

#### Request Example

```java
try {
    List<String> result = namingMaintainService.getClientList();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.23. Query Service Client Details

#### Description

Queries detailed information about a service client. The returned content may vary for clients of different versions.

```java
ClientSummaryInfo getClientDetail(String clientId) throws NacosException;
```

#### Request Parameters

| Parameter Name      | Parameter Type   | Description                                               |
|:---------|:-------|:-------------------------------------------------|
| clientId | string | Client ID. You can obtain it from logs or [Query Service Client List](#422-query-service-client-list). |

#### Response Parameters

| Parameter Type              | Description      |
|:------------------|:--------|
| ClientSummaryInfo | Client summary information. |

The content of `ClientSummaryInfo` is as follows:

| Parameter Name             | Parameter Type    | Description                                                                                  |
|:----------------|:--------|:------------------------------------------------------------------------------------|
| clientId        | string  | Client ID.                                                                               |
| ephemeral       | boolean | Whether this is a persistent service client.                                                                        |
| lastUpdatedTime | long    | Timestamp when the client was last updated, such as registration or deregistration.                                                              |
| clientType      | string  | Client type. `ipPort` corresponds to 1.x clients or HTTP OpenAPI access, and `connection` corresponds to 2.x or later clients or gRPC OpenAPI access. |
| connectType     | string  | When `clientType` is `connection`, this field indicates the client connection type. The current value is `grpc`.                                |
| appName         | string  | Client application name. It must be added to connection metadata when the client connects. The default value is `unknown`.                                           |
| version         | string  | Client version, such as `Nacos-Java-Client:v3.0.0`.                                                  |
| clientIp        | string  | Client IP address. In proxy registration scenarios such as Nacos-Sync, this IP address may differ from the IP address of the service instance registered by this client.                     |
| clientPort      | int     | Client port address, indicating the remote port of this connection.                                                      |

#### Request Example

```java
try {
    ClientSummaryInfo result = namingMaintainService.getClientDetail("127.0.0.1:8080#true");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.24. Query Services Registered by a Specified Service Client

#### Description

Queries the list of services registered by the specified service client.

```java
List<ClientServiceInfo> getPublishedServiceList(String clientId) throws NacosException;
```

#### Request Parameters

| Parameter Name      | Parameter Type   | Description                                               |
|:---------|:-------|:-------------------------------------------------|
| clientId | string | Client ID. You can obtain it from logs or [Query Service Client List](#422-query-service-client-list). |

#### Response Parameters

| Parameter Type                     | Description            |
|:-------------------------|:--------------|
| List\<ClientServiceInfo> | Information about services registered by the client. |

The ClientServiceInfo content is as follows:

| Parameter Name                       | Parameter Type                | Description               |
|:--------------------------|:--------------------|:-----------------|
| namespaceId               | string              | Namespace ID to which the service belongs. |
| groupName                 | string              | Service group name          |
| serviceName               | string              | Service name            |
| publisherInfo             | ClientPublisherInfo | Information about service instances registered by the client.    |
| publisherInfo.ip          | string              | instance IP address.            |
| publisherInfo.port        | string              | instance port.            |
| publisherInfo.clusterName | string              | instance logical cluster name.        |

#### Request Example

```java
try {
    List<ClientServiceInfo> result = namingMaintainService.getPublishedServiceList("127.0.0.1:8080#true");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.25. Query Services Subscribed to by a Specified Service Client

#### Description

Queries the list of services subscribed to by the specified service client.

```java
List<ClientServiceInfo> getSubscribeServiceList(String clientId) throws NacosException;
```

#### Request Parameters

| Parameter Name          | Parameter Type   | Description                                                                                     |
|:-------------|:-------|:---------------------------------------------------------------------------------------|
| clientId | string | Client ID. You can obtain it from logs or [Query Service Client List](#422-query-service-client-list). |

#### Response Parameters

| Parameter Type                     | Description            |
|:-------------------------|:--------------|
| List\<ClientServiceInfo> | Information about services subscribed to by the client. |

The ClientServiceInfo content is as follows:

| Parameter Name                    | Parameter Type                 | Description                     |
|:-----------------------|:---------------------|:-----------------------|
| namespaceId            | string               | Namespace ID to which the service belongs.       |
| groupName              | string               | Service group name                |
| serviceName            | string               | Service name                  |
| subscriberInfo         | ClientSubscriberInfo | Client subscriber information.              |
| subscriberInfo.appName | string               | Application name to which the subscriber belongs. The default value is `unknown`. |
| subscriberInfo.agent   | string               | Subscriber client version.              |
| subscriberInfo.address | string               | Subscriber address in `IP:PORT` format.   |

#### Request Example

```java
try {
    List<ClientServiceInfo> result = namingMaintainService.getSubscribeServiceList("127.0.0.1:8080#true");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.26. Query Service Clients That Registered a Specified Service

#### Description

Queries which clients registered the specified service.

```java
List<ClientPublisherInfo> getPublishedClientList(String namespaceId, String groupName, String serviceName, String ip, Integer port) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                    |
|:------------|:-------|:----------------------|
| namespaceId | string | Namespace ID to which the service belongs.      |
| groupName   | string | Service group name               |
| serviceName | string | Service name                 |
| ip          | string | IP address of the service instance. If empty, all service instances are matched. |
| port        | int    | Service instance port. If empty, all service instances are matched. |

#### Response Parameters

| Parameter Type                       | Description           |
|:---------------------------|:-------------|
| List\<ClientPublisherInfo> | Information about clients that registered service instances. |

The ClientPublisherInfo content is as follows:

| Parameter Name         | Parameter Type   | Description           |
|:------------|:-------|:-------------|
| clientId    | string | ID of the client that registered the service.   |
| ip          | string | Registered instance IP address.     |
| port        | string | Registered instance port.     |
| clusterName | string | Registered instance logical cluster name. |

#### Request Example

```java
try {
    List<ClientPublisherInfo> result = namingMaintainService.getPublishedClientList(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 4.27. Query Service Clients That Subscribed to a Specified Service

#### Description

Queries which clients subscribed to the specified service.

```java
List<ClientSubscriberInfo> getSubscribeClientList(String namespaceId, String groupName, String serviceName, String ip, Integer port) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                    |
|:------------|:-------|:----------------------|
| namespaceId | string | Namespace ID to which the service belongs.      |
| groupName   | string | Service group name               |
| serviceName | string | Service name                 |
| ip          | string | IP address of the service subscriber. If empty, all subscribers are matched. |
| port        | int    | Port of the service subscriber. If empty, all subscribers are matched. |

#### Response Parameters

| Parameter Type                        | Description         |
|:----------------------------|:-----------|
| List\<ClientSubscriberInfo> | Information about clients that subscribed to the service. |

The ClientSubscriberInfo content is as follows:

| Parameter Name      | Parameter Type   | Description                     |
|:---------|:-------|:-----------------------|
| clientId | string | ID of the client that subscribed to the service.             |
| appName  | string | Application name to which the subscriber belongs. The default value is `unknown`. |
| agent    | string | Subscriber client version.              |
| address  | string | Subscriber address in `IP:PORT` format.   |

#### Request Example

```java
try {
    List<ClientSubscriberInfo> result = namingMaintainService.getSubscribeClientList(Constants.DEFAULT_NAMESPACE_ID, Constants.DEFAULT_GROUP, "maintain.client.test", "", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

## 5. Other Nacos Core Maintainer APIs

Nacos core maintainer APIs can be called through `NacosNamingMaintainerService` or `NacosConfigMaintainerService`.

### 5.1. Query Nacos Server Status Information

#### Description

Queries Nacos Server status information, including `version`, `running mode`, `authentication enabled`, and `running modules`.

```java
Map<String, String> getServerState() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type                 | Description                 |
|:---------------------|:-------------------|
| Map\<String, String> | Nacos Server status information. |

#### Request Example

```java
try {
    Map<String,String> result = namingMaintainService.getServerState();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.2. Get Nacos Server Liveness Status

#### Description

Gets the liveness status of Nacos Server.

```java
Boolean liveness() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type    | Description                       |
|:--------|:-------------------------|
| boolean | `true` means live, and `false` means there is a problem. |

#### Request Example

```java
try {
    boolean result = namingMaintainService.liveness();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.3. Get Nacos Server Readiness Status

#### Description

Gets the readiness status of Nacos Server.

```java
Boolean readiness() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type    | Description                      |
|:--------|:------------------------|
| boolean | `true` means ready, and `false` means not ready. |

#### Request Example

```java
try {
    boolean result = namingMaintainService.readiness();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.4. Nacos Raft Operations

#### Description

Use this API to perform maintenance operations on the Raft protocol in Nacos Server, such as `re-elect leader` and `take snapshot`.

```java
String raftOps(String command, String value, String groupId) throws NacosException;
```

#### Request Parameters

| Parameter Name     | Parameter Type   | Description                                                                  |
|:--------|:-------|:--------------------------------------------------------------------|
| command | string | Raft operation command. See `com.alibaba.nacos.core.distributed.raft.utils.JRaftOps`. |
| value   | string | Target value of the Raft operation.                                                         |
| groupId | string | Target Raft group of the operation. If empty, all Raft groups are operated on.                            |

#### Response Parameters

| Parameter Type   | Description   |
|:-------|:-----|
| String | Operation result. |

#### Request Example

```java
try {
    String result = namingMaintainService.raftOps("doSnapshot", "172.0.0.1:7848", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.5. Query Distributed ID Generators Supported by Nacos Server

#### Description

Queries the list of distributed ID generators supported by Nacos Server, such as the Snowflake ID generator.

```java
List<IdGeneratorInfo> getIdGenerators() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type                   | Description        |
|:-----------------------|:----------|
| List\<IdGeneratorInfo> | ID generator information list. |

#### Request Example

```java
try {
    List<IdGeneratorInfo> result = namingMaintainService.getIdGenerators();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.6. Update Core Module Log Level

#### Description

Updates the log level of core modules.

```java
void updateLogLevel(String logName, String logLevel) throws NacosException;
```

#### Request Parameters

| Parameter Name      | Parameter Type   | Description                    |
|:---------|:-------|:----------------------|
| logName  | string | Log module name, such as `core-auth`.  |
| logLevel | string | Log level, such as `INFO` or `DEBUG`. |

#### Response Parameters

None

#### Request Example

```java
try {
    namingMaintainService.updateLogLevel("core-auth", "INFO");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.7. Query Nacos Server Node List

#### Description

Queries the Nacos Server node list.

```java
Collection<NacosMember> listClusterNodes(String address, String state) throws NacosException;
```

#### Request Parameters

| Parameter Name     | Parameter Type   | Description                                               |
|:--------|:-------|:-------------------------------------------------|
| address | string | Server node address. The default value is `""`. If empty, all nodes are returned. If not empty, nodes that match the prefix are returned.      |
| state   | string | Server node status, such as `UP`. The default value is `""`. If empty, all nodes are returned. If not empty, nodes that match this status are returned. |

#### Response Parameters

| Parameter Type                     | Description               |
|:-------------------------|:-----------------|
| Collection\<NacosMember> | Nacos Server node list. |

The fields of `NacosMember` are described as follows:

| Parameter Name        | Parameter Type                | Description                       |
|:-----------|:--------------------|:-------------------------|
| ip         | string              | Server node IP address.              |
| port       | int                 | Server node main port.             |
| state      | NodeState           | Server node running status.            |
| extendInfo | Map<String, Object> | Server node extension data, such as Raft-related information. |

#### Request Example

```java
try {
    Collection<NacosMember> result = namingMaintainService.namingMaintainService("", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.8. Update Nacos Server Address Discovery Mode

#### Description

Nacos Server address discovery mode controls how Nacos Server discovers addresses of other nodes in the same cluster. It is used to form a Nacos cluster during server startup and runtime.

Use this API to dynamically modify the Nacos Server address discovery mode and form a Nacos cluster in different ways.

```java
Boolean updateLookupMode(String type) throws NacosException;
```

#### Request Parameters

| Parameter Name  | Parameter Type   | Description                             |
|:-----|:-------|:-------------------------------|
| type | string | Address discovery mode type. `file` and `address` are supported by default. |

#### Response Parameters

| Parameter Type    | Description           |
|:--------|:-------------|
| boolean | `true` means the update succeeds. |

#### Request Example

```java
try {

} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.9. Query Long Connection List of the Current Nacos Server Node

#### Description

Queries the long connection list connected to the current Nacos Server node.

```java
Map<String, ConnectionInfo> getCurrentClients() throws NacosException;
```

#### Request Parameters

None
#### Response Parameters

| Parameter Type                         | Description                           |
|:-----------------------------|:-----------------------------|
| Map\<String, ConnectionInfo> | Long connection list. The key is the connection ID, and the value is the connection details. |

#### Request Example

```java
try {
    Map<String, ConnectionInfo> result = namingMaintainService.getCurrentClients();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.10. Balance Long Connection Load of Nacos Server Nodes

#### Description

Nacos Server node long connection load balancing controls long connection load on Nacos Server nodes and evenly distributes long connections among nodes.

```java
String reloadConnectionCount(Integer count, String redirectAddress) throws NacosException;
```

#### Request Parameters

| Parameter Name             | Parameter Type   | Description                     |
|:----------------|:-------|:-----------------------|
| count           | int    | Expected number of long connections to retain.             |
| redirectAddress | string | Expected redirect address. The default value is empty. If empty, load is randomly balanced. |

#### Response Parameters

| Parameter Type   | Description      |
|:-------|:--------|
| String | Connection balancing result. |

#### Request Example

```java
try {
    String result = namingMaintainService.reloadConnectionCount(10, "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.11. Automatically Balance Long Connection Load of Nacos Server Nodes

#### Description

Allows Nacos Server to automatically balance load among servers based on the number of long connections.

```java
String smartReloadCluster(String loaderFactorStr) throws NacosException;
```

#### Request Parameters

| Parameter Name             | Parameter Type   | Description                                                       |
|:----------------|:-------|:---------------------------------------------------------|
| loaderFactorStr | string | Variance ratio for automatic load balancing. The default value is `0.1f`, which means the difference between the maximum and minimum number of connections among cluster nodes is within 10% during automatic load balancing. |

#### Response Parameters

| Parameter Type   | Description      |
|:-------|:--------|
| String | Connection balancing result. |

#### Request Example

```java
try {
    String result = namingMaintainService.smartReloadCluster("0.1f");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.12. Reload a Specified Nacos Client Connection

#### Description

Reloads a specified Nacos client connection.

```java
String reloadSingleClient(String connectionId, String redirectAddress) throws NacosException;
```

#### Request Parameters

| Parameter Name             | Parameter Type   | Description                     |
|:----------------|:-------|:-----------------------|
| connectionId    | string | Connection ID.                   |
| redirectAddress | string | Expected redirect address. The default value is empty. If empty, load is randomly balanced. |

#### Response Parameters

| Parameter Type   | Description      |
|:-------|:--------|
| String | Connection balancing result. |

#### Request Example

```java
try {
    String result = namingMaintainService.reloadSingleClient("111111111_127.0.0.1_10000");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.13. Query Nacos Server Long Connection Load Statistics

#### Description

Queries Nacos Server long connection load statistics.

```java
ServerLoaderMetrics getClusterLoaderMetrics() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type                | Description        |
|:--------------------|:----------|
| ServerLoaderMetrics | Long connection load statistics. |

#### Request Example

```java
try {
    ServerLoaderMetrics result = namingMaintainService.getClusterLoaderMetrics();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.14. Query Namespace List

#### Description

Queries the namespace list.

```java
List<Namespace> getNamespaceList() throws NacosException;
```

#### Request Parameters

None

#### Response Parameters

| Parameter Type             | Description     |
|:-----------------|:-------|
| List\<Namespace> | Namespace list. |

The attributes of `Namespace` are as follows:

| Parameter Name               | Parameter Type   | Description                                          |
|:------------------|:-------|:--------------------------------------------|
| namespace         | string | namespace ID                                      |
| namespaceShowName | string | Namespace name.                                     |
| namespaceDesc     | string | Namespace description.                                     |
| quota             | int    | Config count quota under the namespace. It takes effect only when used with config center capacity management. The default value is 200. |
| configCount       | int    | Number of configs under the namespace.                                  |
| type              | int    | Namespace type. This is a reserved field and is currently always 1.                          |

#### Request Example

```java
try {
    List<Namespace> result = namingMaintainService.getNamespaceList();
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.15. Query Specified Namespace

#### Description

Queries the specified namespace.

```java
Namespace getNamespace(String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description     |
|:------------|:-------|:-------|
| namespaceId | string | Namespace ID |

#### Response Parameters

| Parameter Type      | Description      |
|:----------|:--------|
| Namespace | Namespace details. |

The attributes of `Namespace` are as follows:

| Parameter Name               | Parameter Type   | Description                                          |
|:------------------|:-------|:--------------------------------------------|
| namespace         | string | namespace ID                                      |
| namespaceShowName | string | Namespace name.                                     |
| namespaceDesc     | string | Namespace description.                                     |
| quota             | int    | Config count quota under the namespace. It takes effect only when used with config center capacity management. The default value is 200. |
| configCount       | int    | Number of configs under the namespace.                                  |
| type              | int    | Namespace type. This is a reserved field and is currently always 1.                          |

#### Request Example

```java
try {
    Namespace result = namingMaintainService.getNamespace("public");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.16. Create Namespace

#### Description

Creates a namespace.

```java
Boolean createNamespace(String namespaceName, String namespaceDesc) throws NacosException;

Boolean createNamespace(String namespaceId, String namespaceName, String namespaceDesc) throws NacosException;
```

#### Request Parameters

| Parameter Name           | Parameter Type   | Description                                            |
|:--------------|:-------|:----------------------------------------------|
| namespaceName | string | Namespace name.                                       |
| namespaceDesc | string | Namespace description.                                       |
| namespaceId   | string | Custom namespace ID. The default value is `""`. If empty, Nacos automatically generates a UUID as the namespace ID. |

#### Response Parameters

| Parameter Type    | Description        |
|:--------|:----------|
| boolean | Namespace creation result. |

#### Request Example

```java
try {
    boolean result = namingMaintainService.createNamespace("test", "test");
    result = namingMaintainService.createNamespace("test", "test", "test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.17. Update Namespace

#### Description

Updates the specified namespace name or description.

```java
Boolean updateNamespace(String namespaceId, String namespaceName, String namespaceDesc) throws NacosException;
```

#### Request Parameters

| Parameter Name           | Parameter Type   | Description           |
|:--------------|:-------|:-------------|
| namespaceId   | string | Namespace ID to update. |
| namespaceName | string | Updated namespace name.  |
| namespaceDesc | string | Updated namespace description.  |

#### Response Parameters

| Parameter Type    | Description        |
|:--------|:----------|
| boolean | Namespace update result. |

#### Request Example

```java
try {
    boolean result = namingMaintainService.updateNamespace("test", "testNamespaceName", "testNamespaceDesc");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.18. Delete Namespace

#### Description

Deletes the specified namespace.

```java
Boolean deleteNamespace(String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description         |
|:------------|:-------|:-----------|
| namespaceId | string | Namespace ID to delete. |

#### Response Parameters

| Parameter Type    | Description        |
|:--------|:----------|
| boolean | Namespace deletion result. |

#### Request Example

```java
try {
    boolean result = namingMaintainService.deleteNamespace("test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.19. Check Whether a Namespace Exists

#### Description

Checks whether a namespace exists.

```java
Boolean checkNamespaceIdExist(String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description         |
|:------------|:-------|:-----------|
| namespaceId | string | Namespace ID to check. |

#### Response Parameters

| Parameter Type    | Description                           |
|:--------|:-----------------------------|
| boolean | Namespace check result. `true` indicates that the namespace ID already exists. |

#### Request Example

```java
try {
    boolean result = namingMaintainService.checkNamespaceIdExist("test");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 5.20. Query Plugin List

#### Description

List unified plugins loaded by Nacos, optionally filtered by type. Returned identities use `pluginType:pluginName` and include state, critical, executionMode, configurable, and related metadata.

```java
List<Map<String, Object>> listPlugins(String pluginType) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type   | Description                                       |
|:-----------|:-------|:-----------------------------------------|
| pluginType | string | Plugin type filter, such as `auth` or `control`. Pass null or an empty value to return all plugins. |

#### Response Parameters

| Parameter Type                      | Description           |
|:--------------------------|:-------------|
| List\<Map\<String, Object>> | Plugin information list.     |

#### Request Example

```java
try {
    List<Map<String, Object>> plugins = coreMaintainerService.listPlugins(null);
    List<Map<String, Object>> authPlugins = coreMaintainerService.listPlugins("auth");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.


### 5.21. Query Plugin Details

#### Description

Get plugin detail by type and name, including definitions, masked effective configuration, and per-item source/overridden metadata.

```java
Map<String, Object> getPluginDetail(String pluginType, String pluginName) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type   | Description     |
|:-----------|:-------|:-------|
| pluginType | string | Plugin type.  |
| pluginName | string | Plugin name.  |

#### Response Parameters

| Parameter Type                   | Description       |
|:-----------------------|:---------|
| Map\<String, Object>   | Plugin detail information. |

#### Request Example

```java
try {
    Map<String, Object> detail = coreMaintainerService.getPluginDetail("auth", "ldap");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 5.22. Update Plugin Status

#### Description

Enable or disable a plugin. Exclusive selection, PRE_CONTEXT implementations, and active critical providers cannot be changed illegally at runtime. `localOnly=true` affects this node only and overrides persisted state.

```java
void updatePluginStatus(String pluginType, String pluginName, boolean enabled) throws NacosException;

void updatePluginStatus(String pluginType, String pluginName, boolean enabled, boolean localOnly) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type    | Description        |
|:-----------|:--------|:----------|
| pluginType | string  | Plugin type.     |
| pluginName | string  | Plugin name.     |
| enabled    | boolean | Whether to enable the plugin. `true` enables it, and `false` disables it. |
| localOnly  | boolean | Whether to apply only to the current node. |

#### Response Parameters

None (void).

#### Request Example

```java
try {
    coreMaintainerService.updatePluginStatus("auth", "ldap", false);
    coreMaintainerService.updatePluginStatus("auth", "ldap", false, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 5.23. Update Plugin Config

#### Description

Replace the complete configuration map for the target source. Only definitions with `effectMode=RUNTIME` can be changed. Adding, changing, or removing a `RESTART` item is rejected. `localOnly=true` writes higher-priority `LOCAL_ONLY`; otherwise the method writes `RUNTIME_PERSISTED`.

```java
void updatePluginConfig(String pluginType, String pluginName, Map<String, String> config) throws NacosException;

void updatePluginConfig(String pluginType, String pluginName, Map<String, String> config, boolean localOnly) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type                | Description     |
|:-----------|:--------------------|:-------|
| pluginType | string              | Plugin type.  |
| pluginName | string              | Plugin name.  |
| config     | Map\<String, String> | Complete target-source map keyed by definition item key. |
| localOnly  | boolean             | Whether to apply only to the current node. |

#### Response Parameters

None (void).

#### Request Example

```java
try {
    Map<String, String> config = new HashMap<>();
    config.put("connect-timeout", "6000");
    coreMaintainerService.updatePluginConfig("auth", "ldap", config);
    coreMaintainerService.updatePluginConfig("auth", "ldap", config, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 5.24. Query Plugin Availability

#### Description

Get plugin availability across cluster nodes.

```java
Map<String, Boolean> getPluginAvailability(String pluginType, String pluginName) throws NacosException;
```

#### Request Parameters

| Parameter Name        | Parameter Type   | Description     |
|:-----------|:-------|:-------|
| pluginType | string | Plugin type.  |
| pluginName | string | Plugin name.  |

#### Response Parameters

| Parameter Type                   | Description                     |
|:-----------------------|:-----------------------|
| Map\<String, Boolean>  | Mapping from node address to availability.           |

#### Request Example

```java
try {
    Map<String, Boolean> availability = coreMaintainerService.getPluginAvailability("auth", "ldap");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

## 6. MCP Services

### 6.1. Get MCP Service List

#### Description

Gets the MCP service list by exact `mcpName`. If `mcpName` is empty, all MCP services are returned.

```java
Page<McpServerBasicInfo> listMcpServer() throws NacosException;

Page<McpServerBasicInfo> listMcpServer(int pageNo, int pageSize) throws NacosException;

Page<McpServerBasicInfo> listMcpServer(String mcpName, int pageNo, int pageSize) throws NacosException;

Page<McpServerBasicInfo> listMcpServer(String namespaceId, String mcpName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                     |
|:------------|:-------|:---------------------------------------|
| pageNo      | int    | Page number of the MCP service list. The default value is 1.                     |
| pageSize    | int    | Page size of MCP services. The default value is 100.                     |
| mcpName     | String | Exact MCP service name. If `mcpName` is empty, all MCP services are returned. |
| namespaceId | String | Namespace ID to which the MCP service belongs. The default value is `public`.           |

#### Response Parameters

| Parameter Type                      | Description           |
|:--------------------------|:-------------|
| Page\<McpServerBasicInfo> | Paginated MCP service list result. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.2. Search MCP Service List

#### Description

Searches the MCP service list by fuzzy `mcpName`. If `mcpName` is empty, all MCP services are returned.

```java
Page<McpServerBasicInfo> searchMcpServer(String mcpName) throws NacosException;

Page<McpServerBasicInfo> searchMcpServer(String mcpName, int pageNo, int pageSize) throws NacosException;

Page<McpServerBasicInfo> searchMcpServer(String namespaceId, String mcpName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                     |
|:------------|:-------|:---------------------------------------|
| pageNo      | int    | Page number of the MCP service list. The default value is 1.                     |
| pageSize    | int    | Page size of MCP services. The default value is 100.                     |
| mcpName     | String | Exact MCP service name. If `mcpName` is empty, all MCP services are returned. |
| namespaceId | String | Namespace ID to which the MCP service belongs. The default value is `public`.           |

#### Response Parameters

| Parameter Type                      | Description           |
|:--------------------------|:-------------|
| Page\<McpServerBasicInfo> | Paginated MCP service list result. |

#### Request Example

```java
try {
    Page<McpServerBasicInfo> result = aiMaintainerService.searchMcpServer("");
    result = aiMaintainerService.searchMcpServer("", 1, 100);
    result = aiMaintainerService.searchMcpServer("public", "", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.3. Get MCP Service Details

#### Description

Gets detailed MCP service information by `mcpName`.

```java
McpServerDetailInfo getMcpServerDetail(String mcpName) throws NacosException;

McpServerDetailInfo getMcpServerDetail(String mcpName, String version) throws NacosException;

McpServerDetailInfo getMcpServerDetail(String namespaceId, String mcpName, String version) throws NacosException;

McpServerDetailInfo getMcpServerDetail(String namespaceId, String mcpName, String mcpId, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                           |
|:------------|:-------|:-----------------------------|
| mcpName     | String | Exact MCP service name.                   |
| version     | String | MCP service version. If not specified, the latest version is returned by default.      |
| namespaceId | String | Namespace ID to which the MCP service belongs. The default value is `public`. |
| mcpId       | String | MCP service ID. If not specified, pass null.              |

#### Response Parameters

| Parameter Type             | Description            |
|:-----------------|:--------------|
| McpServerDetailInfo | MCP service detail object. |

#### Request Example

```java
try {
    McpServerDetailInfo result = aiMaintainerService.getMcpServerDetail("test");
    result = aiMaintainerService.getMcpServerDetail("test", "1.0.0");
    result = aiMaintainerService.getMcpServerDetail("public", "test", "1.0.0");
    result = aiMaintainerService.getMcpServerDetail("public", "test", null, "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.4. Create a Local (stdio) MCP Service

#### Description

Creates an MCP service of Local (stdio) type.

```java
String createLocalMcpServer(String mcpName, String version) throws NacosException;

String createLocalMcpServer(String mcpName, String version, String description) throws NacosException;

String createLocalMcpServer(String mcpName, String version, String description, McpToolSpecification toolSpec) throws NacosException;

String createLocalMcpServer(String mcpName, String version, String description, Map<String, Object> localServerConfig, McpToolSpecification toolSpec) throws NacosException;

String createLocalMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec) throws NacosException;
```

#### Request Parameters

| Parameter Name               | Parameter Type                 | Description                                                                                                   |
|:------------------|:---------------------|:-----------------------------------------------------------------------------------------------------|
| mcpName           | String               | Name of the MCP service to create.                                                                                          |
| version           | String               | Version of the MCP service to create.                                                                                          |
| description       | String               | MCP service description.                                                                                             |
| localServerConfig | Map<String, Object>  | Config information of the stdio MCP service. Configure it by referring to the startup config of this MCP service.                                                                 |
| toolSpec          | McpToolSpecification | Tool definition content supported by the MCP service.                                                                                      |
| serverSpec        | McpServerBasicInfo   | Definition content of the MCP service. It can be composed of `mcpName`, `version`, `description`, and `localServerConfig`, or you can create a detailed `McpServerBasicInfo` yourself. |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| String | MCP service ID returned after successful creation. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.5. Create a Remote (SSE, Streamable, etc.) MCP Service

#### Description

Creates an MCP service of Remote type, such as SSE or streamable.

```java
String createRemoteMcpServer(String mcpName, String version, String protocol, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, String version, String protocol, McpServerRemoteServiceConfig remoteServiceConfig, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, String version, String description, String protocol, McpServerRemoteServiceConfig remoteServiceConfig, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, String version, String description, String protocol, McpServerRemoteServiceConfig remoteServiceConfig, McpEndpointSpec endpointSpec, McpToolSpecification toolSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpEndpointSpec endpointSpec) throws NacosException;

String createRemoteMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;
```

#### Request Parameters

| Parameter Name                 | Parameter Type                         | Description                                                                                                   |
|:--------------------|:-----------------------------|:-----------------------------------------------------------------------------------------------------|
| mcpName             | String                       | Name of the MCP service to create.                                                                                          |
| version             | String                       | Version of the MCP service to create.                                                                                          |
| description         | String                       | MCP service description.                                                                                             |
| protocol            | String                       | Protocol types supported by the MCP service. Currently, protocols such as SSE and streamable are supported.                                                                 |
| endpointSpec        | McpEndpointSpec              | Remote endpoint definition content of the MCP service. Configure it with optional `REF` or `DIRECT` type.                                                     |
| remoteServiceConfig | McpServerRemoteServiceConfig | Config information of the SSE or streamable MCP service. Configure it by referring to the startup config of this MCP service.                                                        |
| toolSpec            | McpToolSpecification         | Tool definition content supported by the MCP service.                                                                                      |
| serverSpec          | McpServerBasicInfo           | Definition content of the MCP service. It can be composed of `mcpName`, `version`, `description`, and `localServerConfig`, or you can create a detailed `McpServerBasicInfo` yourself. |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| String | MCP service ID returned after successful creation. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.6. Update MCP Service

#### Description

Updates the specified MCP service.

```java
boolean updateMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;

boolean updateMcpServer(String mcpName, boolean isLatest, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;

boolean updateMcpServer(String namespaceId, String mcpName, boolean isLatest, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;

boolean updateMcpServer(String namespaceId, String mcpName, boolean isLatest, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec, boolean overrideExisting) throws NacosException;
```

#### Request Parameters

| Parameter Name              | Parameter Type                 | Description                                              |
|:-----------------|:---------------------|:------------------------------------------------|
| mcpName          | String               | MCP service name                                        |
| namespaceId      | String               | Namespace ID to which the MCP service belongs. The default value is `public`.                      |
| isLatest         | boolean              | Whether the updated MCP service version is the latest version. The default value is `true`.                     |
| serverSpec       | McpServerBasicInfo   | Service definition content of the new MCP service version.                                |
| toolSpec         | McpToolSpecification | Tool definition content of the new MCP service version.                                |
| endpointSpec     | McpEndpointSpec      | Endpoint definition content of the new MCP service version.                          |
| overrideExisting | boolean              | Whether to overwrite existing information of the same version. The default value is `false`. This is valid only for the seven-parameter overload.             |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| boolean | `true` if update succeeds, otherwise `false`. |

#### Request Example

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
    result = aiMaintainerService.updateMcpServer("public", "test", true, null, null, null, false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.7. Delete MCP Service

#### Description

Deletes the specified MCP service.

```java
boolean deleteMcpServer(String mcpName) throws NacosException;

boolean deleteMcpServer(String namespaceId, String mcpName, String mcpId, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                         |
|:------------|:-------|:-------------------------------------------|
| mcpName     | String | MCP service name                                  |
| namespaceId | String | Namespace ID to which the MCP service belongs. The default value is `public`.                   |
| mcpId       | String | MCP service ID. If not specified, pass null.                         |
| version     | String | MCP service version. If not specified, pass null. When null is passed, all versions under this service are deleted.        |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| boolean | `true` if deletion succeeds, otherwise `false`. |

#### Request Example

```java
try {
    boolean result = aiMaintainerService.deleteMcpServer("test");
    result = aiMaintainerService.deleteMcpServer("public", "test", null, null);
    result = aiMaintainerService.deleteMcpServer("public", "test", null, "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 6.8. Create MCP Service (Unified API)

#### Description

Create MCP server in the given namespace (Local or Remote via McpServerBasicInfo and McpEndpointSpec). Omit namespaceId for default namespace; omit endpointSpec for Local(stdio).

```java
String createMcpServer(String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;

String createMcpServer(String namespaceId, String mcpName, McpServerBasicInfo serverSpec, McpToolSpecification toolSpec, McpEndpointSpec endpointSpec) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type                 | Description                                                                 |
|:------------|:---------------------|:-------------------------------------------------------------------|
| namespaceId | string               | Namespace ID. The default value is `public`.                                            |
| mcpName     | string               | MCP service name.                                                         |
| serverSpec  | McpServerBasicInfo   | MCP service basic information, such as name, version, description, protocol, and localServerConfig.                        |
| toolSpec    | McpToolSpecification | Tool definition. For Local type, null can be passed.                                            |
| endpointSpec| McpEndpointSpec      | Endpoint specification. Null indicates Local (stdio), and non-null indicates Remote (SSE, streamable, etc.).           |

#### Response Parameters

| Parameter Type   | Description       |
|:-------|:---------|
| String | Creation result description. |

#### Request Example

```java
try {
    McpServerBasicInfo serverSpec = new McpServerBasicInfo();
    serverSpec.setName("my-mcp");
    serverSpec.setProtocol(AiConstants.Mcp.MCP_PROTOCOL_STDIO);
    ServerVersionDetail versionDetail = new ServerVersionDetail();
    versionDetail.setVersion("1.0.0");
    serverSpec.setVersionDetail(versionDetail);
    String result = aiMaintainerService.createMcpServer("my-mcp", serverSpec, null, null);
    result = aiMaintainerService.createMcpServer(Constants.DEFAULT_NAMESPACE_ID, "my-mcp", serverSpec, null, null);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

## 7. A2A Registry

> Compatibility and migration guidance: `A2aMaintainerService` in this chapter is the legacy A2A management interface and remains available during the compatibility window. The protocol-neutral `AgentMaintainerService`, obtained from `aiMaintainerService.agent()`, will replace these APIs over time. New users and SDK integrations should prefer the Agent Management APIs in Chapter 11 and avoid adding new dependencies on the legacy A2A management interface.

### 7.1. Publish AgentCard

#### Description

Publishes an AgentCard to the specified namespace.

```java
boolean registerAgent(AgentCard agentCard) throws NacosException;

boolean registerAgent(AgentCard agentCard, String namespaceId) throws NacosException;

boolean registerAgent(AgentCard agentCard, String namespaceId, String registrationType) throws NacosException;
```

#### Request Parameters

| Parameter Name              | Parameter Type      | Description                                                                                                                     |
|:-----------------|:----------|:-----------------------------------------------------------------------------------------------------------------------|
| agentCard        | AgentCard | AgentCard object.                                                                                                            |
| namespaceId      | String    | Namespace ID to which the AgentCard belongs. The default value is `public`.                                                                                         |
| registrationType | String    | Registration type. Optional values are `URL` and `SERVICE`. The default value is `URL`. It sets the default way to obtain the `url` of this AgentCard. `URL` means directly reading the `url` from registration, and `SERVICE` means generating the `url` based on the endpoint registered in Nacos. |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| boolean | `true` if registration succeeds, otherwise `false`. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 7.2. Query AgentCard

#### Description

Queries the AgentCard under the specified namespace.

```java
AgentCardDetailInfo getAgentCard(String agentName) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String namespaceId) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String namespaceId, String registrationType) throws NacosException;

AgentCardDetailInfo getAgentCard(String agentName, String namespaceId, String registrationType, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name              | Parameter Type   | Description                                                                                      |
|:-----------------|:-------|:----------------------------------------------------------------------------------------|
| agentName        | String | AgentCard name.                                                                            |
| namespaceId      | String | Namespace ID to which the AgentCard belongs. The default value is `public`.                                                          |
| registrationType | String | Registration type. Optional values are `URL` and `SERVICE`. The default value is `URL`. This field is optional. If empty, the `url` is automatically selected based on the `registrationType` set when this AgentCard was registered. |
| version          | String | AgentCard version. If not specified, pass an empty string to return the default version.                                                           |

#### Response Parameters

| Parameter Type                | Description            |
|:--------------------|:--------------|
| AgentCardDetailInfo | AgentCard detail object. |

#### Request Example

```java
try {
    AgentCardDetailInfo result = aiMaintainerService.getAgentCard("test");
    result = aiMaintainerService.getAgentCard("test", "public");
    result = aiMaintainerService.getAgentCard("test", "public", "URL");
    result = aiMaintainerService.getAgentCard("test", "public", "URL", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 7.3. Update AgentCard

#### Description

Updates the AgentCard under the specified namespace.

```java
boolean updateAgentCard(AgentCard agentCard) throws NacosException;

boolean updateAgentCard(AgentCard agentCard, String namespaceId) throws NacosException;

boolean updateAgentCard(AgentCard agentCard, String namespaceId, boolean setAsLatest) throws NacosException;

boolean updateAgentCard(AgentCard agentCard, String namespaceId, boolean setAsLatest, String registrationType) throws NacosException;
```

#### Request Parameters

| Parameter Name              | Parameter Type      | Description                                                                                                                     |
|:-----------------|:----------|:-----------------------------------------------------------------------------------------------------------------------|
| agentCard        | AgentCard | AgentCard object.                                                                                                            |
| namespaceId      | String    | Namespace ID to which the AgentCard belongs. The default value is `public`.                                                                                         |
| setAsLatest      | boolean   | Whether to set this AgentCard as the latest version.                                                                                                   |
| registrationType | String    | Registration type. Optional values are `URL` and `SERVICE`. The default value is `URL`. It sets the default way to obtain the `url` of this AgentCard. `URL` means directly reading the `url` from registration, and `SERVICE` means generating the `url` based on the endpoint registered in Nacos. |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| boolean | `true` if update succeeds, otherwise `false`. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 7.4. Delete AgentCard

#### Description

Deletes the AgentCard under the specified namespace.

```java
boolean deleteAgent(String agentName) throws NacosException;

boolean deleteAgent(String agentName, String namespaceId) throws NacosException;

boolean deleteAgent(String agentName, String namespaceId, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                             |
|:------------|:-------|:-------------------------------|
| agentName   | String | AgentCard name.                   |
| namespaceId | String | Namespace ID to which the AgentCard belongs. The default value is `public`. |
| version     | String | AgentCard version. If empty, all versions are deleted.       |

#### Response Parameters

| Parameter Type    | Description                     |
|:--------|:-----------------------|
| boolean | `true` if deletion succeeds, otherwise `false`. |

#### Request Example

```java
try {
    boolean result = aiMaintainerService.deleteAgent("test");
    result = aiMaintainerService.deleteAgent("test", "public");
    result = aiMaintainerService.deleteAgent("test", "public", "");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 7.5. Query All Versions of a Specified AgentCard

#### Description

Queries all versions of the specified AgentCard under the specified namespace.

```java
List<AgentVersionDetail> listAllVersionOfAgent(String agentName) throws NacosException;

List<AgentVersionDetail> listAllVersionOfAgent(String agentName, String namespaceId) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                             |
|:------------|:-------|:-------------------------------|
| agentName   | String | AgentCard name.                   |
| namespaceId | String | Namespace ID to which the AgentCard belongs. The default value is `public`. |

#### Response Parameters

| Parameter Type                     | Description               |
|:-------------------------|:-----------------|
| List<AgentVersionDetail> | List of all AgentCard versions. |

#### Request Example

```java
try {
    List<AgentVersionDetail> result = aiMaintainerService.listAllVersionOfAgent("test");
    result = aiMaintainerService.listAllVersionOfAgent("test", "public");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 7.6. Search AgentCard by AgentCard Name

#### Description

Searches AgentCards by AgentCard name. Only AgentCards under one namespace can be searched at a time.

```java
Page<AgentCardVersionInfo> searchAgentCardsByName(String agentNamePattern) throws NacosException;

default Page<AgentCardVersionInfo> searchAgentCardsByName(String agentNamePattern, int pageNo, int pageSize) throws NacosException;

Page<AgentCardVersionInfo> searchAgentCardsByName(String namespaceId, String agentNamePattern, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name              | Parameter Type   | Description                             |
|:-----------------|:-------|:-------------------------------|
| agentNamePattern | String | Pattern matching string for the AgentCard name.           |
| namespaceId      | String | Namespace ID to which the AgentCard belongs. The default value is `public`. |
| pageNo           | int    | Page number. The default value is 1.                        |
| pageSize         | int    | Page size. The default value is 100.                    |

#### Response Parameters

| Parameter Type                       | Description      |
|:---------------------------|:--------|
| Page<AgentCardVersionInfo> | Paginated search result. |

#### Request Example

```java
try {
    Page<AgentCardVersionInfo> result = aiMaintainerService.searchAgentCardsByName("test");
    result = aiMaintainerService.searchAgentCardsByName("test", 1, 100);
    result = aiMaintainerService.searchAgentCardsByName("test", "public", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

### 7.7. Query AgentCard List with Pagination

#### Description

Queries the AgentCard list with pagination. Only AgentCards under one namespace can be queried at a time.

```java
Page<AgentCardVersionInfo> listAgentCards() throws NacosException;

Page<AgentCardVersionInfo> listAgentCards(int pageNo, int pageSize) throws NacosException;

Page<AgentCardVersionInfo> listAgentCards(String namespaceId, int pageNo, int pageSize) throws NacosException;

Page<AgentCardVersionInfo> listAgentCards(String namespaceId, String agentName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                   |
|:------------|:-------|:-------------------------------------|
| namespaceId | String | Namespace ID to which the AgentCard belongs. The default value is `public`.       |
| pageNo      | int    | Page number. The default value is 1.                              |
| pageSize    | int    | Page size. The default value is 100.                          |
| agentName   | String | AgentCard name for exact matching. If empty, all AgentCards are queried. |

#### Response Parameters

| Parameter Type                       | Description      |
|:---------------------------|:--------|
| Page<AgentCardVersionInfo> | Paginated query result. |

#### Request Example

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

#### Exception Description

A `NacosException` is thrown when reading the config times out or a network exception occurs.

## 8. Prompt Capabilities

### 8.1. Query Prompt List with Pagination

#### Description

List prompts with pagination by namespace, promptKey pattern, search mode, and biz tags.

```java
Page<PromptMetaSummary> listPrompts(String namespaceId, String promptKey, String search, String bizTags, int pageNo, int pageSize) throws NacosException;

Page<PromptMetaSummary> listPrompts(String promptKey, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                           |
|:------------|:-------|:---------------------------------------------|
| namespaceId | string | Namespace ID. The default value is `public`.                             |
| promptKey   | string | Prompt key pattern filter.                                 |
| search      | string | Search mode: `accurate` for exact search or `blur` for fuzzy search.                 |
| bizTags     | string | Business tag filter, separated by commas (optional).                             |
| pageNo      | int    | Page number.                                          |
| pageSize    | int    | Number of items per page.                                        |

#### Response Parameters

| Parameter Type                       | Description         |
|:---------------------------|:-----------|
| Page\<PromptMetaSummary>   | Paginated Prompt list. |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    Page<PromptMetaSummary> result = promptMaintainerService.listPrompts("public", "my-prompt", "blur", null, 1, 100);
    result = promptMaintainerService.listPrompts("my-prompt", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.2. Get Prompt Metadata

#### Description

Get prompt meta by namespace and promptKey.

```java
PromptMetaInfo getPromptMeta(String namespaceId, String promptKey) throws NacosException;

PromptMetaInfo getPromptMeta(String promptKey) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description           |
|:------------|:-------|:-------------|
| namespaceId | string | Namespace ID.      |
| promptKey   | string | Prompt key. |

#### Response Parameters

| Parameter Type           | Description          |
|:---------------|:------------|
| PromptMetaInfo | Prompt metadata. |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    PromptMetaInfo meta = promptMaintainerService.getPromptMeta("public", "my-prompt");
    meta = promptMaintainerService.getPromptMeta("my-prompt");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.3. Query Prompt Version Details

#### Description

Query prompt version detail by namespace, promptKey, version, and label.

```java
PromptVersionInfo queryPromptDetail(String namespaceId, String promptKey, String version, String label) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description        |
|:------------|:-------|:----------|
| namespaceId | string | Namespace ID.   |
| promptKey   | string | Prompt key. |
| version     | string | Version number.      |
| label       | string | Label (optional).   |

#### Response Parameters

| Parameter Type              | Description             |
|:------------------|:---------------|
| PromptVersionInfo | Prompt version details.   |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    PromptVersionInfo detail = promptMaintainerService.queryPromptDetail("public", "my-prompt", "1.0.0", null);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.4. Bind Prompt Label

#### Description

Bind a label to a prompt version.

```java
boolean bindLabel(String namespaceId, String promptKey, String label, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| promptKey   | string | Prompt key. |
| label       | string | Label name.     |
| version     | string | Version number.     |

#### Response Parameters

| Parameter Type    | Description           |
|:--------|:-------------|
| boolean | Whether binding succeeds.     |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    boolean ok = promptMaintainerService.bindLabel("public", "my-prompt", "stable", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.5. Unbind Prompt Label

#### Description

Unbind a label from a prompt.

```java
boolean unbindLabel(String namespaceId, String promptKey, String label) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| promptKey   | string | Prompt key. |
| label       | string | Label name.     |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether unbinding succeeds.   |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    boolean ok = promptMaintainerService.unbindLabel("public", "my-prompt", "stable");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.6. Publish Prompt Version

#### Description

Publish a new prompt version with optional description and biz tags.

```java
boolean publishPrompt(String namespaceId, String promptKey, String version, String template, String commitMsg, String description, String bizTags, String variables) throws NacosException;

boolean publishPrompt(String namespaceId, String promptKey, String version, String template, String commitMsg, String description, String bizTags) throws NacosException;

boolean publishPrompt(String namespaceId, String promptKey, String version, String template, String commitMsg, String description) throws NacosException;

boolean publishPrompt(String promptKey, String version, String template, String commitMsg) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description               |
|:------------|:-------|:-----------------|
| namespaceId | string | Namespace ID.          |
| promptKey   | string | Prompt key.       |
| version     | string | Version number, which must be greater than the current version.   |
| template    | string | Template content.            |
| commitMsg   | string | Commit message.            |
| description | string | Description (optional).          |
| bizTags     | string | Business tags, separated by commas (optional).   |
| variables   | string | Variable definition JSON (optional).    |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether publishing succeeds. |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    boolean ok = promptMaintainerService.publishPrompt("public", "my-prompt", "1.0.1", "Hello {{name}}", "init", "desc", null, "{\"name\":\"string\"}");
    ok = promptMaintainerService.publishPrompt("public", "my-prompt", "1.0.1", "Hello {{name}}", "init", "desc", null);
    ok = promptMaintainerService.publishPrompt("my-prompt", "1.0.1", "Hello {{name}}", "init");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.7. Delete Prompt

#### Description

Delete a prompt in the given namespace.

```java
boolean deletePrompt(String namespaceId, String promptKey) throws NacosException;

boolean deletePrompt(String promptKey) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| promptKey   | string | Prompt key. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    boolean ok = promptMaintainerService.deletePrompt("public", "my-prompt");
    ok = promptMaintainerService.deletePrompt("my-prompt");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.8. Query Prompt Version List with Pagination

#### Description

List prompt versions with pagination.

```java
Page<PromptVersionSummary> listPromptVersions(String namespaceId, String promptKey, int pageNo, int pageSize) throws NacosException;

Page<PromptVersionSummary> listPromptVersions(String promptKey, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| promptKey   | string | Prompt key. |
| pageNo      | int    | Page number.      |
| pageSize    | int    | Number of items per page.    |

#### Response Parameters

| Parameter Type                       | Description           |
|:---------------------------|:-------------|
| Page\<PromptVersionSummary> | Paginated version list.     |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    Page<PromptVersionSummary> result = promptMaintainerService.listPromptVersions("public", "my-prompt", 1, 100);
    result = promptMaintainerService.listPromptVersions("my-prompt", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.9. Update Prompt Metadata

#### Description

Update prompt description and biz tags.

```java
boolean updatePromptMetadata(String namespaceId, String promptKey, String description, String bizTags) throws NacosException;

boolean updatePromptMetadata(String namespaceId, String promptKey, String description) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description         |
|:------------|:-------|:-----------|
| namespaceId | string | Namespace ID.    |
| promptKey   | string | Prompt key. |
| description | string | New description.       |
| bizTags     | string | New business tags, separated by commas (optional). |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether the update succeeds. |

#### Request Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    boolean ok = promptMaintainerService.updatePromptMetadata("public", "my-prompt", "new desc", "tag1,tag2");
    ok = promptMaintainerService.updatePromptMetadata("public", "my-prompt", "new desc");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 8.10. Get Prompt Governance Detail

#### Description

Get Prompt governance detail by namespace and promptKey, including version governance information and all version summaries.

```java
PromptMetaInfo getPromptGovernanceDetail(String namespaceId, String promptKey) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |

#### Response

| Type           | Description |
|:---------------|:------------|
| PromptMetaInfo | Prompt governance detail. |

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    PromptMetaInfo detail = promptMaintainerService.getPromptGovernanceDetail("public", "my-prompt");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.11. Get Prompt Version Detail

#### Description

Get Prompt version detail by namespace, promptKey, and version.

```java
PromptVersionInfo getVersionDetail(String namespaceId, String promptKey, String version) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| version     | string | Prompt version. |

#### Response

| Type              | Description |
|:------------------|:------------|
| PromptVersionInfo | Prompt version detail. |

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    PromptVersionInfo detail = promptMaintainerService.getVersionDetail("public", "my-prompt", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.12. Create Prompt Draft

#### Description

Create a Prompt draft version. It can fork from an existing version and optionally specify the target version, template, variables, commit message, description, and biz tags.

```java
String createDraft(String namespaceId, String promptKey, String basedOnVersion, String targetVersion, String template, String variables, String commitMsg, String description, String bizTags) throws NacosException;
```

#### Request Parameters

| Name           | Type   | Description |
|:---------------|:-------|:------------|
| namespaceId    | string | Namespace ID. |
| promptKey      | string | Prompt key. |
| basedOnVersion | string | Base version to fork from, optional. |
| targetVersion  | string | Target draft version, optional. |
| template       | string | Prompt template content. |
| variables      | string | Variable definition JSON, optional. |
| commitMsg      | string | Commit message, optional. |
| description    | string | Prompt description, optional when first created. |
| bizTags        | string | Biz tags JSON, optional when first created. |

#### Response

| Type   | Description |
|:-------|:------------|
| String | Created draft version. |

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    String version = promptMaintainerService.createDraft("public", "my-prompt", "1.0.0", "1.0.1-draft",
            "Hello {{name}}", "{\"name\":\"string\"}", "update prompt", "desc", "[\"ai\"]");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.13. Update Prompt Draft

#### Description

Update the current Prompt draft content.

```java
void updateDraft(String namespaceId, String promptKey, String template, String variables, String commitMsg) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| template    | string | Updated template content. |
| variables   | string | Variable definition JSON, optional. |
| commitMsg   | string | Commit message, optional. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.updateDraft("public", "my-prompt", "Hello {{name}}", "{\"name\":\"string\"}", "update template");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.14. Delete Prompt Draft

#### Description

Delete the current draft version of a Prompt.

```java
void deleteDraft(String namespaceId, String promptKey) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.deleteDraft("public", "my-prompt");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.15. Submit Prompt Version

#### Description

Submit a Prompt version for release review.

```java
String submit(String namespaceId, String promptKey, String version) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| version     | string | Version to submit, optional; the server may use the current draft. |

#### Response

| Type   | Description |
|:-------|:------------|
| String | Submitted version. |

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    String version = promptMaintainerService.submit("public", "my-prompt", "1.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.16. Publish Prompt Version

#### Description

Publish a reviewed Prompt Version. The latest label is server-managed.

```java
void publish(String namespaceId, String promptKey, String version, Boolean updateLatestLabel) throws NacosException;
```

#### Request Parameters

| Name              | Type    | Description |
|:------------------|:--------|:------------|
| namespaceId       | string  | Namespace ID. |
| promptKey         | string  | Prompt key. |
| version           | string  | Version to publish. |
| updateLatestLabel | boolean | Compatibility parameter retained and ignored by the server. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.publish("public", "my-prompt", "1.0.1", true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.17. Force Publish Prompt Version

#### Description

Force-publish a Prompt Version without release review. The latest label is server-managed.

```java
void forcePublish(String namespaceId, String promptKey, String version, Boolean updateLatestLabel) throws NacosException;
```

#### Request Parameters

| Name              | Type    | Description |
|:------------------|:--------|:------------|
| namespaceId       | string  | Namespace ID. |
| promptKey         | string  | Prompt key. |
| version           | string  | Version to publish. |
| updateLatestLabel | boolean | Compatibility parameter retained and ignored by the server. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.forcePublish("public", "my-prompt", "1.0.1", true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.18. Redraft Prompt Version

#### Description

Move a reviewed Prompt version back to draft status for further editing.

```java
boolean redraft(String namespaceId, String promptKey, String version) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| version     | string | Version to redraft. |

#### Response

| Type    | Description |
|:--------|:------------|
| boolean | Whether redraft succeeds. |

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    boolean ok = promptMaintainerService.redraft("public", "my-prompt", "1.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.19. Change Prompt Online Status

#### Description

Bring a Prompt version online or offline.

```java
void changeOnlineStatus(String namespaceId, String promptKey, String version, boolean online) throws NacosException;
```

#### Request Parameters

| Name        | Type    | Description |
|:------------|:--------|:------------|
| namespaceId | string  | Namespace ID. |
| promptKey   | string  | Prompt key. |
| version     | string  | Version. |
| online      | boolean | `true` to bring online, `false` to take offline. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.changeOnlineStatus("public", "my-prompt", "1.0.1", true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.20. Update Prompt Labels

#### Description

Update Prompt labels JSON to maintain label-to-version mappings.

```java
void updateLabels(String namespaceId, String promptKey, String labels) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| labels      | string | Labels JSON. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.updateLabels("public", "my-prompt", "{\"latest\":\"1.0.1\"}");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.21. Update Prompt Description

#### Description

Update Prompt description.

```java
void updateDescription(String namespaceId, String promptKey, String description) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| description | string | New description. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.updateDescription("public", "my-prompt", "new desc");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 8.22. Update Prompt Biz Tags

#### Description

Update Prompt biz tags JSON.

```java
void updateBizTags(String namespaceId, String promptKey, String bizTags) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| promptKey   | string | Prompt key. |
| bizTags     | string | Biz tags JSON. |

#### Response

None.

#### Example

```java
try {
    PromptMaintainerService promptMaintainerService = aiMaintainerService.prompt();
    promptMaintainerService.updateBizTags("public", "my-prompt", "[\"ai\",\"ops\"]");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

## 9. Skill Capabilities

### 9.1. Delete Skill

#### Description

Delete a skill in the given namespace.

```java
boolean deleteSkill(String namespaceId, String skillName) throws NacosException;

boolean deleteSkill(String skillName) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| skillName   | string | Skill name. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.deleteSkill("public", "my-skill");
    ok = skillMaintainerService.deleteSkill("my-skill");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.2. Query Skill List with Pagination

#### Description

List skills with pagination by namespace, name pattern, and search mode.

```java
Page<SkillSummary> listSkills(String namespaceId, String skillName, String search, int pageNo, int pageSize) throws NacosException;

Page<SkillSummary> listSkills(String namespaceId, String skillName, String search, String orderBy, String owner, String scope, int pageNo, int pageSize) throws NacosException;

Page<SkillSummary> listSkills(String namespaceId, String skillName, String search, String orderBy, String owner, String scope, String bizTag, int pageNo, int pageSize) throws NacosException;

Page<SkillSummary> listSkills(String skillName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                           |
|:------------|:-------|:-----------------------------|
| namespaceId | string | Namespace ID.                      |
| skillName   | string | Skill name pattern filter.                 |
| search      | string | Search mode: `accurate` for exact search or `blur` for fuzzy search. |
| orderBy     | string | Optional sort field.               |
| owner       | string | Optional resource owner filter.     |
| scope       | string | Optional visibility scope filter.   |
| bizTag      | string | Optional business tag filter.       |
| pageNo      | int    | Page number.                          |
| pageSize    | int    | Number of items per page.                        |

#### Response Parameters

| Parameter Type                   | Description         |
|:-----------------------|:-----------|
| Page\<SkillSummary>   | Skill page result. |

`SkillSummary.writable` indicates whether the current requester can modify the Skill.

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    Page<SkillSummary> result = skillMaintainerService.listSkills("public", "my-skill", "blur", 1, 100);
    result = skillMaintainerService.listSkills("public", "my-skill", "blur", "download_count", "nacos", "PUBLIC", 1, 100);
    result = skillMaintainerService.listSkills("public", "my-skill", "blur", "download_count", "nacos", "PUBLIC", "ops", 1, 100);
    result = skillMaintainerService.listSkills("my-skill", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.3. Upload Skill from ZIP

#### Description

Upload and register a skill from ZIP bytes in the given namespace.

```java
String uploadSkillFromZip(String namespaceId, byte[] zipBytes, boolean overwrite) throws NacosException;

String uploadSkillFromZip(String namespaceId, byte[] zipBytes, boolean overwrite, String targetVersion) throws NacosException;

String uploadSkillFromZip(String namespaceId, byte[] zipBytes, boolean overwrite, String targetVersion, String commitMsg) throws NacosException;

String uploadSkillFromZip(String namespaceId, byte[] zipBytes, boolean overwrite, String targetVersion, String commitMsg, String uploadAction) throws NacosException;

String uploadSkillFromZip(String namespaceId, byte[] zipBytes) throws NacosException;

String uploadSkillFromZip(byte[] zipBytes) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type    | Description          |
|:------------|:--------|:------------|
| namespaceId | string  | Namespace ID.     |
| zipBytes    | byte[]  | Bytes of the Skill ZIP package. |
| overwrite   | boolean | Whether to overwrite the current editable draft when the Skill already exists. |
| targetVersion | string | Optional target version, used when the ZIP content has no version. |
| commitMsg   | string  | Optional version commit message. |
| uploadAction | string | Optional upload action selected after precheck: `CREATE_DRAFT`, `OVERWRITE_DRAFT`, or `DELETE_DRAFT_AND_CREATE`. |

#### Response Parameters

| Parameter Type   | Description       |
|:-------|:---------|
| String | Skill name. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    byte[] zipBytes = Files.readAllBytes(Paths.get("my-skill.zip"));
    String name = skillMaintainerService.uploadSkillFromZip("public", zipBytes, true);
    name = skillMaintainerService.uploadSkillFromZip("public", zipBytes, true, "1.0.1");
    name = skillMaintainerService.uploadSkillFromZip("public", zipBytes, true, "1.0.1", "upload skill");
    // To resolve a draft conflict explicitly after precheck, use:
    // String name = skillMaintainerService.uploadSkillFromZip("public", zipBytes, true, "1.0.1", "upload skill", "OVERWRITE_DRAFT");
    name = skillMaintainerService.uploadSkillFromZip("public", zipBytes);
    name = skillMaintainerService.uploadSkillFromZip(zipBytes);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.4. Get Skill metadata

#### Description

Get skill metadata in default namespace or specified namespace.

```java
SkillMeta getSkillMeta(String skillName) throws NacosException;

SkillMeta getSkillMeta(String namespaceId, String skillName) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| skillName   | string | Skill name. |

#### Response Parameters

| Parameter Type   | Description          |
|:-------|:------------|
| SkillMeta | Skill metadata. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    SkillMeta meta = skillMaintainerService.getSkillMeta("my-skill");
    meta = skillMaintainerService.getSkillMeta("public", "my-skill");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.5. Get Skill version detail

#### Description

Get detail for a specific skill version.

```java
Skill getSkillVersionDetail(String skillName, String version) throws NacosException;

Skill getSkillVersionDetail(String namespaceId, String skillName, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| skillName   | string | Skill name. |
| version     | string | Skill version. |

#### Response Parameters

| Parameter Type | Description                  |
|:------|:--------------------|
| Skill | Skill detail object of the specified version. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    Skill detail = skillMaintainerService.getSkillVersionDetail("my-skill", "1.0.0");
    detail = skillMaintainerService.getSkillVersionDetail("public", "my-skill", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.6. Create Skill draft

#### Description

Create a new skill draft, optionally forked from an existing version.

```java
String createDraft(String namespaceId, String skillCard) throws NacosException;

String createDraft(String namespaceId, String skillName, String basedOnVersion) throws NacosException;

String createDraft(String namespaceId, String skillName, String basedOnVersion, String targetVersion) throws NacosException;

String createDraft(String namespaceId, String skillName, String basedOnVersion, String targetVersion, String skillCard) throws NacosException;

String createDraft(String namespaceId, String skillName, String basedOnVersion, String targetVersion, String skillCard, String commitMsg) throws NacosException;
```

#### Request Parameters

| Parameter Name          | Parameter Type   | Description                             |
|:-------------|:-------|:-------------------------------|
| namespaceId  | string | Namespace ID.                        |
| skillName    | string | Skill name, required when forking.             |
| basedOnVersion | string | Version on which the fork is based (optional).                |
| targetVersion | string | Target draft version (optional).                    |
| skillCard    | string | Complete Skill JSON, usually required in non-fork scenarios.   |
| commitMsg    | string | Optional version commit message.        |

#### Response Parameters

| Parameter Type   | Description         |
|:-------|:-----------|
| String | Created draft version number. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    String version = skillMaintainerService.createDraft("public", "{\"name\":\"my-skill\"}");
    version = skillMaintainerService.createDraft("public", "my-skill", "1.0.0");
    version = skillMaintainerService.createDraft("public", "my-skill", "1.0.0", "1.0.1-draft");
    version = skillMaintainerService.createDraft("public", "my-skill", "1.0.0", "1.0.1-draft", "{\"name\":\"my-skill\"}");
    version = skillMaintainerService.createDraft("public", "my-skill", "1.0.0", "1.0.1-draft", "{\"name\":\"my-skill\"}", "update skill");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.7. Update Skill draft

#### Description

Update current draft content.

```java
boolean updateDraft(String namespaceId, String skillCard, Boolean setAsLatest) throws NacosException;

boolean updateDraft(String namespaceId, String skillCard, Boolean setAsLatest, String commitMsg) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type    | Description                      |
|:------------|:--------|:------------------------|
| namespaceId | string  | Namespace ID.                 |
| skillCard   | string  | Complete Skill JSON.          |
| setAsLatest | boolean | Whether to set the latest label (optional).     |
| commitMsg   | string  | Optional version commit message. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether the update succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.updateDraft("public", "{\"name\":\"my-skill\"}", true);
    ok = skillMaintainerService.updateDraft("public", "{\"name\":\"my-skill\"}", true, "update skill");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.8. Delete Skill draft

#### Description

Delete current draft of a skill.

```java
boolean deleteDraft(String namespaceId, String skillName) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| skillName   | string | Skill name. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.deleteDraft("public", "my-skill");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.9. Submit Skill version

#### Description

Submit a skill version into review pipeline.

```java
String submit(String namespaceId, String skillName, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                     |
|:------------|:-------|:-----------------------|
| namespaceId | string | Namespace ID.                |
| skillName   | string | Skill name.              |
| version     | string | Version number (optional). The server can automatically select the current draft. |

#### Response Parameters

| Parameter Type   | Description                  |
|:-------|:--------------------|
| String | Submit result, such as `pipelineId`. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    String result = skillMaintainerService.submit("public", "my-skill", "1.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.10. Publish Skill version

#### Description

Publish a reviewed Skill Version. The latest label is server-managed.

```java
boolean publish(String namespaceId, String skillName, String version, Boolean updateLatestLabel) throws NacosException;
```

#### Request Parameters

| Parameter Name            | Parameter Type    | Description                 |
|:---------------|:--------|:-------------------|
| namespaceId    | string  | Namespace ID.            |
| skillName      | string  | Skill name.          |
| version        | string  | Version to publish.             |
| updateLatestLabel | boolean | Compatibility parameter retained and ignored by the server. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether publishing succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.publish("public", "my-skill", "1.0.1", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.11. Force publish Skill version

#### Description

Force publish skill version without review check.

```java
boolean forcePublish(String namespaceId, String skillName, String version, Boolean updateLatestLabel) throws NacosException;
```

#### Request Parameters

| Parameter Name            | Parameter Type    | Description                 |
|:---------------|:--------|:-------------------|
| namespaceId    | string  | Namespace ID.            |
| skillName      | string  | Skill name.          |
| version        | string  | Version to publish.             |
| updateLatestLabel | boolean | Compatibility parameter retained and ignored by the server. |

#### Response Parameters

| Parameter Type    | Description           |
|:--------|:-------------|
| boolean | Whether force publish succeeds.   |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.forcePublish("public", "my-skill", "1.0.1", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.12. Update Skill labels

#### Description

Update runtime label mapping JSON.

```java
boolean updateLabels(String namespaceId, String skillName, String labels) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description           |
|:------------|:-------|:-------------|
| namespaceId | string | Namespace ID.      |
| skillName   | string | Skill name.    |
| labels      | string | labels JSON. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether the update succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.updateLabels("public", "my-skill", "{\"stable\":\"1.0.1\"}");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.13. Update Skill biz tags

#### Description

Update biz tags JSON of a skill.

```java
boolean updateBizTags(String namespaceId, String skillName, String bizTags) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description            |
|:------------|:-------|:--------------|
| namespaceId | string | Namespace ID.       |
| skillName   | string | Skill name.     |
| bizTags     | string | bizTags JSON. |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether the update succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.updateBizTags("public", "my-skill", "[\"ai\",\"ops\"]");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.14. Change Skill online status

#### Description

Online/offline a skill or a specific version.

```java
boolean changeOnlineStatus(String namespaceId, String skillName, String scope, String version, boolean online) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description                                  |
|:------------|:-------|:------------------------------------|
| namespaceId | string | Namespace ID.                             |
| skillName   | string | Skill name.                           |
| scope       | string | Scope. `skill` indicates Skill level, and other values indicate version level.      |
| version     | string | Version number, used for version-level operations.                      |
| online      | boolean | `true` means online, and `false` means offline.               |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether the operation succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.changeOnlineStatus("public", "my-skill", "skill", null, true);
    ok = skillMaintainerService.changeOnlineStatus("public", "my-skill", "version", "1.0.1", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.15. Update Skill scope

#### Description

Update visibility scope of a skill, e.g. `PUBLIC` / `PRIVATE`.

```java
boolean updateScope(String namespaceId, String skillName, String scope) throws NacosException;
```

#### Request Parameters

| Parameter Name         | Parameter Type   | Description       |
|:------------|:-------|:---------|
| namespaceId | string | Namespace ID.  |
| skillName   | string | Skill name. |
| scope       | string | Visibility scope.    |

#### Response Parameters

| Parameter Type    | Description         |
|:--------|:-----------|
| boolean | Whether the update succeeds. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.updateScope("public", "my-skill", "PUBLIC");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the operation fails.

### 9.16. Batch Upload Skills from ZIP

#### Description

Batch upload Skills from a ZIP package containing multiple Skill directories.

```java
BatchUploadResult batchUploadSkillsFromZip(byte[] zipBytes) throws NacosException;

BatchUploadResult batchUploadSkillsFromZip(String namespaceId, byte[] zipBytes, boolean overwrite) throws NacosException;
```

#### Request Parameters

| Name        | Type    | Description |
|:------------|:--------|:------------|
| namespaceId | string  | Namespace ID. |
| zipBytes    | byte[]  | ZIP bytes containing multiple Skill directories. |
| overwrite   | boolean | Whether to overwrite existing drafts. |

#### Response

| Type              | Description |
|:------------------|:------------|
| BatchUploadResult | Batch upload result containing per-item structured results and compatibility fields. |

The main fields of `BatchUploadResult` are as follows:

| Name | Type | Description |
|:---|:---|:---|
| results | List\<BatchUploadItemResult> | Structured result for each Skill or candidate directory. |
| succeeded | List\<String> | Names of successfully uploaded Skills (compatibility field). |
| failed | List\<FailedItem> | Failed Skill items (compatibility field). |

`BatchUploadItemResult` contains `name`, `success`, `errorCode`, `errorMessage`, and `owner`.

#### Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    byte[] zipBytes = Files.readAllBytes(Paths.get("skills.zip"));
    BatchUploadResult result = skillMaintainerService.batchUploadSkillsFromZip(zipBytes);
    result = skillMaintainerService.batchUploadSkillsFromZip("public", zipBytes, true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 9.17. Redraft Skill Version

#### Description

Move a reviewed Skill version back to draft status for further editing.

```java
boolean redraft(String namespaceId, String skillName, String version) throws NacosException;
```

#### Request Parameters

| Name        | Type   | Description |
|:------------|:-------|:------------|
| namespaceId | string | Namespace ID. |
| skillName   | string | Skill name. |
| version     | string | Version to redraft. |

#### Response

| Type    | Description |
|:--------|:------------|
| boolean | Whether redraft succeeds. |

#### Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    boolean ok = skillMaintainerService.redraft("public", "my-skill", "1.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exceptions

Throws NacosException when the operation fails.

### 9.18. Precheck Skill ZIP Upload

#### Description

Check one or more Skills in a ZIP before applying the upload. The result reports version conflicts, permission checks, and the available upload action for each item. A caller can use the result to select `uploadAction` for `uploadSkillFromZip`.

```java
List<SkillUploadPrecheckResult> precheckUploadSkillFromZip(byte[] zipBytes) throws NacosException;

List<SkillUploadPrecheckResult> precheckUploadSkillFromZip(String namespaceId, byte[] zipBytes) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| zipBytes | byte[] | ZIP bytes containing one or more Skills. |

#### Response Parameters

| Type | Description |
|:---|:---|
| List\<SkillUploadPrecheckResult> | Precheck result for every Skill or candidate directory in the ZIP. |

The main fields of `SkillUploadPrecheckResult` are as follows:

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| entryPath | string | Candidate directory path in the ZIP. |
| skillName | string | Detected Skill name. |
| reason | string | Precheck result description. |
| owner | string | Owner of an existing Skill. |
| maxPublishedVersion | string | Current maximum published version. |
| parsedVersion | string | Version parsed from the ZIP content. |
| targetVersion | string | Target version selected by precheck. |
| exists | boolean | Whether the Skill already exists. |
| editingVersion | string | Current draft version. |
| reviewingVersion | string | Current reviewing version. |
| precheckCode | string | Result code, such as `READY`, `VERSION_ADJUSTED`, `DRAFT_EXISTS`, `REVIEWING_EXISTS`, `NO_PERMISSION`, `NOT_A_SKILL`, or `INVALID_SKILL`. |

#### Request Example

```java
try {
    SkillMaintainerService skillMaintainerService = aiMaintainerService.skill();
    byte[] zipBytes = Files.readAllBytes(Paths.get("skills.zip"));
    List<SkillUploadPrecheckResult> results = skillMaintainerService.precheckUploadSkillFromZip(zipBytes);
    results = skillMaintainerService.precheckUploadSkillFromZip("public", zipBytes);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the precheck request fails unexpectedly. Business validation failures are returned as per-item results.

## 10. AgentSpec Capabilities

### 10.1. Get AgentSpec detail

#### Description

Get current AgentSpec detail.

```java
AgentSpec getAgentSpecDetail(String namespaceId, String agentSpecName) throws NacosException;
AgentSpec getAgentSpecDetail(String agentSpecName) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| AgentSpec | AgentSpec detail object. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    AgentSpec detail = agentSpecMaintainerService.getAgentSpecDetail("public", "test-agent-spec");
    detail = agentSpecMaintainerService.getAgentSpecDetail("test-agent-spec");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.2. Get AgentSpec admin detail

#### Description

Get AgentSpec admin metadata detail.

```java
AgentSpecMeta getAgentSpecAdminDetail(String namespaceId, String agentSpecName) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| AgentSpecMeta | AgentSpec admin metadata object. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    AgentSpecMeta meta = agentSpecMaintainerService.getAgentSpecAdminDetail("public", "test-agent-spec");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.3. Get AgentSpec version detail

#### Description

Get specific version detail of AgentSpec.

```java
AgentSpec getAgentSpecVersionDetail(String namespaceId, String agentSpecName, String version) throws NacosException;
AgentSpec getAgentSpecVersionDetail(String agentSpecName, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| version | string | AgentSpec version. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| AgentSpec | AgentSpec version detail object. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    AgentSpec detail = agentSpecMaintainerService.getAgentSpecVersionDetail("public", "test-agent-spec", "1.0.0");
    detail = agentSpecMaintainerService.getAgentSpecVersionDetail("test-agent-spec", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.4. Delete AgentSpec

#### Description

Delete target AgentSpec.

```java
boolean deleteAgentSpec(String namespaceId, String agentSpecName) throws NacosException;
boolean deleteAgentSpec(String agentSpecName) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.deleteAgentSpec("public", "test-agent-spec");
    ok = agentSpecMaintainerService.deleteAgentSpec("test-agent-spec");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.5. List AgentSpecs with pagination

#### Description

List AgentSpec basic items with pagination.

```java
Page<AgentSpecBasicInfo> listAgentSpecs(String namespaceId, String agentSpecName, String search, int pageNo, int pageSize) throws NacosException;
Page<AgentSpecBasicInfo> listAgentSpecs(String agentSpecName, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name pattern. |
| search | string | Search mode: `accurate` or `blur`. |
| pageNo | int | Page number. |
| pageSize | int | Page size. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| Page\<AgentSpecBasicInfo> | Paged AgentSpec basic list. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    Page<AgentSpecBasicInfo> list = agentSpecMaintainerService.listAgentSpecs("public", "test-agent-spec", "blur", 1, 100);
    list = agentSpecMaintainerService.listAgentSpecs("test-agent-spec", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.6. List AgentSpec admin items with pagination

#### Description

List AgentSpec admin items with pagination.

```java
Page<AgentSpecSummary> listAgentSpecAdminItems(String namespaceId, String agentSpecName, String search, int pageNo, int pageSize) throws NacosException;

Page<AgentSpecSummary> listAgentSpecAdminItems(String namespaceId, String agentSpecName, String search, String orderBy, String owner, String scope, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name pattern. |
| search | string | Search mode: `accurate` or `blur`. |
| orderBy | string | Optional sort field. |
| owner | string | Optional resource owner filter. |
| scope | string | Optional visibility scope filter. |
| pageNo | int | Page number. |
| pageSize | int | Page size. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| Page\<AgentSpecSummary> | Paged AgentSpec admin list. |

`AgentSpecSummary.owner` identifies the resource owner, and `AgentSpecSummary.writable` indicates whether the current requester can modify the AgentSpec.

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    Page<AgentSpecSummary> adminList = agentSpecMaintainerService.listAgentSpecAdminItems("public", "test-agent-spec", "blur", 1, 100);
    adminList = agentSpecMaintainerService.listAgentSpecAdminItems("public", "test-agent-spec", "blur", "download_count", "nacos", "PUBLIC", 1, 100);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.7. Upload AgentSpec from ZIP

#### Description

Upload AgentSpec from ZIP bytes.

```java
String uploadAgentSpecFromZip(String namespaceId, byte[] zipBytes, boolean overwrite) throws NacosException;
String uploadAgentSpecFromZip(String namespaceId, byte[] zipBytes) throws NacosException;
String uploadAgentSpecFromZip(byte[] zipBytes) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| zipBytes | byte[] | AgentSpec ZIP bytes. |
| overwrite | boolean | Whether to overwrite current editable draft when AgentSpec exists. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| String | AgentSpec name. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    byte[] zipBytes = Files.readAllBytes(Paths.get("test-agent-spec.zip"));
    String name = agentSpecMaintainerService.uploadAgentSpecFromZip("public", zipBytes, true);
    name = agentSpecMaintainerService.uploadAgentSpecFromZip("public", zipBytes);
    name = agentSpecMaintainerService.uploadAgentSpecFromZip(zipBytes);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.8. Create AgentSpec draft

#### Description

Create a new draft based on an existing version.

```java
String createDraft(String namespaceId, String agentSpecName, String basedOnVersion) throws NacosException;

String createDraft(String namespaceId, String agentSpecName, String basedOnVersion, String targetVersion) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| basedOnVersion | string | Base version (optional). |
| targetVersion | string | Target draft version, optional; auto-incremented when blank. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| String | Created draft version. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    String version = agentSpecMaintainerService.createDraft("public", "test-agent-spec", "1.0.0");
    version = agentSpecMaintainerService.createDraft("public", "test-agent-spec", "1.0.0", "1.0.1-draft");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.9. Update AgentSpec draft

#### Description

Update current draft content.

```java
boolean updateDraft(String namespaceId, String agentSpecCard, Boolean setAsLatest) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecCard | string | AgentSpec full JSON. |
| setAsLatest | boolean | Whether to update latest label. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether update succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.updateDraft("public", "{\"name\":\"test-agent-spec\"}", true);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.10. Delete AgentSpec draft

#### Description

Delete current draft version.

```java
boolean deleteDraft(String namespaceId, String agentSpecName) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether deletion succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.deleteDraft("public", "test-agent-spec");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.11. Submit AgentSpec version

#### Description

Submit AgentSpec version for review workflow.

```java
String submit(String namespaceId, String agentSpecName, String version) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| version | string | Target version. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| String | Submit result (for example pipelineId). |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    String result = agentSpecMaintainerService.submit("public", "test-agent-spec", "1.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.12. Publish AgentSpec version

#### Description

Publish the target AgentSpec Version. The latest label is server-managed.

```java
boolean publish(String namespaceId, String agentSpecName, String version, Boolean updateLatestLabel) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| version | string | Target version. |
| updateLatestLabel | boolean | Compatibility parameter retained and ignored by the server. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether publish succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.publish("public", "test-agent-spec", "1.0.1", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.13. Force-publish AgentSpec version

#### Description

Force-publish the target AgentSpec Version. The latest label is server-managed.

```java
boolean forcePublish(String namespaceId, String agentSpecName, String version, Boolean updateLatestLabel) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| version | string | Target version. |
| updateLatestLabel | boolean | Compatibility parameter retained and ignored by the server. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether force publish succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.forcePublish("public", "test-agent-spec", "1.0.1", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.14. Update AgentSpec labels

#### Description

Update labels JSON of AgentSpec.

```java
boolean updateLabels(String namespaceId, String agentSpecName, String labels) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| labels | string | Labels JSON. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether update succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.updateLabels("public", "test-agent-spec", "{\"latest\":\"1.0.1\"}");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.15. Update AgentSpec biz tags

#### Description

Update biz tags JSON of AgentSpec.

```java
boolean updateBizTags(String namespaceId, String agentSpecName, String bizTags) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| bizTags | string | Biz tags JSON. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether update succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.updateBizTags("public", "test-agent-spec", "[\"ai\",\"ops\"]");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.16. Change AgentSpec online status

#### Description

Online/offline operation at AgentSpec-level or version-level.

```java
boolean changeOnlineStatus(String namespaceId, String agentSpecName, String scope, String version, boolean online) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| scope | string | Scope (for example `agentspec` or `version`). |
| version | string | Version for version-level operation. |
| online | boolean | `true` for online, `false` for offline. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether operation succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.changeOnlineStatus("public", "test-agent-spec", "agentspec", null, true);
    ok = agentSpecMaintainerService.changeOnlineStatus("public", "test-agent-spec", "version", "1.0.1", false);
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.17. Update AgentSpec scope

#### Description

Update AgentSpec visibility scope, for example `PUBLIC` / `PRIVATE`.

```java
boolean updateScope(String namespaceId, String agentSpecName, String scope) throws NacosException;
```

#### Request Parameters

| Parameter Name | Parameter Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| scope | string | Visibility scope. |

#### Response Parameters

| Parameter Type | Description |
|:---|:---|
| boolean | Whether update succeeds. |

#### Request Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.updateScope("public", "test-agent-spec", "PUBLIC");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.18. Get AgentSpec Version Metadata

#### Description

Get AgentSpec version metadata. The response contains the main content and a resource list with only resource name and type, avoiding full resource content reads.

```java
AgentSpec getAgentSpecVersionMeta(String namespaceId, String agentSpecName, String version) throws NacosException;
AgentSpec getAgentSpecVersionMeta(String agentSpecName, String version) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| version | string | AgentSpec version. |

#### Response

| Type | Description |
|:---|:---|
| AgentSpec | AgentSpec version metadata. |

#### Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    AgentSpec meta = agentSpecMaintainerService.getAgentSpecVersionMeta("public", "test-agent-spec", "1.0.0");
    meta = agentSpecMaintainerService.getAgentSpecVersionMeta("test-agent-spec", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

### 10.19. Redraft AgentSpec Version

#### Description

Move a reviewed AgentSpec version back to draft status for further editing.

```java
boolean redraft(String namespaceId, String agentSpecName, String version) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. |
| agentSpecName | string | AgentSpec name. |
| version | string | Version to redraft. |

#### Response

| Type | Description |
|:---|:---|
| boolean | Whether redraft succeeds. |

#### Example

```java
try {
    AgentSpecMaintainerService agentSpecMaintainerService = aiMaintainerService.agentSpec();
    boolean ok = agentSpecMaintainerService.redraft("public", "test-agent-spec", "1.0.1");
} catch (NacosException e) {
    e.printStackTrace();
}
```

## 11. Agent Management

Agent Management is the new protocol-neutral primary entry point and will replace the legacy A2A management APIs in the future. During the compatibility window, `aiMaintainerService.a2a()` remains available. New users and SDK integrations should prioritize `AgentMaintainerService`, obtained from `aiMaintainerService.agent()`.

`AgentMaintainerService` is not bound to a namespace. Every operation provides an explicit-`namespaceId` form and a convenience overload that uses the default namespace `public`. Request and Command objects do not contain `namespaceId`. There is no separate Agent creation method: the first `createDraft` call creates both Agent metadata and the initial draft Version.

> Note: This chapter uses the new Agent Management models in `com.alibaba.nacos.api.ai.model.agent`. Chapter 7 uses legacy A2A models in `com.alibaba.nacos.api.ai.model.a2a`. The packages contain same-named types such as `AgentVersionDetail`, so verify imports when copying examples.

### 11.1. Get Agent Overview

#### Description

Get Agent metadata together with the first bounded page of Version summaries.

```java
AgentOverview getAgent(String namespaceId, String agentName) throws NacosException;

AgentOverview getAgent(String agentName) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Exact Agent name. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentOverview | Agent overview containing `agent` metadata and the `versionPage` summary page. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentOverview overview = agentMaintainerService.getAgent("public", "demo-agent");
    overview = agentMaintainerService.getAgent("demo-agent");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the request fails.

### 11.2. Update Agent Metadata

#### Description

Completely replace the writable Agent metadata. Presentation fields, tags, extensions, and enabled status are writable; identity, owner, scope, Version content, labels, and the derived catalog are not.

```java
Agent updateAgent(String namespaceId, AgentUpdateRequest request) throws NacosException;

Agent updateAgent(AgentUpdateRequest request) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| request | AgentUpdateRequest | Agent metadata update request. |

`AgentUpdateRequest` has the following fields:

| Name | Type | Description |
|:---|:---|:---|
| agentName | string | Agent name. Required. |
| displayName | string | Display name. |
| description | string | Description. |
| iconUrl | string | Icon URL. |
| provider | AgentProvider | Provider information with `name` and `url`. |
| tags | List\<String> | Agent tags. |
| extensions | Map\<String, Object> | Extension properties. |
| status | string | Writable status. Required; only `enable` or `disable` is accepted. |

#### Response Parameters

| Type | Description |
|:---|:---|
| Agent | Updated Agent. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentUpdateRequest request = new AgentUpdateRequest();
    request.setAgentName("demo-agent");
    request.setDisplayName("Demo Agent");
    request.setDescription("Agent for SDK examples");
    request.setTags(Arrays.asList("demo", "java"));
    request.setStatus("enable");
    Agent agent = agentMaintainerService.updateAgent("public", request);
    // Default-namespace alternative: Agent agent = agentMaintainerService.updateAgent(request);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when parameters are invalid or the update fails.

### 11.3. Delete Agent

#### Description

Delete an Agent definition and all of its Version content. This operation does not delete runtime publications owned by independent Publishers.

```java
void deleteAgent(String namespaceId, String agentName) throws NacosException;

void deleteAgent(String agentName) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Exact Agent name. |

#### Response Parameters

No return value.

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    agentMaintainerService.deleteAgent("public", "demo-agent");
    // Default-namespace alternative: agentMaintainerService.deleteAgent("demo-agent");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when deletion fails.

### 11.4. List Agents with Pagination

#### Description

Filter Agent summaries by name, business tag, scope, and owner, then return stable pagination. The name and single business-tag filters use fuzzy matching.

```java
Page<AgentSummary> listAgents(String namespaceId, String agentName, String bizTag, String scope, String owner, String orderBy, int pageNo, int pageSize) throws NacosException;

Page<AgentSummary> listAgents(String agentName, String bizTag, String scope, String owner, String orderBy, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Optional fuzzy Agent-name filter. |
| bizTag | string | Optional single fuzzy business-tag filter. |
| scope | string | Optional visibility-scope filter. |
| owner | string | Optional owner filter. |
| orderBy | string | Optional order field. The initial contract accepts `download_count`. |
| pageNo | int | Page number. |
| pageSize | int | Number of items per page. |

#### Response Parameters

| Type | Description |
|:---|:---|
| Page\<AgentSummary> | Page of Agent summaries. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    Page<AgentSummary> page = agentMaintainerService.listAgents(
            "public", "demo", "java", "PUBLIC", null, "download_count", 1, 20);
    page = agentMaintainerService.listAgents(
            "demo", "java", "PUBLIC", null, "download_count", 1, 20);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the query fails.

### 11.5. List Agent Versions with Pagination

#### Description

List Version summaries for an Agent, optionally filtered by Version status.

```java
Page<AgentVersionSummary> listAgentVersions(String namespaceId, String agentName, String status, int pageNo, int pageSize) throws NacosException;

Page<AgentVersionSummary> listAgentVersions(String agentName, String status, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Exact Agent name. |
| status | string | Optional Version-status filter. |
| pageNo | int | Page number. |
| pageSize | int | Number of items per page. |

#### Response Parameters

| Type | Description |
|:---|:---|
| Page\<AgentVersionSummary> | Page of Agent Version summaries. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    Page<AgentVersionSummary> page =
            agentMaintainerService.listAgentVersions("public", "demo-agent", "online", 1, 20);
    page = agentMaintainerService.listAgentVersions("demo-agent", null, 1, 20);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the query fails.

### 11.6. Get an Agent Version

#### Description

Get one exact Agent Version definition.

```java
AgentVersionDetail getAgentVersion(String namespaceId, String agentName, String version) throws NacosException;

AgentVersionDetail getAgentVersion(String agentName, String version) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Exact Agent name. |
| version | string | Exact Version. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionDetail | Version detail containing status, `callInterfaces`, author, change description, content digest, and timestamps. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionDetail detail =
            agentMaintainerService.getAgentVersion("public", "demo-agent", "1.0.0");
    detail = agentMaintainerService.getAgentVersion("demo-agent", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the query fails.

### 11.7. Get Agent Runtime Endpoints

#### Description

Get the complete runtime Endpoint snapshot for a protocol, optionally filtered by Agent Version. Omitting `version` returns all bindings for each natural Endpoint key; supplying it retains only matching bindings. The `items` list is empty when no runtime instance exists.

```java
RuntimeEndpointSnapshot getRuntimeEndpoints(String namespaceId, String agentName, String protocol, String version) throws NacosException;

RuntimeEndpointSnapshot getRuntimeEndpoints(String agentName, String protocol, String version) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Exact Agent name. |
| protocol | string | Protocol token. Required. |
| version | string | Optional Agent Version filter. |

#### Response Parameters

| Type | Description |
|:---|:---|
| RuntimeEndpointSnapshot | Runtime snapshot with `namespaceId`, `agentName`, `protocol`, `version`, and Endpoint `items`. |

Each `RuntimeEndpointSnapshotItem` contains an Endpoint, Version bindings, runtime state, enabled and healthy flags, and the last update time.

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    RuntimeEndpointSnapshot snapshot =
            agentMaintainerService.getRuntimeEndpoints("public", "demo-agent", "a2a", "1.0.0");
    snapshot = agentMaintainerService.getRuntimeEndpoints("demo-agent", "a2a", null);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the query fails.

### 11.8. Create Agent Draft

#### Description

Create an initial or subsequent Agent draft. When the Agent does not exist, this is the only creation entry and the request must contain direct `callInterfaces`, not `basedOnVersion`. For an existing Agent, provide either direct `callInterfaces` or one exact `basedOnVersion`, but never both.

```java
AgentVersionDetail createDraft(String namespaceId, AgentDraftCreateRequest request) throws NacosException;

AgentVersionDetail createDraft(AgentDraftCreateRequest request) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| request | AgentDraftCreateRequest | Draft creation request. |

`AgentDraftCreateRequest` has the following fields:

| Name | Type | Description |
|:---|:---|:---|
| agentName | string | Agent name. Required. |
| displayName | string | Optional display name for initial creation. |
| description | string | Optional description for initial creation. |
| iconUrl | string | Optional icon URL for initial creation. |
| provider | AgentProvider | Optional provider for initial creation. |
| tags | List\<String> | Optional tags for initial creation. |
| extensions | Map\<String, Object> | Optional extensions for initial creation. |
| version | string | Exact Version to create. Required. |
| callInterfaces | List\<AgentCallInterface> | Direct Version content; mutually exclusive with `basedOnVersion`. |
| author | string | Version author. |
| changeDescription | string | Version change description. |
| basedOnVersion | string | Exact existing Version to copy; mutually exclusive with `callInterfaces`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionDetail | Created draft detail. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentCallInterface callInterface = new AgentCallInterface();
    callInterface.setProtocol("a2a");
    callInterface.setProtocolVersion("0.3.0");
    callInterface.setDescriptorMediaType("application/json");
    com.alibaba.nacos.api.ai.model.a2a.AgentCard a2aDescriptor =
            new com.alibaba.nacos.api.ai.model.a2a.AgentCard();
    a2aDescriptor.setName("demo-agent");
    a2aDescriptor.setDescription("Agent for SDK examples");
    a2aDescriptor.setUrl("https://example.com/a2a");
    a2aDescriptor.setVersion("1.0.0");
    a2aDescriptor.setProtocolVersion("0.3.0");
    callInterface.setNativeDescriptor(a2aDescriptor);
    callInterface.setEndpointSourceOrder(Collections.singletonList(EndpointSource.RUNTIME));

    AgentDraftCreateRequest request = new AgentDraftCreateRequest();
    request.setAgentName("demo-agent");
    request.setDisplayName("Demo Agent");
    request.setVersion("1.0.0");
    request.setCallInterfaces(Collections.singletonList(callInterface));
    request.setAuthor("nacos");
    request.setChangeDescription("initial version");
    AgentVersionDetail draft = agentMaintainerService.createDraft("public", request);
    // Default-namespace alternative: AgentVersionDetail draft = agentMaintainerService.createDraft(request);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the content source is ambiguous, the Version is invalid, or creation fails.

### 11.9. Update Agent Draft

#### Description

Completely replace the CallInterface content and change description of one exact draft. This operation never creates a missing Agent or Version and does not update Agent metadata.

```java
AgentVersionDetail updateDraft(String namespaceId, AgentDraftUpdateRequest request) throws NacosException;

AgentVersionDetail updateDraft(AgentDraftUpdateRequest request) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| request | AgentDraftUpdateRequest | Draft update request. |

`AgentDraftUpdateRequest` contains required `agentName`, exact `version`, and non-null `callInterfaces`, plus optional `changeDescription`.

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionDetail | Updated draft detail. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentCallInterface callInterface = new AgentCallInterface();
    callInterface.setProtocol("a2a");
    callInterface.setProtocolVersion("0.3.0");
    callInterface.setDescriptorMediaType("application/json");
    com.alibaba.nacos.api.ai.model.a2a.AgentCard a2aDescriptor =
            new com.alibaba.nacos.api.ai.model.a2a.AgentCard();
    a2aDescriptor.setName("demo-agent");
    a2aDescriptor.setDescription("Updated Agent descriptor");
    a2aDescriptor.setUrl("https://example.com/a2a");
    a2aDescriptor.setVersion("1.0.0");
    a2aDescriptor.setProtocolVersion("0.3.0");
    callInterface.setNativeDescriptor(a2aDescriptor);
    callInterface.setEndpointSourceOrder(Collections.singletonList(EndpointSource.RUNTIME));

    AgentDraftUpdateRequest request = new AgentDraftUpdateRequest();
    request.setAgentName("demo-agent");
    request.setVersion("1.0.0");
    request.setCallInterfaces(Collections.singletonList(callInterface));
    request.setChangeDescription("update descriptor");
    AgentVersionDetail draft = agentMaintainerService.updateDraft("public", request);
    // Default-namespace alternative: AgentVersionDetail draft = agentMaintainerService.updateDraft(request);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the target is not a draft, the request is invalid, or the update fails.

### 11.10. Delete Agent Draft

#### Description

Delete one exact Agent draft Version.

```java
void deleteDraft(String namespaceId, String agentName, String version) throws NacosException;

void deleteDraft(String agentName, String version) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| agentName | string | Exact Agent name. |
| version | string | Exact draft Version. |

#### Response Parameters

No return value.

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    agentMaintainerService.deleteDraft("public", "demo-agent", "1.0.0");
    // Default-namespace alternative: agentMaintainerService.deleteDraft("demo-agent", "1.0.0");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when deletion fails.

### 11.11. Submit Agent Version

#### Description

Submit one exact Agent Version for the `draft -> reviewing` transition or the shared no-Pipeline transition.

```java
AgentVersionSummary submit(String namespaceId, AgentVersionCommand command) throws NacosException;

AgentVersionSummary submit(AgentVersionCommand command) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| command | AgentVersionCommand | Version command containing required `agentName` and exact `version`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionSummary | Resulting Version summary. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionCommand command = new AgentVersionCommand();
    command.setAgentName("demo-agent");
    command.setVersion("1.0.0");
    AgentVersionSummary summary = agentMaintainerService.submit("public", command);
    // Default-namespace alternative: AgentVersionSummary summary = agentMaintainerService.submit(command);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the state transition is not allowed or submission fails.

### 11.12. Publish Agent Version

#### Description

Move one exact reviewed Agent Version from `reviewed` to `online`.

```java
AgentVersionSummary publish(String namespaceId, AgentVersionCommand command) throws NacosException;

AgentVersionSummary publish(AgentVersionCommand command) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| command | AgentVersionCommand | Version command containing required `agentName` and exact `version`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionSummary | Online Version summary. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionCommand command = new AgentVersionCommand();
    command.setAgentName("demo-agent");
    command.setVersion("1.0.0");
    AgentVersionSummary summary = agentMaintainerService.publish("public", command);
    // Default-namespace alternative: AgentVersionSummary summary = agentMaintainerService.publish(command);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the Version has not been reviewed or publication fails.

### 11.13. Force-publish Agent Version

#### Description

Bypass the Pipeline with auditing and move one exact Agent Version to `online`.

```java
AgentVersionSummary forcePublish(String namespaceId, AgentVersionCommand command) throws NacosException;

AgentVersionSummary forcePublish(AgentVersionCommand command) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| command | AgentVersionCommand | Version command containing required `agentName` and exact `version`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionSummary | Online Version summary. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionCommand command = new AgentVersionCommand();
    command.setAgentName("demo-agent");
    command.setVersion("1.0.0");
    AgentVersionSummary summary = agentMaintainerService.forcePublish("public", command);
    // Default-namespace alternative: AgentVersionSummary summary = agentMaintainerService.forcePublish(command);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when force publication fails.

### 11.14. Redraft Agent Version

#### Description

Move one exact reviewed Agent Version from `reviewed` back to `draft`.

```java
AgentVersionSummary redraft(String namespaceId, AgentVersionCommand command) throws NacosException;

AgentVersionSummary redraft(AgentVersionCommand command) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| command | AgentVersionCommand | Version command containing required `agentName` and exact `version`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionSummary | Draft Version summary. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionCommand command = new AgentVersionCommand();
    command.setAgentName("demo-agent");
    command.setVersion("1.0.0");
    AgentVersionSummary summary = agentMaintainerService.redraft("public", command);
    // Default-namespace alternative: AgentVersionSummary summary = agentMaintainerService.redraft(command);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the state transition is not allowed or the operation fails.

### 11.15. Bring Agent Version Online

#### Description

Move one exact Agent Version from `offline` to `online`.

```java
AgentVersionSummary online(String namespaceId, AgentVersionCommand command) throws NacosException;

AgentVersionSummary online(AgentVersionCommand command) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| command | AgentVersionCommand | Version command containing required `agentName` and exact `version`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionSummary | Online Version summary. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionCommand command = new AgentVersionCommand();
    command.setAgentName("demo-agent");
    command.setVersion("1.0.0");
    AgentVersionSummary summary = agentMaintainerService.online("public", command);
    // Default-namespace alternative: AgentVersionSummary summary = agentMaintainerService.online(command);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the state transition is not allowed or the operation fails.

### 11.16. Take Agent Version Offline

#### Description

Move one exact Agent Version from `online` to `offline`.

```java
AgentVersionSummary offline(String namespaceId, AgentVersionCommand command) throws NacosException;

AgentVersionSummary offline(AgentVersionCommand command) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| command | AgentVersionCommand | Version command containing required `agentName` and exact `version`. |

#### Response Parameters

| Type | Description |
|:---|:---|
| AgentVersionSummary | Offline Version summary. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentVersionCommand command = new AgentVersionCommand();
    command.setAgentName("demo-agent");
    command.setVersion("1.0.0");
    AgentVersionSummary summary = agentMaintainerService.offline("public", command);
    // Default-namespace alternative: AgentVersionSummary summary = agentMaintainerService.offline(command);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the state transition is not allowed or the operation fails.

### 11.17. Update Agent Custom Labels

#### Description

Completely replace custom Agent Version labels. Label values must target exact Versions. `latest` is server-managed and cannot be updated as a custom label.

```java
Agent updateLabels(String namespaceId, AgentLabelsUpdateRequest request) throws NacosException;

Agent updateLabels(AgentLabelsUpdateRequest request) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| namespaceId | string | Namespace ID. The default is `public` when omitted. |
| request | AgentLabelsUpdateRequest | Labels update request. |

`AgentLabelsUpdateRequest` contains required `agentName` and non-null `labels` (`Map<String, String>`, mapping label names to exact Versions). Pass an empty map to clear all custom labels.

#### Response Parameters

| Type | Description |
|:---|:---|
| Agent | Agent after the label update. |

#### Request Example

```java
try {
    AgentMaintainerService agentMaintainerService = aiMaintainerService.agent();
    AgentLabelsUpdateRequest request = new AgentLabelsUpdateRequest();
    request.setAgentName("demo-agent");
    request.setLabels(Collections.singletonMap("stable", "1.0.0"));
    Agent agent = agentMaintainerService.updateLabels("public", request);
    // Default-namespace alternative: Agent agent = agentMaintainerService.updateLabels(request);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when labels are invalid, a target Version does not exist, or the update fails.

## 12. Pipeline Management

Obtain `PipelineMaintainerService` from `aiMaintainerService.pipeline()`. New code should prefer the typed methods that return `Result`, allowing callers to inspect the server business `code` and `message` explicitly. The legacy `JsonNode` methods remain only for compatibility.

### 12.1. Get Pipeline Execution Detail

#### Description

Get typed Pipeline execution detail by execution ID.

```java
Result<PipelineExecution> getPipelineDetail(String pipelineId) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| pipelineId | string | Pipeline execution ID. |

#### Response Parameters

| Type | Description |
|:---|:---|
| Result<PipelineExecution> | Server result wrapper with `code`, `message`, and `data`. |

`PipelineExecution` contains `executionId`, `resourceType`, `resourceName`, `namespaceId`, `version`, `status`, node results in `pipeline`, `createTime`, and `updateTime`.

#### Request Example

```java
try {
    PipelineMaintainerService pipelineMaintainerService = aiMaintainerService.pipeline();
    Result<PipelineExecution> result =
            pipelineMaintainerService.getPipelineDetail("pipeline-execution-id");
    if (ErrorCode.SUCCESS.getCode().equals(result.getCode())) {
        PipelineExecution execution = result.getData();
    }
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown for transport or HTTP failures such as a connection error, an unparseable response, or an unavailable response body. A business failure in an HTTP 200 response is returned through `Result.code` and `Result.message`.

### 12.2. List Pipeline Executions with Pagination

#### Description

List Pipeline execution records by resource type and optional resource identity filters.

```java
Result<Page<PipelineExecution>> listPipelineExecutions(String resourceType, String resourceName, String namespaceId, String version, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| resourceType | string | Resource type. Required. |
| resourceName | string | Optional resource name. |
| namespaceId | string | Optional namespace ID. |
| version | string | Optional resource Version. |
| pageNo | int | Page number. |
| pageSize | int | Number of items per page. |

#### Response Parameters

| Type | Description |
|:---|:---|
| Result<Page<PipelineExecution>> | Server result wrapper whose `data` is a page of Pipeline executions. |

#### Request Example

```java
try {
    PipelineMaintainerService pipelineMaintainerService = aiMaintainerService.pipeline();
    Result<Page<PipelineExecution>> result =
            pipelineMaintainerService.listPipelineExecutions(
                    "agent", "demo-agent", "public", "1.0.0", 1, 20);
    if (ErrorCode.SUCCESS.getCode().equals(result.getCode())) {
        Page<PipelineExecution> page = result.getData();
    }
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown for transport or HTTP failures. Business failures are returned in `Result`.

### 12.3. Get Pipeline Execution Detail (Compatibility Method)

#### Description

Legacy `JsonNode` accessor for Pipeline execution detail. This method has been deprecated since 3.2.1. New code should use `getPipelineDetail`.

```java
@Deprecated
JsonNode getPipeline(String pipelineId) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| pipelineId | string | Pipeline execution ID. |

#### Response Parameters

| Type | Description |
|:---|:---|
| JsonNode | Pipeline execution `data` JSON from a successful result. |

#### Request Example

```java
try {
    PipelineMaintainerService pipelineMaintainerService = aiMaintainerService.pipeline();
    JsonNode execution = pipelineMaintainerService.getPipeline("pipeline-execution-id");
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the request fails or the server returns a non-success business result.

### 12.4. List Pipeline Executions (Compatibility Method)

#### Description

Legacy `JsonNode` accessor for Pipeline execution pagination. This method has been deprecated since 3.2.1. New code should use `listPipelineExecutions`.

```java
@Deprecated
JsonNode listPipelines(String resourceType, String resourceName, String namespaceId, String version, int pageNo, int pageSize) throws NacosException;
```

#### Request Parameters

| Name | Type | Description |
|:---|:---|:---|
| resourceType | string | Resource type. Required. |
| resourceName | string | Optional resource name. |
| namespaceId | string | Optional namespace ID. |
| version | string | Optional resource Version. |
| pageNo | int | Page number. |
| pageSize | int | Number of items per page. |

#### Response Parameters

| Type | Description |
|:---|:---|
| JsonNode | Pipeline execution page `data` JSON from a successful result. |

#### Request Example

```java
try {
    PipelineMaintainerService pipelineMaintainerService = aiMaintainerService.pipeline();
    JsonNode page = pipelineMaintainerService.listPipelines(
            "agent", "demo-agent", "public", "1.0.0", 1, 20);
} catch (NacosException e) {
    e.printStackTrace();
}
```

#### Exception Description

A `NacosException` is thrown when the request fails or the server returns a non-success business result.
