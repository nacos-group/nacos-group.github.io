---
title: Quick Start for Nacos Docker
keywords: Nacos,Docker
description: Quick Start for Nacos Docker
---

# Quick Start for Nacos Docker

## Steps

Run the following command：

* Clone project

  ```powershell
  git clone https://github.com/nacos-group/nacos-docker.git
  cd nacos-docker
  export NACOS_VERSION='{the version of nacos}'
  ```


* Stand-alone Derby

  ```powershell
  docker-compose -f example/standalone-derby.yaml up
  ```

* Stand-alone MySQL

 To use MySQL 5.7, run

  ```powershell
  docker-compose -f example/standalone-mysql-5.7.yaml up
  ```

 To use MySQL 8, run

  ```powershell
  docker-compose -f example/standalone-mysql-8.yaml up
  ```

* Cluster

  ```powershell
  docker-compose -f example/cluster-hostname.yaml up 
  ```


* Service registration

  ```powershell
  curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'
  ```
* Service discovery

    ```powershell
    curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'
    ```
* Publish config

  ```powershell
  curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"
  ```
* Get config

  ```powershell
    curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"
  ```
* Open the Nacos console in your browser

  link：http://127.0.0.1:8848/nacos/

## Common property configuration 

| name                          | description                            | option                                 |
| ----------------------------- | -------------------------------------- | -------------------------------------- |
| MODE                          | cluster/standalone                     | cluster/standalone default **cluster** |
| NACOS_SERVERS                 | nacos cluster address        | eg. ip1,ip2,ip3             |
| PREFER_HOST_MODE              | Whether hostname are supported         | hostname/ip default **ip**             |
| NACOS_SERVER_PORT             | nacos server port                      | default **8848**                       |
| NACOS_SERVER_IP             | custom nacos server ip when network was mutil-network                      |                         |
| SPRING_DATASOURCE_PLATFORM    | standalone support mysql               | mysql / empty default empty            |
| MYSQL_MASTER_SERVICE_HOST     | mysql master host                      |                                        |
| MYSQL_MASTER_SERVICE_PORT     | mysql master database port             | default : **3306**                     |
| MYSQL_MASTER_SERVICE_DB_NAME  | mysql master database name             |                                        |
| MYSQL_MASTER_SERVICE_USER     | username of master database            |                                        |
| MYSQL_MASTER_SERVICE_PASSWORD | password of master database            |                                        |
| MYSQL_SLAVE_SERVICE_HOST      | mysql slave host                       |                                        |
| MYSQL_SLAVE_SERVICE_PORT      | mysql slave database port              | default :3306                          |
| MYSQL_DATABASE_NUM      | It indicates the number of database             | default :2                          |
| JVM_XMS      |  -Xms             | default :2g                          |
| JVM_XMX      |  -Xmx            | default :2g                          |
| JVM_XMN      |  -Xmn           | default :1g                          |
| JVM_MS      |  -XX:MetaspaceSize          | default :128m                          |
| JVM_MMS      |  -XX:MaxMetaspaceSize          | default :320m                          |
| NACOS_DEBUG      |  enable remote debug          | y/n default :n                          |
| TOMCAT_ACCESSLOG_ENABLED      |  server.tomcat.accesslog.enabled         | default :false  

## Nacos + Grafana + Prometheus
Usage reference：[Nacos monitor-guide](https://nacos.io/zh-cn/docs/monitor-guide.html)

**Note**:  When Grafana creates a new data source, the data source address must be **http://prometheus:9090**

## Related Projects

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
