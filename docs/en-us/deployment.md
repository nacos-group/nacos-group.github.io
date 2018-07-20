# Nacos支持三种部署模式

* 单机模式 - 用于测试和单机试用。
* 集群模式 - 用于生产环境，确保高可用。
* 多集群模式 - 用于多数据中心场景。


## 单机模式下运行Nacos
### Linux/Unix/Mac
* Standalone means it is non-cluster Mode. * 
sh startup.sh -m standalone

### Windows

cmd startup.cmd 
或者双击 startup.cmd 文件

## 集群模式下运行Nacos

### Linux/Unix/Mac
sh startup.sh

## Deploy Nacos in Multi-Cluster Mode

Nacos支持NameServer路由请求模式，通过它您可以设计一个有用的映射规则来控制请求转发到相应的集群，在映射规则中您可以按命名空间或租户等分片请求...

### TODO
