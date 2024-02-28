---
title: Nacos 快速开始
keywords: [Nacos,快速开始]
description: 这个快速开始手册是帮忙您快速在您的电脑上，下载、安装并使用 Nacos。
sidebar:
    order: 1
---

# Nacos 快速开始

这个快速开始手册是帮忙您快速在您的电脑上，下载、安装并使用 Nacos。

## 0. 版本选择

您可以通过Nacos的[版本下载页面](/download/nacos-server/)、[release notes](https://github.com/alibaba/nacos/releases) 及 [发布声明](/news/release/)中找到每个版本支持的功能的介绍，当前推荐的稳定版本为2.3.1.

## 1. 预备环境准备

Nacos 依赖 [Java](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) 环境来运行，请确保是在以下版本环境中安装使用:

1. 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
2. 64 bit JDK 1.8+；[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) & [配置](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。

## 2. 下载安装包

你可以通过Nacos官网网站及Github两种方式来获取 **Nacos 发行包** 。

### 2.1. 从官网下载方式

进入Nacos官网[版本下载页面](/download/nacos-server/)，选择 [稳定版本](/download/nacos-server/#稳定版本)， 然后点击`二进制包下载`列中的`${nacos.version}.zip`进行下载。

> 注意：有时大量用户同时进行下载时，可能会遇到下载限流失败的情况，若出现下载限流失败，请稍等后重试，或采用`从 Github 下载方式`。

### 2.2. 从 Github 下载方式

进入Nacos Github 的 [最新稳定版本](https://github.com/alibaba/nacos/releases) ，选择需要下载的Nacos版本，在`Assets`中点击下载 `nacos-server-$version.zip` 包。
  
## 3. 解压缩Nacos 发行包

```bash
  unzip nacos-server-$version.zip 
  # 或者 tar -xvf nacos-server-$version.tar.gz
  cd nacos/bin
```

## 4.启动服务器

* 注：Nacos的运行建议至少在2C4G 60G的机器配置下运行。

### 4.1. Linux/Unix/Mac 

启动命令(standalone代表着单机模式运行，非集群模式):

`sh startup.sh -m standalone`

如果您使用的是ubuntu系统，或者运行脚本报错提示[[符号找不到，可尝试如下运行：

`bash startup.sh -m standalone`

### 4.2. Windows

启动命令(standalone代表着单机模式运行，非集群模式):

`startup.cmd -m standalone`

## 5.验证Nacos服务是否启动成功

进入`${nacos.home}/logs/` 目录下， 使用`tail -f start.out` 查看日志，如果看到如下日志，说明服务启动成功。

```
Nacos started successfully in stand alone mode. use embedded storage
```

可以通过下列服务，快速检验Nacos的功能。

### 5.1. 服务注册

`curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

### 5.2. 服务发现

`curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instance/list?serviceName=nacos.naming.serviceName'`

### 5.3. 发布配置

`curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=HelloWorld"`

### 5.4. 获取配置

`curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"`

### 5.5. Nacos控制台页面

打开任意浏览器，输入地址：`http://127.0.0.1:8848/nacos`，即可进入Nacos控制台页面。

## 6.关闭服务器

### 6.1. Linux/Unix/Mac 

`sh shutdown.sh`

### 6.2. Windows

`shutdown.cmd`

或者双击shutdown.cmd运行文件。

## 相关项目

* [Nacos](https://github.com/alibaba/nacos)
