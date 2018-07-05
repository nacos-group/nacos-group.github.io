这个快速开始手册是帮忙您快速在你的电脑上，下载安装并使用Nacos。

## 1.预备环境准备
请确保是在环境中安装使用:

1.64bit OS, Linux/Unix/Mac is recommended;
2.64bit JDK 1.8+;
3.Maven 3.2.x;

## 2.下载源码&或者下载安装包

  > unzip nacos-source.zip
  > cd nacos/
  > mvn -Prelease-all -DskipTests clean install -U
  > cd distribution/target/nacos-all/nacos

## 3.启动服务器
### Linux/Unix/Mac 
启动命令(standalone代表着单机模式运行，非集群模式):
sh startup.sh standalone

### Windows
启动命令(standalone代表着单机模式运行，非集群模式):
cmd startup.cmd standalone

## 4.服务发现和配置管理
### 发布服务实例
curl -X PUT 'http://127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'

### 获取服务实例
curl -X GET http://127.0.0.1:8080/nacos/naming/instances?serviceName=nacos.naming.serviceName'

### 发布配置
curl -X POST "http://127.0.0.1:8080/nacos/basestone.do?method=syncUpdateAll?dataId=nacos.cfg.dataId&group=test&content=helloWorld" 

### 获取配置
curl  -X GET "http://127.0.0.1:8080/nacos/config.no?dataId=nacos.cfg.dataId&group=test"     

## 5.关闭服务器
sh shutdown.sh
