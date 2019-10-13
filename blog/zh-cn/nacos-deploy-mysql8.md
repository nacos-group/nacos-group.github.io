---
title: Nacos 配置MySQL8数据库
keywords: mysql8,nacos
description: Nacos 配置MySQL8数据库
---

# Nacos 配置MySQL8数据库

`Nacos版本：1.1.3`

`MySQL版本：8.0.15`

## 从GitHub上获取Nacos源码

```sh
git clone https://github.com/alibaba/nacos.git
```



## 初始化mysql数据库

`脚本文件位置：nacos/distribution/conf/nacos-mysql.sql`

```mysql
-- 创建nacos_config数据库
create database `nacos_config` default character set utf8mb4 collate utf8mb4_general_ci;
use `nacos_config`;
```



## 修改pom文件里的mysql驱动版本

`位置：在父pom文件中，line 643`

```xml
<!-- JDBC libs -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <!-- <version>5.1.34</version> -->
    <!-- 更换为支持MySQL8驱动的版本 -->
    <version>8.0.17</version>
</dependency>
```



## 修改源代码

`修改数据源`

`位置：nacos/naming/src/main/java/com/alibaba/nacos/naming/healthcheck/MysqlHealthCheckProcessor.java`

```java
// import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;原本引用的类
// com.mysql.cj.jdbc.MysqlDataSource是通过定位源码的位置找到的
import com.mysql.cj.jdbc.MysqlDataSource;
```



## 修改配置文件，添加支持mysql数据源配置

`配置文件位置：nacos/distribution/conf/application.properties`

```properties
spring.datasource.platform=mysql
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=userName
db.password=password
```



## 打包编译

```shell
cd nacos/
mvn -Prelease-nacos clean install -U -Dmaven.test.skip=true
```



## Linux环境下单机模式启动命令

```shell
# 单机模式启动
nohup sh startup.sh -m standalone &

# 查看启动日志
vim /usr/local/nacos/distribution/target/nacos-server-1.1.3/nacos/logs/start.out
```



## 问题排查

`问题`

```tex
Caused by: java.lang.NullPointerException at com.mysql.jdbc.ConnectionImpl.getServerCharset(ConnectionImpl.java:2983)
```

`分析：源代码与使用的Mysql8驱动不一致导致，参考上面的更换驱动部分`



`问题`

```tex
[ERROR] nacos/naming/src/main/java/com/alibaba/nacos/naming/healthcheck/MysqlHealthCheckProcessor.java:[24,37] 程序包com.mysql.jdbc.jdbc2.optional不存在
```

`分析：由于pom文件更改了mysql驱动版本，所以源代码也需要作出相应改动，参考上面的修改源代码部分`
