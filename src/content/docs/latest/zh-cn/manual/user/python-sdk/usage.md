---
title: Python SDK 使用手册
keywords: [Python,SDK,使用手册]
description: 本文档介绍了Nacos的Python SDK(nacos-sdk-python)的使用方式
sidebar:
    order: 6
---

# Python SDK 使用手册


### 支持 Python 版本
- Python 3.7+

### 支持 Nacos 服务端版本
- Nacos 2.x


## 安装依赖
```shell
pip install nacos-sdk-python
```

## 开始
```python
from v2.nacos import NacosNamingService, ClientConfigBuilder, GRPCConfig, Instance, SubscribeServiceParam, \
    RegisterInstanceParam, DeregisterInstanceParam, BatchRegisterInstanceParam, GetServiceParam, ListServiceParam, \
    ListInstanceParam, NacosConfigService, ConfigParam
    
client_config = (ClientConfigBuilder()
                 .access_key(os.getenv('NACOS_ACCESS_KEY'))
                 .secret_key(os.getenv('NACOS_SECRET_KEY'))
                 .server_address(os.getenv('NACOS_SERVER_ADDR', 'localhost:8848'))
                 .log_level('INFO')
                 .grpc_config(GRPCConfig(grpc_timeout=5000))
                 .build())
```
### 参数说明
* *server_address* - **必填**  - Nacos 服务端地址
* *access_key* - 阿里云访问密钥ID
* *secret_key* - 阿里云访问密钥
* *credentials_provider* - 自定义访问密钥管理器
* *username* - 认证用户名
* *password* - 认证密码
* *log_level* - 日志级别 | 默认: `logging.INFO`
* *cache_dir* - 缓存目录路径 | 默认: `~/nacos/cache`
* *log_dir* - 日志目录路径 | 默认: `~/logs/nacos`
* *namespace_id* - 命名空间ID | 默认: 空字符串
* *grpc_config* - gRPC配置
  * *max_receive_message_length* - 最大接收消息长度 | 默认: 100 * 1024 * 1024
  * *max_keep_alive_ms* - 最大连接保活时间 | 默认: 60 * 1000
  * *initial_window_size* - 初始窗口大小 | 默认: 10 * 1024 * 1024
  * *initial_conn_window_size* - 初始连接窗口大小 | 默认: 10 * 1024 * 1024
  * *grpc_timeout* - gRPC超时时间(毫秒) | 默认: 3000
* *tls_config* - TLS配置
  * *enabled* - 是否启用TLS
  * *ca_file* - CA证书文件路径
  * *cert_file* - 客户端证书文件路径
  * *key_file* - 客户端私钥文件路径
* *kms_config* - 阿里云KMS配置
  * *enabled* - 是否启用阿里云KMS
  * *endpoint* - 阿里云KMS服务地址
  * *access_key* - 阿里云访问密钥ID
  * *secret_key* - 阿里云访问密钥
  * *password* - 阿里云KMS密码

## 配置中心 API 列表

### 初始化客户端

```python
config_client = await NacosConfigService.create_config_service(client_config)
```
 
### 获取配置

```python
content = await config_client.get_config(ConfigParam(
            data_id=data_id,
            group=group
        ))
```

* `param` *data_id* 配置的Data ID
* `param` *group* 配置分组名称，默认为`DEFAULT_GROUP`
* `return` 成功返回配置内容，失败抛出异常

获取配置项的优先级策略：

* 步骤1 - 从本地failover目录读取
* 步骤2 - 从服务端逐个尝试获取
  * 成功获取后保存到快照目录
* 步骤3 - 从快照目录读取

### 监听配置

```
async def config_listener(tenant, data_id, group, content):
    print("listen, tenant:{} data_id:{} group:{} content:{}".format(tenant, data_id, group, content))

await config_client.add_listener(data_id=data_id, group=group, listener=config_listener)
```

