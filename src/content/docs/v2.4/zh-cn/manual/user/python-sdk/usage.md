---
title: Python SDK 使用手册
keywords: [Python,SDK,使用手册]
description: 本文档介绍了Nacos的Python SDK(nacos-sdk-python)的使用方式
sidebar:
    order: 6
---

# Nacos Python SDK 使用手册


### 支持 Python 版本

- Python 2.7
- Python 3.6+

### 支持 Nacos 服务端版本
- Nacos 0.8.0+
- Nacos 1.x
- Nacos 2.x with http protocol


## 安装依赖
```shell
pip install nacos-sdk-python
```

## 开始
```python
import nacos

# Both HTTP/HTTPS protocols are supported, if not set protocol prefix default is HTTP, and HTTPS with no ssl check(verify=False)
# "192.168.3.4:8848" or "https://192.168.3.4:443" or "http://192.168.3.4:8848,192.168.3.5:8848" or "https://192.168.3.4:443,https://192.168.3.5:443"
SERVER_ADDRESSES = "server addresses split by comma"
NAMESPACE = "namespace id"

# no auth mode
client = nacos.NacosClient(SERVER_ADDRESSES, namespace=NAMESPACE)
# auth mode
#client = nacos.NacosClient(SERVER_ADDRESSES, namespace=NAMESPACE, ak="{ak}", sk="{sk}")

# get config
data_id = "config.nacos"
group = "group"
print(client.get_config(data_id, group))
```

## 客户端配置
```
client = NacosClient(server_addresses, namespace=your_ns, ak=your_ak, sk=your_sk)
```

* *server_addresses* - **required**  - Nacos server address, comma separated if more than 1.
* *namespace* - Namespace. | default: `None`
* *ak* - The accessKey to authenticate. | default: null
* *sk* - The secretKey to authentication. | default: null
* *log_level* - Log level. | default: null
* *log_rotation_backup_count* - The number of log files to keep. | default: `7`

#### 额外配置
Extra option can be set by `set_options`, as following:

```
client.set_options({key}={value})
# client.set_options(proxies={"http":"192.168.3.50:809"})
```

Configurable options are:

* *default_timeout* - Default timeout for get config from server in seconds.
* *pulling_timeout* - Long polling timeout in seconds.
* *pulling_config_size* - Max config items number listened by one polling process.
* *callback_thread_num* - Concurrency for invoking callback.
* *failover_base* - Dir to store failover config files.
* *snapshot_base* - Dir to store snapshot config files.
* *no_snapshot* - To disable default snapshot behavior, this can be overridden by param *no_snapshot* in *get* method.
* *proxies* - Dict proxy mapping, some environments require proxy access, so you can set this parameter, this way http requests go through the proxy.

## API 列表
 
### 获取配置
>`NacosClient.get_config(data_id, group, timeout, no_snapshot)`

* `param` *data_id* Data id.
* `param` *group* Group, use `DEFAULT_GROUP` if no group specified.
* `param` *timeout* Timeout for requesting server in seconds.
* `param` *no_snapshot* Whether to use local snapshot while server is unavailable.
* `return` 
W
Get value of one config item following priority:

* Step 1 - Get from local failover dir(default: `${cwd}/nacos-data/data`).
  * Failover dir can be manually copied from snapshot dir(default: `${cwd}/nacos-data/snapshot`) in advance.
  * This helps to suppress the effect of known server failure.
    
* Step 2 - Get from one server until value is got or all servers tried.
  * Content will be save to snapshot dir after got from server.

* Step 3 - Get from snapshot dir.

### 增加配置监听
>`NacosClient.add_config_watchers(data_id, group, cb_list)`

* `param` *data_id* Data id.
* `param` *group* Group, use `DEFAULT_GROUP` if no group specified.
* `param` *cb_list* List of callback functions to add.
* `return`

Add watchers to a specified config item.
* Once changes or deletion of the item happened, callback functions will be invoked.
* If the item is already exists in server, callback functions will be invoked for once.
* Multiple callbacks on one item is allowed and all callback functions are invoked concurrently by `threading.Thread`.
* Callback functions are invoked from current process.

### 移除配置监听
>`NacosClient.remove_config_watcher(data_id, group, cb, remove_all)`

* `param` *data_id* Data id.
* `param` *group* Group, use "DEFAULT_GROUP" if no group specified.
* `param` *cb* Callback function to delete.
* `param` *remove_all* Whether to remove all occurrence of the callback or just once.
* `return`

Remove watcher from specified key.

### 发布配置
>`NacosClient.publish_config(data_id, group, content, timeout)`

* `param` *data_id* Data id.
* `param` *group* Group, use "DEFAULT_GROUP" if no group specified.
* `param` *content* Config value.
* `param` *timeout* Timeout for requesting server in seconds.
* `return` True if success or an exception will be raised.

