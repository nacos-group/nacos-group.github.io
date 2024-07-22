---
title: 参数校验
keywords: [参数校验,使用规则]
description: 参数校验
date: 2023-10-24
sidebar:
    order: 4
---

> 该文档即将废弃，推荐查看[用户手册-参数校验](../../manual/user/parameters-check.md)。

# 参数校验

2.3.0版本之前的Nacos的参数校验逻辑分散，由各类请求的处理方法单独进行校验，难以更改维护，经常出现参数校验的遗漏，参数校验的规则也没有明确统一；这使得用户使用时经常会因为一些特殊字符导致功能不符合预期或出现漏洞，甚至导致大量推送，导致带宽打满，内存占用过多，导致应用出现故障。

在2.3.0版本中，Nacos明确了参数校验规则，在服务端实现了统一的参数校验逻辑并添加了参数校验层，根据校验规则对客户端向服务端发送的请求进行校验。

用户可以选择开启参数校验功能，开启后Nacos将会对客户端向服务端发送的请求中的部分参数进行参数校验，确保参数的合法性，避免由于错误使用，导致的不符合预期以及性能问题。

## 参数校验开关

### 服务端

服务端的参数校验功能**默认开启**，用户可以通过设置`${nacos.home}/conf`目录下的`application.properties`文件中的`nacos.core.param.check.enabled`值选择开启或者关闭服务端参数校验功能。

`nacos.core.param.check.enabled=true`时开启Nacos服务端参数校验，`false`关闭服务端参数校验

### 客户端

待实现

## 参数校验规则

开启参数校验后OpenAPI文档 和 SDK文档中的所有接口中的相关参数都会接受格式校验，现对相关参数以及校验规则进行说明：

|参数描述|最大字符长度|校验规则|
|-----|-----|-----|
|命名空间名称|256|禁止`@#$%^&*`，对应正则表达式：`[^@#$%^&*]+$`|
|命名空间ID|64|只允许字母数字下划线以及"-"字符，对应正则表达式：`^[\w-]+`｜
|配置名称|256|只允许字母数字以及`_-.:`，对应正则表达式：`^[a-zA-Z0-9-_:\.]*$`|
|服务名称|512|禁止中文和`@@`且禁止以`@`开头，禁止空白字符，对应正则表达式`^(?!@).((?!@@)[^\u4E00-\u9FA5])*$`|
|分组名称|128|只允许字母数字以及`_-.:`，对应正则表达式：`^[a-zA-Z0-9-_:\.]*$`|
|集群名称|64|只允许数字字母和`-_`，对应正则表达式`^[0-9a-zA-Z-_]+$`|
|IP地址|128|禁止中文字符和空白字符，对应正则表达式为`^[^\u4E00-\u9FA5]*$`|
|端口号|-|取值范围为`0～65535`|
|实例元数据|1024|字段名加字段值的总长度小于1024个字符|

### 1. namespaceShowName

#### 参数描述

命名空间名称

#### 校验规则

字符长度最大为256，禁止`@#$%^&*`,对应正则表达式：`[^@#$%^&*]+$`

#### OpenAPI示例

- [命名空间](./open-api.md)

#### 校验失败报错信息

- 超出长度：`Param 'namespaceShowName' is illegal, the param length should not exceed 256.`
- 非法字符：`Param 'namespaceShowName' is illegal, illegal characters should not appear in the param.`

### 2. namespaceId/tenant/namespace

#### 参数描述

命名空间ID（租户空间）

#### 校验规则

字符长度最大为64，只允许字母数字下划线以及"-"字符，对应正则表达式：`^[\w-]+`

#### OpenAPI示例

- [获取配置](./open-api.md)
- [注册实例](./open-api.md)

#### 校验失败报错信息

- 超出长度：`Param 'namespaceId/tenant' is illegal, the param length should not exceed 64.`
- 非法字符：`Param 'namespaceId/tenant' is illegal, illegal characters should not appear in the param.`

### 3. dataId

#### 参数描述

配置名称

#### 校验规则

字符长度最大为256，只允许字母数字以及`_-.:`，对应正则表达式：`^[a-zA-Z0-9-_:\.]*$`

#### OpenAPI示例

[发布配置](./open-api.md)

#### Java SDK示例

监听配置：`public void addListener(String dataId, String group, Listener listener) `

#### 校验失败报错信息

- 超出长度：`Param 'dataId' is illegal, the param length should not exceed 512.`
- 非法字符：`Param 'dataId' is illegal, illegal characters should not appear in the param.`

### 4. service/serviceName

#### 参数描述

服务名称

#### 校验规则

字符长度最大为512，禁止中文和`@@`且禁止以`@`开头，对应正则表达式`^(?!@).((?!@@)[^\u4E00-\u9FA5])*$`

#### OpenAPI示例

[注册实例](./open-api.md)

#### Java SDK示例

注册实例：`void registerInstance(String serviceName, String ip, int port) throws NacosException; `

#### 校验失败报错信息

- 超出长度：`Param 'serviceName' is illegal, the param length should not exceed 512.`
- 非法字符：`Param 'serviceName' is illegal, illegal characters should not appear in the param.`

### 5. group/groupName

#### 参数描述

分组名称

#### 校验规则

字符长度最大为128，只允许字母数字以及`_-.:`，对应正则表达式：`^[a-zA-Z0-9-_:\.]*$`

#### OpenAPI示例

[查询实例列表](./open-api.md)

#### Java SDK示例

删除配置：`public boolean removeConfig(String dataId, String group) throws NacosException `

#### 校验失败报错信息

- 超出长度：`Param 'group' is illegal, the param length should not exceed 512.`
- 非法字符：`Param 'group' is illegal, illegal characters should not appear in the param.`

### 6. cluster/clusterName

#### 参数描述

集群名称

#### 校验规则

字符长度最大为64，只允许数字字母和`-_`，对应正则表达式`^[0-9a-zA-Z-_]+$`

#### OpenAPI示例

[更新实例](./open-api.md)

#### Java SDK示例

获取全部实例：`List<Instance> getAllInstances(String serviceName, List<String> clusters) throws NacosException;`

#### 校验失败报错信息

- 超出长度：`Param 'cluster' is illegal, the param length should not exceed 64.`
- 非法字符：`Param 'cluster' is illegal, illegal characters should not appear in the param.`

### 7. ip

#### 参数描述

IP地址

#### 校验规则

字符长度最大为128，禁止中文字符，对应正则表达式为`^[^\u4E00-\u9FA5]*$`

#### OpenAPI示例

[查询指定服务的实例列表](./open-api.md)

#### Java SDK示例

注销实例：`void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;`

#### 校验失败报错信息

- 超出长度：`Param 'ip' is illegal, the param length should not exceed 128.`
- 非法字符：`Param 'ip' is illegal, illegal characters should not appear in the param.`

### 8. port

#### 参数描述

端口号

#### 校验规则

取值范围为0～65535

#### OpenAPI示例

[更新实例](./open-api.md)

#### Java SDK示例

注销实例：`void deregisterInstance(String serviceName, String ip, int port, String clusterName) throws NacosException;`

#### 校验失败报错信息

端口取值超出范围：`Param 'port' is illegal, the value should be between 0 and 65535`

### 9. metadata

#### 参数描述

实例元数据

#### 校验规则

字段名加字段值的总长度小于1024个字符

#### OpenAPI示例

[更新实例](./open-api.md)

#### Java SDK示例

注册实例：`void registerInstance(String serviceName, Instance instance) throws NacosException;`

#### 校验失败报错信息

实例总长度超出范围：`Param 'Metadata' is illegal, the param length should not exceed %d.`