---
title: Quick Start for Nacos Docker
keywords: [Nacos,Docker]
description: Quick Start for Nacos Docker
sidebar:
    order: 2
---

# Quick Start for Nacos Docker

## Steps

Run the following command：

* Clone project

  ```powershell
  git clone https://github.com/nacos-group/nacos-docker.git
  cd nacos-docker
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
| NACOS_SERVERS                 | nacos cluster address        | eg. ip1:port1 ip2:port2 ip3:port3             |
| PREFER_HOST_MODE              | Whether hostname are supported         | hostname/ip default **ip**             |
| NACOS_APPLICATION_PORT             | nacos server port                      | default **8848**                       |
| NACOS_SERVER_IP             | custom nacos server ip when network was mutil-network                      |                         |
| SPRING_DATASOURCE_PLATFORM    | standalone support mysql               | mysql / empty default empty            |
| MYSQL_SERVICE_HOST | mysql  host |  |
| MYSQL_SERVICE_PORT | mysql  database port | default : **3306** |
| MYSQL_SERVICE_DB_NAME | mysql  database name |  |
| MYSQL_SERVICE_USER | username of  database |  |
| MYSQL_SERVICE_PASSWORD | password of  database |  |
| MYSQL_DATABASE_NUM      | It indicates the number of database             | default :**1**                      |
| MYSQL_SERVICE_DB_PARAM      | Database url parameter             |default:**characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false**                      |
| JVM_XMS      |  -Xms             | default :1g                          |
| JVM_XMX      |  -Xmx            | default :1g                          |
| JVM_XMN      |  -Xmn           | default :512m                          |
| JVM_MS      |  -XX:MetaspaceSize          | default :128m                          |
| JVM_MMS      |  -XX:MaxMetaspaceSize          | default :320m                          |
| NACOS_DEBUG      |  enable remote debug          | y/n default :n                          |
| TOMCAT_ACCESSLOG_ENABLED      |  server.tomcat.accesslog.enabled         | default :false                          |
| NACOS_AUTH_SYSTEM_TYPE      |  The auth system to use, currently only 'nacos' is supported        | default :nacos                          |
| NACOS_AUTH_ENABLE      |  If turn on auth system        | default :false                          |
| NACOS_AUTH_TOKEN_EXPIRE_SECONDS      |  The token expiration in seconds        | default :18000                          |
| NACOS_AUTH_TOKEN      |  The default token        | default :SecretKey012345678901234567890123456789012345678901234567890123456789                          |
| NACOS_AUTH_CACHE_ENABLE      |  Turn on/off caching of auth information. By turning on this switch, the update of auth information would have a 15 seconds delay.        | default : false                          |
| MEMBER_LIST      |  Set the cluster list with a configuration file or command-line argument        | eg:192.168.16.101:8847?raft_port=8807,192.168.16.101?raft_port=8808,192.168.16.101:8849?raft_port=8809                          |
| EMBEDDED_STORAGE      |    Use embedded storage in cluster mode without mysql      | `embedded` default : none                          |
| NACOS_AUTH_CACHE_ENABLE      |    nacos.core.auth.caching.enabled      |  default : false                          |
| NACOS_AUTH_USER_AGENT_AUTH_WHITE_ENABLE      |    nacos.core.auth.enable.userAgentAuthWhite      |  default : false                          |
| NACOS_AUTH_IDENTITY_KEY      |    nacos.core.auth.server.identity.key      |  default : serverIdentity                          |
| NACOS_AUTH_IDENTITY_VALUE      |    nacos.core.auth.server.identity.value      |  default : security                          |
| NACOS_SECURITY_IGNORE_URLS      |    nacos.security.ignore.urls      |  default : `/,/error,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.ico,/console-fe/public/**,/v1/auth/**,/v1/console/health/**,/actuator/**,/v1/console/server/**`                          |


## Nacos + Grafana + Prometheus
Usage reference：[Nacos monitor-guide](../guide/admin/monitor-guide.md)

**Note**:  When Grafana creates a new data source, the data source address must be **http://prometheus:9090**

## Related Projects

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Docker](https://github.com/nacos-group/nacos-docker)
