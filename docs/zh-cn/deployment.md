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

### 单机模式支持mysql
在0.7版本之前，在单机模式时nacos使用嵌入式数据库实现数据的存储，不方便观察数据存储的基本情况。0.7版本增加了支持mysql数据源能力，具体的操作步骤：

- 1.安装数据库，版本要求：5.6.5+
- 2.初始化mysql数据库，数据库初始化文件：nacos-mysql.sql
- 3.修改conf/application.properties文件，增加支持mysql数据源配置（目前只支持mysql），添加mysql数据源的url、用户名和密码。

```
spring.datasource.platform=mysql

db.num=1
db.url.0=jdbc:mysql://11.162.196.16:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=nacos_devtest
db.password=youdontknow
```

再以单机模式启动nacos，nacos所有写嵌入式数据库的数据都写到了mysql

## 集群模式下运行Nacos
[集群模式下运行Nacos](https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html)

## 多集群模式

Nacos支持NameServer路由请求模式，通过它您可以设计一个有用的映射规则来控制请求转发到相应的集群，在映射规则中您可以按命名空间或租户等分片请求...

