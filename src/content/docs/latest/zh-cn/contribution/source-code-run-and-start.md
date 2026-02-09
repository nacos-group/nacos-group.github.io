---
title: Nacos3.0源码打包和启动
keywords: [源码打包,源码启动]
description: 此文章主要记录Nacos3.0源码打包和启动过程
sidebar:
    order: 5
---

## Nacos源码打包和启动

根据Nacos开源协议（Apache License 2.0）的规定，您有权对Nacos源码进行修改和重新打包，但在进行这些操作时需确保遵守其许可证要求，比如保留原有版权和许可声明。
在对Nacos源码进行打包之前，需要明确Nacos3.0将原有的server和console两个部分归一化到bootstrap一个模块统一管理。所以后续可以通过选择`nacos.deployment.type`参数为以下三种值进行控制启动模式

| 参数值     | 描述                |
|---------|-------------------|
| merged  | server和console都启动 |
| server  | 仅启动server         |
| console | 仅启动console        |

下面开始正式讲述基于Nacos3.0源码结构进行打包的一般步骤，为方便与本机Nacos3.0程序数据互通，本文采用mysql作为数据库。步骤如下：

### 步骤一：拉取Nacos3.0源码

从[Nacos的GitHub仓库](https://github.com/alibaba/nacos)中克隆源码到本地。您可以使用如下Git命令完成这一操作：

```shell
git clone https://github.com/alibaba/nacos.git
cd nacos
```

### 步骤二：构建必备的环境

构建Nacos3.0的必要环境包括：
1. 64 bit OS，支持Liunx/Unix/Mac/Windows，执行测试代码推荐选用 Linux/Unix/Mac
2. 64 bit JDK 17+；[下载](https://www.oracle.com/java/technologies/downloads/#java17)&[安装](https://docs.oracle.com/en/java/javase/17/install/overview-jdk-installation.html)
3. maven；推荐采用3.3.9及以上版本
4. 由于本文采用mysql数据库，请确保已安装mysql数据库并启动。

验证上述环境是否安装成功，执行如下命令：

```bash
java -version
mvn -v
mysql -V
```

### 步骤三：打包Nacos3.0

进入Nacos项目的根目录下执行Maven命令编译并打包Nacos的console和server端的代码。

具体命令如下：

```bash
cd nacos
mvn clean install -Prelease-nacos
```

打包完成后会在`distribution/target`目录下生成nacos-server-${version}的`目录`、`tar.gz`和`zip`的文件，分别用于直接运行和部署。

### 步骤四：以merged模式启动Nacos-bootstrap

在`Nacos/distribution/target/nacos-server-${version}/nacos/conf/application.properties`文件中添加如下配置：

```properties
spring.sql.init.platform=mysql
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user=${MYSQL_USERNAME}
db.password=${MYSQL_PASSWORD}
```

启动`Nacos-bootstrap`，并指定`nacos.deployment.type`参数为`merged`，启动命令如下：

```bash
distribution/target/nacos-server-${version}/nacos/bin/startup.sh -m standalone -d merged
```

> 首次启动会引导填写鉴权相关的一些配置参数，`nacos.core.auth.plugin.nacos.token.secret.key`, `nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`, 请按照引导进行填写.

### 步骤五：验证Nacos-bootstrap是否启动成功

在浏览器中访问`http://127.0.0.1:8080`，如果出现登录页面面则说明Nacos-bootstrap启动成功。

### 本地IDEA启动

Add VM options

```
-Dnacos.standalone=true -Dnacos.deployment.type=merged
```

![img.png](/img/local-idea-start.png)

### 解释

上述步骤从拉取Nacos源码开始，到打包`Nacos-bootstrap`并启动`nacos-server`。整个过程中，我们遵循了开源协议的要求，未对原始版权信息做出任何修改或删除。通过直接运行打包好的jar文件，可以方便地启动`Nacos Server`,`Nacos console`进行测试或部署。

值得提一下的是，在实际操作过程中您可能要根据自己的需求适当更改命令和配置文件中内容（如本文外联的mysql数据库地址、用户名、密码等）

<font color="#949494">---------------</font>

## 参考链接

[如何对Nacos源码进行打包](https://nacos.io/blog/faq/nacos-user-question-history15234/)

<font color="#949494">---------------</font> 

## 相关项目

[Nacos](https://github.com/alibaba/nacos)