* `param` *data_id* 配置DataID
* `param` *group* 分组名称，默认`DEFAULT_GROUP`
* `listener` *listener* 配置监听回调函数，由命名空间ID、分组、DataID和内容定义
* `return`

监听特定配置
- 配置变更或删除时触发回调
- 若配置已存在则立即触发一次回调
- 回调在当前进程执行

### 取消监听

```
await client.remove_listener(data_id=dataID, group=groupName, listener=config_listener)
```

* `param` *data_id* 配置DataID
* `param` *group* 分组名称，默认`DEFAULT_GROUP`
* `listener` *listener* 配置监听回调函数，由命名空间ID、分组、DataID和内容定义
* `return` 成功返回True，失败抛出异常

移除指定配置的监听回调

### 发布配置

```
res = await client.publish_config(ConfigParam(
            data_id=dataID,
            group=groupName,
            content="Hello world")
        )
```

* `param` *data_id* 配置DataID
* `param` *group* 分组名称，默认`DEFAULT_GROUP`
* `param` *content* 配置内容
* `return` 成功返回True，失败抛出异常

向Nacos发布配置：
- 若配置不存在则创建
- 若存在则更新内容
- 删除配置请使用remove方法

### 删除配置

```
res = await client.remove_config(ConfigParam(
            data_id=dataID,
            group=groupName
        ))
```
* `param` *ConfigParam* 配置参数，需指定data_id和group
* `return` 成功返回True，失败抛出异常

从Nacos删除配置项

### 销毁配置中心连接

```
await client.shutdown()
```

## 注册中心 API 列表

### 初始化客户端

```python
naming_client = await NacosNamingService.create_naming_service(client_config)
```

### 服务实例注册
```python
response = await client.register_instance(
            request=RegisterInstanceParam(service_name='nacos.test.1', group_name='DEFAULT_GROUP', ip='1.1.1.1',
                port=7001, weight=1.0, cluster_name='c1', metadata={'a': 'b'},
                enabled=True,
                healthy=True, ephemeral=True))
```
* `param` *service_name*  **必填** 服务名称
* `param` *group_name* 分组名称
* `param` *ip*  **必填** 实例IP
* `param` *port* **必填** 实例端口
* `param` *cluster_name* 集群名称
* `param` *weight* 负载权重（浮点数）
* `param` *metadata* 元数据（JSON字符串或字典格式）
* `param` *enable* 实例是否启用
* `param` *healthy* 实例健康状态
* `param` *ephemeral* 是否为临时实例
* `return` 成功返回True，失败抛出异常

### 批量注册实例

```python
param1 = RegisterInstanceParam(service_name='nacos.test.1',
                                       group_name='DEFAULT_GROUP',
                                       ip='1.1.1.1',
                                       port=7001,
                                       weight=1.0,
                                       cluster_name='c1',
                                       metadata={'a': 'b'},
                                       enabled=True,
                                       healthy=True,
                                       ephemeral=True
                                       )
param2 = RegisterInstanceParam(service_name='nacos.test.1',
                               group_name='DEFAULT_GROUP',
                               ip='1.1.1.1',
                               port=7002,
                               weight=1.0,
                               cluster_name='c1',
                               metadata={'a': 'b'},
                               enabled=True,
                               healthy=True,
                               ephemeral=True
                               )
param3 = RegisterInstanceParam(service_name='nacos.test.1',
                               group_name='DEFAULT_GROUP',
                               ip='1.1.1.1',
                               port=7003,
                               weight=1.0,
                               cluster_name='c1',
                               metadata={'a': 'b'},
                               enabled=True,
                               healthy=False,
                               ephemeral=True
                               )
response = await client.batch_register_instances(
    request=BatchRegisterInstanceParam(service_name='nacos.test.1', group_name='DEFAULT_GROUP',
                                       instances=[param1, param2, param3]))
```
* `param` *service_name*  **必填** 服务名称
* `param` *group_name* 分组名称
* `param` *ip*  **必填** 实例IP
* `param` *port* **必填** 实例端口
* `param` *cluster_name* 集群名称
* `param` *weight* 负载权重（浮点数）
* `param` *metadata* 元数据（JSON字符串或字典格式）
* `param` *enable* 实例是否启用
* `param` *healthy* 实例健康状态
* `param` *ephemeral* 是否为临时实例
* `return` 成功返回True，失败抛出异常