Publish one data item to Nacos.
* If the data key is not exist, create one first.
* If the data key is exist, update to the content specified.
* Content can not be set to None, if there is need to delete config item, use function **remove** instead.

### 删除配置
>`NacosClient.remove_config(data_id, group, timeout)`
* `param` *data_id* Data id.
* `param` *group* Group, use "DEFAULT_GROUP" if no group specified.
* `param` *timeout* Timeout for requesting server in seconds.
* `return` True if success or an exception will be raised.

Remove one data item from Nacos.

### 服务实例注册
>`NacosClient.add_naming_instance(service_name, ip, port, cluster_name, weight, metadata, enable, healthy,ephemeral,group_name,heartbeat_interval)`
* `param` *service_name*  **required** Service name to register to.
* `param` *ip*  **required** IP of the instance.
* `param` *port* **required** Port of the instance.
* `param` *cluster_name* Cluster to register to.
* `param` *weight* A float number for load balancing weight.
* `param` *metadata* Extra info in JSON string format or dict format
* `param` *enable* A bool value to determine whether instance is enabled or not.
* `param` *healthy* A bool value to determine whether instance is healthy or not.
* `param` *ephemeral* A bool value to determine whether instance is ephemeral or not.
* `param` *heartbeat_interval* Auto daemon heartbeat interval in seconds.
* `return` True if success or an exception will be raised.

### 服务实例取消注册
>`NacosClient.remove_naming_instance(service_name, ip, port, cluster_name)`
* `param` *service_name*  **required** Service name to deregister from.
* `param` *ip*  **required** IP of the instance.
* `param` *port* **required** Port of the instance.
* `param` *cluster_name* Cluster to deregister from.
* `param` *ephemeral* A bool value to determine whether instance is ephemeral or not.
* `return` True if success or an exception will be raised.

### 修改服务实例
>`NacosClient.modify_naming_instance(service_name, ip, port, cluster_name, weight, metadata, enable)`
* `param` *service_name*  **required** Service name.
* `param` *ip*  **required** IP of the instance.
* `param` *port* **required** Port of the instance.
* `param` *cluster_name* Cluster name.
* `param` *weight* A float number for load balancing weight.
* `param` *metadata* Extra info in JSON string format or dict format.
* `param` *enable* A bool value to determine whether instance is enabled or not.
* `param` *ephemeral* A bool value to determine whether instance is ephemeral or not.
* `return` True if success or an exception will be raised.

### 查询服务实例列表
>`NacosClient.list_naming_instance(service_name, clusters, namespace_id, group_name, healthy_only)`
* `param` *service_name*  **required** Service name to query.
* `param` *clusters* Cluster names separated by comma.
* `param` *namespace_id* Customized group name, default `blank`.
* `param` *group_name* Customized group name , default `DEFAULT_GROUP`.
* `param` *healthy_only* A bool value for querying healthy instances or not.
* `return` Instance info list if success or an exception will be raised.

### 查询服务实例详情
>`NacosClient.get_naming_instance(service_name, ip, port, cluster_name)`
* `param` *service_name*  **required** Service name.
* `param` *ip*  **required** IP of the instance.
* `param` *port* **required** Port of the instance.
* `param` *cluster_name* Cluster name.
* `return` Instance info if success or an exception will be raised.

### 主动发送心跳
>`NacosClient.send_heartbeat(service_name, ip, port, cluster_name, weight, metadata)`
* `param` *service_name*  **required** Service name.
* `param` *ip*  **required** IP of the instance.
* `param` *port* **required** Port of the instance.
* `param` *cluster_name* Cluster to register to.
* `param` *weight* A float number for load balancing weight.
* `param` *ephemeral* A bool value to determine whether instance is ephemeral or not.
* `param` *metadata* Extra info in JSON string format or dict format.
* `return` A JSON object include server recommended beat interval if success or an exception will be raised.

### 服务实例监听
>`NacosClient.subscribe(listener_fn, listener_interval=7, *args, **kwargs)`
* `param` *listener_fn*  **required** Customized listener function.
* `param` *listener_interval*  Listen interval , default 7 second.
* `param` *service_name*  **required** Service name which subscribes.
* `param` *clusters* Cluster names separated by comma.
* `param` *namespace_id* Customized group name, default `blank`.
* `param` *group_name* Customized group name , default `DEFAULT_GROUP`.
* `param` *healthy_only* A bool value for querying healthy instances or not.
* `return`

### 服务实例取消监听
>`NacosClient.unsubscribe(service_name, listener_name)`
* `param` *service_name*  **required** Service name to subscribed.
* `param` *listener_name*  listener_name which is customized.
* `return`

### 停止所有服务监听 
>`NacosClient.stop_subscribe()`
* `return`

## 调试模式
Debugging mode if useful for getting more detailed log on console.

Debugging mode can be set by:
```
client = nacos.NacosClient(SERVER_ADDRESSES, namespace=NAMESPACE, username=USERNAME, password=PASSWORD,log_level="DEBUG")
```