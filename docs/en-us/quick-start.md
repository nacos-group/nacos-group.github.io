This topic is about how to set up and use Nacos.

## 1.Prerequisites
Before you begin, install the following:

1. 64bit OS: Linux/Unix/Mac/Windows supported, Linux/Unix/Mac recommended.
2. 64bit JDK 1.8+: [downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), [JAVA_HOME settings](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).
3. Maven 3.2.x+: [downloads](https://maven.apache.org/download.cgi), [settings](https://maven.apache.org/settings.html).

## 2.Download & Build from Release
There are two ways to get Nacos. 

### 1)Download source code from Github
  
```bash
unzip nacos-source.zip
cd nacos/
mvn -Prelease-nacos clean install -U  
cd nacos/distribution/target/nacos-server-0.8.0/nacos/bin
```
  
### 2)Download run package 

[zip package Download](https://github.com/alibaba/nacos/releases/download/0.9.0/nacos-server-0.9.0.zip)

[tar.gz package Download](https://github.com/alibaba/nacos/releases/download/0.9.0/nacos-server-0.9.0.tar.gz)


```bash
  unzip nacos-server-0.9.0.zip  OR tar -xvf nacos-server-0.9.0.tar.gz
  cd nacos/bin
```  


## 3.Start Server
### Linux/Unix/Mac
Run the following command to sart(standalone means non-cluster mode):
 
`sh startup.sh -m standalone`

### Windows

Run the following command to start:

`cmd startup.cmd`

Or double-click the startup.cmd run file.

## 4.Service & Configuration Management
### Service registration

`curl -X POST 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

### Service discovery

`curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instances?serviceName=nacos.naming.serviceName'`

### Publish config

`curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"`

### Get config

`curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"    `


## 5.Shutdown Servers
### Linux/Unix/Mac

`sh shutdown.sh`

### Windows

`cmd shutdown.cmd`