### 注销服务实例
```python
response = await client.deregister_instance(
          request=DeregisterInstanceParam(service_name='nacos.test.1', group_name='DEFAULT_GROUP', ip='1.1.1.1',
                                          port=7001, cluster_name='c1', ephemeral=True)
      )
```
* `param` *service_name*  **必填** 服务名称
* `param` *group_name* 分组名称
* `param` *ip*  **必填** 实例IP
* `param` *port* **必填** 实例端口
* `param` *cluster_name* 集群名称
* `param` *ephemeral* 是否为临时实例
* `return` 成功返回True，失败抛出异常

### 更新服务实例
```python
response = await client.update_instance(
            request=RegisterInstanceParam(service_name='nacos.test.1', group_name='DEFAULT_GROUP', ip='1.1.1.1',
                                          port=7001, weight=2.0, cluster_name='c1', metadata={'a': 'b'},
                                          enabled=True,
                                          healthy=True, ephemeral=True))
```
* `param` *service_name*  **必填** 服务名称
* `param` *group_name* 分组名称
* `param` *ip*  **必填** 实例IP
* `param` *port* **必填** 实例端口
* `param` *cluster_name* 集群名称
* `param` *weight* 负载权重（浮点数）
* `param` *metadata* 元数据（JSON字符串或字典格式）
* `param` *enable* 实例是否启用
* `param` *ephemeral* 是否为临时实例
* `return` 成功返回True，失败抛出异常

### 查询服务列表
```python

service_list = await naming_client.list_services(ListServiceParam(
            namespace_id="public",
            group_name="DEFAULT_GROUP"
    ))

```

* `param` *namespace_id* 命名空间ID
* `param` *group_name* 分组名称
* `return` 服务列表

### 查询服务实例列表
```python
instance_list = await naming_client.list_instances(ListInstanceParam(
        service_name="nacos.test.1",
        group_name="DEFAULT_GROUP",
        healthy_only=True,
        subscribe=True,
        clusters=["CLUSTERA"]
    ))
```
* `param` *service_name*  **必填** 服务名称
* `param` *group_name* 分组名称
* `param` *clusters* 集群名称列表
* `param` *group_name* 自定义分组名称，默认`DEFAULT_GROUP`
* `param` *healthy_only* 是否仅查询健康实例
* `param` *subscribe* 是否订阅该服务
* `return` 实例信息列表或异常

### 监听服务
```python
async def cb(instance_list: List[Instance]):
  print('received subscribe callback', str(instance_list))

await client.subscribe(
  SubscribeServiceParam(service_name='nacos.test.1', group_name='DEFAULT_GROUP', subscribe_callback=cb))
```
* `param` *service_name*  **必填** 服务名称
* `param` *clusters* 集群名称列表
* `param` *group_name* 自定义分组名称，默认`DEFAULT_GROUP`
* `param` *subscribe_callback* 服务变更时的回调函数


### 取消监听服务
```python
async def cb(instance_list: List[Instance]):
  print('received subscribe callback', str(instance_list))

await client.unsubscribe(
            SubscribeServiceParam(service_name='nacos.test.1', group_name='DEFAULT_GROUP', subscribe_callback=cb))
```
* `param` *service_name*  **必填** 服务名称
* `param` *clusters* 集群名称列表
* `param` *group_name* 自定义分组名称，默认`DEFAULT_GROUP`
* `param` *subscribe_callback* 需取消订阅的回调函数