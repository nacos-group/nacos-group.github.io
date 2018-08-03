这个快速开始手册是帮忙您快速在你的电脑上，下载安装并使用Nacos。

## 1.预备环境准备
请确保是在环境中安装使用:

1. 64 bit OS，支持 Linux/Unix/Mac/Windows，推荐选用 Linux/Unix/Mac。
2. 64 bit JDK 1.8+；[下载](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).[配置](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/)。
3. Maven 3.2.x+；[下载](https://maven.apache.org/download.cgi).[配置](https://maven.apache.org/settings.html)。

## 2.下载源码或者安装包
你可以通过两种方式来获取 Nacos。

### 从 Github 上下载源码方式

```bash
unzip nacos-source.zip
cd nacos/
mvn -Prelease-nacos clean install -U  
cd nacos/distribution/target/nacos-server-0.1.0/nacos/bin
```
  
### 下载编译后压缩包方式
下载地址 

[zip包](https://pan.baidu.com/s/1HJIJrbuOz2TpvSQFEIv6aw)

[tar.gz包](https://pan.baidu.com/s/1612GZZcp84ponzhc_dz5QA)

```bash
  unzip nacos-server-0.1.0.zip 或者 tar -xvf nacos-server-0.1.0.tar.gz
  cd nacos/bin
```  

## 3.启动服务器
### Linux/Unix/Mac 
启动命令(standalone代表着单机模式运行，非集群模式):

`sh startup.sh -m standalone`

### Windows
启动命令：

`cmd startup.cmd`

或者双击startup.cmd运行文件。

## 4.服务注册&发现和配置管理
### 服务注册

`curl -X PUT 'http://127.0.0.1:8080/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

### 服务发现

`curl -X GET 'http://127.0.0.1:8080/nacos/v1/ns/instances?serviceName=nacos.naming.serviceName'`

### 发布配置

`curl -X POST "http://127.0.0.1:8080/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"`

### 获取配置

`curl -X GET "http://127.0.0.1:8080/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"`

## 5.关闭服务器
### Linux/Unix/Mac 

`sh shutdown.sh`

### Windows

`cmd shutdown.cmd`

或者双击shutdown.cmd运行文件。
