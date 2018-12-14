## Cluster Mode Deployment

This Quick Start Manual is to help you quickly download, install and use Nacos on your computer to deploy the cluster mode for production use.

## 1. Preparing for the Environment

Make sure that it is installed and used in the environment:
1. 64 bit OS Linux/Unix/Mac, recommended Linux system.
2. 64 bit JDK 1.8+; [Download](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html). [Configuration](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javome_t/).
3. Maven 3.2.x+; [Download](https://maven.apache.org/download.cgi). [Configuration](https://maven.apache.org/settings.html).



## 2. Download source code or installation package

You can get Nacos in two ways.


### Download source code from Github


```bash
unzip nacos-source.zip
cd nacos/
mvn -Prelease-nacos clean install -U  
cd nacos/distribution/target/nacos-server-0.6.1/nacos/bin
```

### Download Compressed Packet after Compilation
Download address

[zip package](https://github.com/alibaba/nacos/releases/download/0.6.1/nacos-server-0.6.1.zip)

[tar.gz package](https://github.com/alibaba/nacos/releases/download/0.6.1/nacos-server-0.6.1.tar.gz)


```bash
  unzip nacos-server-0.6.1.zip 或者 tar -xvf nacos-server-0.6.1.tar.gz
  cd nacos/bin
```



Configuration Cluster Profile

In the Nacos decompression directory Nacos / conf directory, there is a configuration file cluster. conf, please configure each line as ip: port.

```plain
# ip:port
200.8.9.16:8848
200.8.9.17:8848
200.8.9.18:8848
```



## 4. Configure MySQL database

<span data-type="color" style="color:rgb(25, 31, 37)"><span data-type="background" style="background-color:rgb(255, 255, 255)">production and use recommendations at least backup mode, or high availability database. </span></span>

### Initialize MySQL database

[sql statement source file](https://github.com/alibaba/nacos/blob/master/distribution/conf/nacos-mysql.sql)

### application. properties configuration

[application.properties configuration file](https://github.com/alibaba/nacos/blob/master/distribution/conf/application.properties)



## 5. start server

### Linux/Unix/Mac

Start commands (cluster mode in parametric mode):

`sh startup.sh`

#6. Service Registration & Discovery and Configuration Management

Service registration

`curl -X PUT 'http://127.0.0.1:8848/nacos/v1/ns/instance?serviceName=nacos.naming.serviceName&ip=20.18.7.10&port=8080'`

Service discovery

`curl -X GET 'http://127.0.0.1:8848/nacos/v1/ns/instances?serviceName=nacos.naming.serviceName'`

Publish configuration

`curl -X POST "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test&content=helloWorld"`

get configuration

`curl -X GET "http://127.0.0.1:8848/nacos/v1/cs/configs?dataId=nacos.cfg.dataId&group=test"`


5. shut down server

Linux/Unix/Mac

`sh shutdown.sh`