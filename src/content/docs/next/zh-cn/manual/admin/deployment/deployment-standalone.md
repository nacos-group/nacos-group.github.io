---
title: 单机模式部署
keywords: [Nacos,部署,单机模式，单例模式]
description: Nacos单机模式部署手册，参考本文档可进行Nacos单机模式多种方式部署。
sidebar:
    order: 2
---

# Nacos单机模式

## 1. 直接部署

### 1.1. 使用Derby数据库

在[快速开始](../../../quickstart/quick-start.md)中，我们使用了内置的数据库Derby，快速部署了Nacos的单机模式，可参考该文档进行使用Derby数据库的Nacos单机模式部署。

### 1.2. 使用MySQL数据库

参考[快速开始](../../../quickstart/quick-start.md)中，进行Nacos的环境准备、发行版的下载等。

同时在使用MySQL数据源部署Nacos单机模式时，需要自行准备MySQL数据库：

- 1.安装数据库，版本要求：5.6.5+
- 2.初始化mysql数据库，数据库初始化文件：[mysql-schema.sql](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql)
  
然后修改`${nacos.home}/conf/application.properties`文件，增加支持MySQL数据源配置，添加MySQL数据源的url、用户名和密码。

```
spring.sql.init.platform=mysql

db.num=1
db.url.0=jdbc:mysql://${mysql_host}:${mysql_port}/${nacos_database}?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=${mysql_user}
db.password=${mysql_password}
```

然后使用[快速开始-启动服务器](../../../quickstart/quick-start/#4启动服务器)中的操作，启动Nacos即可。

### 1.3. 高级使用

#### 1.3.1. 自定义配置

Nacos提供了丰富的可配置项，帮助您调整Nacos的性能、控制Nacos提供的功能能力，例如鉴权、监控、数据库、连接、日志等；详情请参考[系统参数](../system-configurations.md)。

## 2. Docker部署

### 2.1. 使用Derby数据库

在[快速开始 Docker](../../../quickstart/quick-start-docker.md)中，我们通过`Docker`使用了内置的数据库Derby，快速部署了Nacos的单机模式，可参考该文档进行使用Derby数据库的Nacos单机模式部署。

### 2.2 使用MySQL数据库

执行 docker-compose 命令启动Nacos

```powershell
docker-compose -f example/standalone-mysql-8.yaml up
```

**如果希望使用MySQL5.7**

```powershell
docker-compose -f example/standalone-mysql-5.7.yaml up
```

### 2.3 高级配置

如果你有很多自定义配置的需求，可以通过指定[系统参数-镜像环境变量](../system-configurations/#2-镜像环境变量)的方式进行配置，例如需要开启鉴权时：

```powershell
docker run --name nacos-standalone-auth -e MODE=standalone -e NACOS_AUTH_ENABLE=true -e NACOS_AUTH_TOKEN=${customToken} -e NACOS_AUTH_IDENTITY_KEY=${customKey} NACOS_AUTH_IDENTITY_VALUE=${customValue} -p 8848:8848 -d -p 9848:9848  nacos/nacos-server:latest
```

同时，可以通过对application.properties文件进行挂卷定义的方式，将更多复杂的自定义配置导入Nacos容器中，强烈建议在生产环境中使用方式，例如：

```powershell
docker run --name nacos-standalone -e MODE=standalone -v /path/application.properties:/home/nacos/conf/application.properties -p 8848:8848 -d -p 9848:9848  nacos/nacos-server:latest
```

如果仍然无法满足自定义需求，可以基于nacos-docker项目中的`Dockerfile`自行构建镜像。

## 3. Kubernetes部署

TODO