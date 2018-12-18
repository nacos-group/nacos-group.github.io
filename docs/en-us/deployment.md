Nacos supports three types of deployment modes:

* Standalone Mode - used in DEV or TEST environment.
* Cluster Mode - used in production environment to ensure high-availability.
* Multi-Cluster Mode - in complicated production mode, you may want to deploy multi-cluster mode to support different business units.


## Running Nacos in Standalone Mode
### Linux/Unix/Mac
* Standalone means it is non-cluster Mode. * 
sh startup.sh standalone

### Windows
* standalone means it is non-cluster Mode. * 
cmd startup.cmd standalone


## Running Nacos in Multi-Node Cluster Mode

### Linux/Unix/Mac
sh startup.sh

### Windows
cmd startup.cmd

### Running Nacos with mysql in Multi-Node Cluster Mode

#### Initialize MySQL database

[sql statement source file](https://github.com/alibaba/nacos/blob/master/distribution/conf/nacos-mysql.sql)

#### application.properties configuration

[application.properties configuration file](https://github.com/alibaba/nacos/blob/master/distribution/conf/application.properties)

add mysql datasource and configure url, user and password 

```
spring.datasource.platform=mysql

db.num=2
db.url.0=jdbc:mysql://11.162.196.16:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.url.1=jdbc:mysql://11.163.152.9:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=nacos_devtest
db.password=youdontknow
```

## Deploy Nacos in Multi-Cluster Mode

Nacos support a NameServer route request mode， by which you can design a useful mapping rule to control the request forward to the corresponding cluster, in the mapping rule you can sharding the request by namespace or by tenant etc...

to setup a NameServer:

* TODO