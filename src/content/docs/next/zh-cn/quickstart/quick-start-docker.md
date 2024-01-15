---
title: Nacos Docker 快速开始
keywords: [Nacos,Docker]
description: Nacos Docker 快速开始
sidebar:
    order: 2
---

# Nacos Docker 快速开始

## 操作步骤

* Clone 项目

  ```powershell
  git clone https://github.com/nacos-group/nacos-docker.git
  cd nacos-docker
  ```


* 单机模式 Derby

  ```powershell
  docker-compose -f example/standalone-derby.yaml up
  ```

* 单机模式 MySQL

 如果希望使用MySQL5.7

  ```powershell
  docker-compose -f example/standalone-mysql-5.7.yaml up
  ```

 如果希望使用MySQL8

  ```powershell
  docker-compose -f example/standalone-mysql-8.yaml up
  ```

* 集群模式

  ```powershell
  docker-compose -f example/cluster-hostname.yaml up 
  ```

* 服务注册

  ```powershell
  curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
  ```
  
* 服务发现

    ```powershell
    curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
    ```
    
* 发布配置

  ```powershell
  curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```
  
* 获取配置

  ```powershell
    curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```
* Nacos 控制台

  link：http://127.0.0.1:8848/nacos/

## Common property configuration 

| 属性名称                          | 描述                                                         | 选项                              |
| --------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| MODE                              | 系统启动方式: 集群/单机                                      | cluster/standalone默认 **cluster**  |
| NACOS_SERVERS                     | 集群地址                                   | p1:port1空格ip2:port2 空格ip3:port3 |
| PREFER_HOST_MODE                  | 支持IP还是域名模式                                           | hostname/ip 默认 **ip**             |
| NACOS_SERVER_PORT                 | Nacos 运行端口                                               | 默认 **8848**                       |
| NACOS_SERVER_IP                   | 多网卡模式下可以指定IP                                       |                                     |
| SPRING_DATASOURCE_PLATFORM        | 单机模式下支持MYSQL数据库                        | mysql / 空 默认:空                 |
| MYSQL_SERVICE_HOST                | 数据库 连接地址                                                |                                     |
| MYSQL_SERVICE_PORT                | 数据库端口                                       | 默认 : **3306**                  |
| MYSQL_SERVICE_DB_NAME             | 数据库库名                                     |                                     |
| MYSQL_SERVICE_USER                | 数据库用户名                                  |                                     |
| MYSQL_SERVICE_PASSWORD            | 数据库用户密码                                    |                                     |
| MYSQL_SERVICE_DB_PARAM          | 数据库连接参数                                     | default : **characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false** |
| MYSQL_DATABASE_NUM                | 数据库编号                          | 默认 :**1**                    |
| JVM_XMS                           | -Xms                                                         | 默认 :1g                       |
| JVM_XMX                           | -Xmx                                                         | 默认 :1g                       |
| JVM_XMN                           | -Xmn                                                         | 默认 :512m                       |
| JVM_MS                            | -XX:MetaspaceSize                                            | 默认 :128m                     |
| JVM_MMS                           | -XX:MaxMetaspaceSize                                         | 默认 :320m                     |
| NACOS_DEBUG                       | 是否开启远程DEBUG                                 | y/n 默认 :n                      |
| TOMCAT_ACCESSLOG_ENABLED          | server.tomcat.accesslog.enabled                              | 默认 :false                      |
| NACOS_AUTH_SYSTEM_TYPE      |  权限系统类型选择,目前只支持nacos类型       | 默认 :nacos                          |
| NACOS_AUTH_ENABLE      |  是否开启权限系统       | 默认 :false                          |
| NACOS_AUTH_TOKEN_EXPIRE_SECONDS      |  token 失效时间        | 默认 :18000                          |
| NACOS_AUTH_TOKEN      |  token       | 默认 :SecretKey012345678901234567890123456789012345678901234567890123456789                          |
| NACOS_AUTH_CACHE_ENABLE      |  权限缓存开关 ,开启后权限缓存的更新默认有15秒的延迟      | 默认 : false                          |
| MEMBER_LIST | 通过环境变量的方式设置集群地址 | 例子:192.168.16.101:8847?raft_port=8807,192.168.16.101?raft_port=8808,192.168.16.101:8849?raft_port=8809 |
| EMBEDDED_STORAGE | 是否开启集群嵌入式存储模式 | `embedded`  默认 : none |
| NACOS_AUTH_CACHE_ENABLE      |    nacos.core.auth.caching.enabled      |  default : false                          |
| NACOS_AUTH_USER_AGENT_AUTH_WHITE_ENABLE      |    nacos.core.auth.enable.userAgentAuthWhite      |  default : false                          |
| NACOS_AUTH_IDENTITY_KEY      |    nacos.core.auth.server.identity.key      |  default : serverIdentity                          |
| NACOS_AUTH_IDENTITY_VALUE      |    nacos.core.auth.server.identity.value      |  default : security                          |
| NACOS_SECURITY_IGNORE_URLS      |    nacos.security.ignore.urls      |  default : `/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**`                          |


## Nacos + Grafana + Prometheus
参考：[Nacos监控指南](../guide/admin/monitor-guide.md)

**Note**:  grafana创建一个新数据源时，数据源地址必须是 **http://prometheus:9090**

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
