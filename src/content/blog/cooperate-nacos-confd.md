---
title: Nacos整合Confd，支持nginx配置管理
keywords: [Nacos, Confd]
description: 为什么要支持confd，老的应用配置管理模式是启动时读取配置文件，然后重新读取配置文件需要应用重启。一般的配置管理系统都是代码侵入性的
date: "2019-09-06"
article: cooperate
---

为什么要支持confd，老的应用配置管理模式是启动时读取配置文件，然后重新读取配置文件需要应用重启。一般的配置管理系统都是代码侵入性的，应用接入配置管理系统都需要使用对应的SDK来查询和监听数据的变更。对于一些已经成熟的系统来说，接入SDK来实现动态配置管理是很难实现的，Nacos通过引入配置管理工具confd可以实现系统的配置变更做到无代码侵入性。

confd是一个轻量级的配置管理工具，可以通过查询后端存储系统来实现第三方系统的动态配置管理，如Nginx、Tomcat、HAproxy、Docker配置等。confd目前支持的后端有etcd、ZooKeeper等，Nacos
1.1版本通过对confd定制支持Nacos作为后端存储。

confd能够查询和监听后端系统的数据变更，结合配置模版引擎动态更新本地配置文件，保持和后端系统的数据一致，并且能够执行命令或者脚本实现系统的reload或者重启。

## 安装confd插件
confd的安装可以通过源码安装方式，confd基于Go语言编写，其编译安装依赖Go，首先需要确保本地安装了Go，版本不低于v1.10
创建confd目录，下载confd源码，编译生成可执行文件
```
mkdir -p $GOPATH/src/github.com/kelseyhightower
cd $GOPATH/src/github.com/kelseyhightower
wget https://github.com/nacos-group/nacos-confd/archive/v0.19.1.tar.gz
tar -xvf v0.19.1.tar.gz
mv nacos-confd-0.19.1 confd
cd confd
make
```
复制confd文件到bin目录下，启动confd
```
sudo cp bin/confd /usr/local/bin
confd
```

## confd结合Nacos实现nginx配置管理示例
本文介绍使用Nacos结合confd实现Nginx配置管理，为简单起见以Nginx的黑名单功能为演示示例，Nacos使用官网部署的服务，域名为console.nacos.io。Nginx的安装可以参考网上文章

![image](https://img.alicdn.com/tfs/TB1X_KhdUz1gK0jSZLeXXb9kVXa-720-405.jpg)

- 1.创建confd所需目录

confd配置文件默认在/etc/confd中，可以通过参数-confdir指定。目录中包含两个子目录，分别是：conf.d templates
```
mkdir -p /etc/confd/{conf.d,templates}
```

- 2.创建confd配置文件

confd会先读取conf.d目录中的配置文件(toml格式)，然后根据文件指定的模板路径去渲染模板。
```
vim /etc/confd/conf.d/nginx.toml
```

内容为如下，其中nginx.conf.tmpl文件为confd的模版文件，keys为模版渲染成配置文件所需的配置内容，/usr/local/nginx/conf/nginx.conf为生成的配置文件

```
[template]
src = " nginx.conf.tmpl"
dest =
"/usr/local/nginx/conf/nginx.conf"
keys = [
"/nginx/conf",
]
check_cmd = "/usr/local/nginx/sbin/nginx -t
-c {{.src}}"
reload_cmd = "/usr/local/nginx/sbin/nginx
-s reload"
```

- 3.创建模版文件

拷贝Nginx原始的配置，增加对应的渲染内容

```
cp /usr/local/nginx/conf/nginx.conf
/etc/confd/templates/nginx.conf.tmpl
vim /etc/confd/templates/nginx.conf.tmpl
```

增加内容为:

```
···
{{$data := json (getv "/nginx/conf")}}
{{range $data.blackList}}
deny {{.}};
{{end}}
···
```

- 4.在Nacos上创建所需的配置文件

在public命名空间创建dataId为nginx.conf的配置文件，group使用默认的DEFAULT_GROUP即可，配置内容为json格式
```
{
"blackList":["10.0.1.104","10.0.1.103"]
}
```

![image](https://img.alicdn.com/tfs/TB1PSKwdKP2gK0jSZFoXXauIVXa-1986-1024.png)

- 5.启动confd

启动confd，从Nacos获取配置文件，渲染Nginx配置文件。backend设置成nacos，node指定访问的Nacos服务地址，watch让confd支持动态监听

```
confd -backend nacos -node http://console.nacos.io:80 -watch
```

- 6.查看Nginx配置文件，验证Nginx启动

查看生成的/usr/local/nginx/conf/nginx.conf配置文件是否存在如下内容
```
...
deny 10.0.1.104;

deny 10.0.1.103;
...
```

curl命令访问Nginx，验证是否返回正常。http响应状态码为200说明访问Nginx正常
```
curl http://$IP:8080/ -i
HTTP/1.1 200 OK
...
```

- 7.查看本机Ip，加到Nacos配置文件黑名单中

假设本机的Ip为30.5.125.107，将本机的Ip加入到Nginx黑名单
```
{
"blackList":["10.0.1.104","10.0.1.103","30.5.125.107"]
}
```

- 8.查看Nginx配置文件，验证黑名单是否生效

查看生成的/usr/local/nginx/conf/nginx.conf配置文件是否存在如下内容
```
...
deny 10.0.1.104;

deny 10.0.1.103;

deny 30.5.125.107;
...
```
curl命令访问Nginx，访问应该被拒绝，返回403
```
curl http://$IP:8080/ -i
HTTP/1.1 403 Forbidden
...
```

## 总结
本文介绍了使用Nacos结合confd来做自动化管理，confd作为轻量级的配置管理工具可以做到对第三方系统无代码侵入性。本文只是简单使用Nginx的黑名单功能来演示Nacos+confd的使用方式，当然Nginx还具有限流、反向代理等功能以及其他的系统比如Naproxy、Tomcat、Docker等也同样可以使用Nacos+confd做管理，大家可以到Nacos[官网](https://nacos.io)贡献相应的demo或者方案。
