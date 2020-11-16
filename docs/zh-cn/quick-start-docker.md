---
title: Nacos Docker 快速开始
keywords: Nacos,Docker
description: Nacos Docker 快速开始
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

| name                          | description                            | option                                 |
| ----------------------------- | -------------------------------------- | -------------------------------------- |
| MODE                          | cluster模式/standalone模式                     | cluster/standalone default **cluster** |
| NACOS_SERVERS                 | nacos cluster地址        | eg. ip1,ip2,ip3             |
| PREFER_HOST_MODE              | 是否支持hostname         | hostname/ip default **ip**             |
| NACOS_SERVER_PORT             | nacos服务器端口                      | default **8848**                       |
| NACOS_SERVER_IP             | 多网卡下的自定义nacos服务器IP                      |                         |
| SPRING_DATASOURCE_PLATFORM    | standalone 支持 mysql               | mysql / empty default empty            |
| MYSQL_MASTER_SERVICE_HOST     | mysql 主节点host                      |                                        |
| MYSQL_MASTER_SERVICE_PORT     | mysql 主节点端口             | default : **3306**                     |
| MYSQL_MASTER_SERVICE_DB_NAME  | mysql 主节点数据库           |                                        |
| MYSQL_MASTER_SERVICE_USER     | 数据库用户名            |                                        |
| MYSQL_MASTER_SERVICE_PASSWORD | 数据库密码            |                                        |
| MYSQL_SLAVE_SERVICE_HOST      | mysql从节点host                       |                                        |
| MYSQL_SLAVE_SERVICE_PORT      | mysql从节点端口              | default :3306                          |
| MYSQL_DATABASE_NUM      | 数据库数量             | default :2                          |
| JVM_XMS      |  -Xms             | default :2g                          |
| JVM_XMX      |  -Xmx            | default :2g                          |
| JVM_XMN      |  -Xmn           | default :1g                          |
| JVM_MS      |  -XX:MetaspaceSize          | default :128m                          |
| JVM_MMS      |  -XX:MaxMetaspaceSize          | default :320m                          |
| NACOS_DEBUG      |  开启远程调试          | y/n default :n                          |
| TOMCAT_ACCESSLOG_ENABLED      |  server.tomcat.accesslog.enabled         | default :false  

## Nacos + Grafana + Prometheus
参考：[Nacos监控指南](https://nacos.io/zh-cn/docs/monitor-guide.html)

**Note**:  grafana创建一个新数据源时，数据源地址必须是 **http://prometheus:9090**

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
