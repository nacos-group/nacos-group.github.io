This quick start guide is a detailed instruction of setting up Nacos system on your local machine to use it.

## 1.Prerequisite
The following softwares are assumed installed:

1.64bit OS, Linux/Unix/Mac is recommended;
2.64bit JDK 1.8+;
3.Maven 3.2.x;

## 2.Download & Build from Release

  > unzip nacos-source.zip
  > cd nacos/
  > mvn -Prelease-all -DskipTests clean install -U
  > cd distribution/target/nacos-all/nacos

## 3.Start Server
### Linux/Unix/Mac
* standalone mean not cluster Mode *
sh startup.sh standalone

### Windows
* standalone mean not cluster Mode *
cmd startup.cmd standalone

## 4.service & cfg management
### publish service instance
curl -X PUT 'http://127.0.0.1:8080/nacos/naming/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'

### get Service instances
curl -X GET http://127.0.0.1:8080/nacos/naming/instances?serviceName=nacos.naming.serviceName'

### publish config
curl -X POST "http://127.0.0.1:8080/nacos/basestone.do?method=syncUpdateAll?dataId=nacos.cfg.dataId&group=test&content=helloWorld"

### get config
curl  -X GET "http://127.0.0.1:8080/nacos/config.no?dataId=nacos.cfg.dataId&group=test"

## 5.Shutdown Servers
sh shutdown.sh
quick-start