---
title: Nacos 融合CoreDNS 下发DNS域名
keywords: [Nacos, CoreDNS, DNS域名, 服务发现, golang]
description: Nacos融合CoreDNS插件可将Nacos注册服务导出为DNS域名，作为side car代理进程实现服务发现。支持Linux和Mac系统，需nacos 2.2+和golang 1.17+版本。通过配置nacos_server_host与namespaceId，利用build脚本构建并运行，未注册域名自动转发至upstream。
sidebar:
    order: 6
---

# Nacos DNS 使用手册
本插件提供了一个基于CoreDNS的DNS-F客户端，可以将Nacos上注册的服务导出为DNS域名。 本DNS-F客户端是应用程序进程旁边的一个专用代理进程（side car），可以将服务名作为DNS域名查询请求转发到本客户端，提供服务发现的功能。

## 快速开始
要构建和运行本 nacos-coredns 插件，操作系统必须是 Linux 或 Mac。 另外，请确保您的 nacos 服务端版本为2.2或更高级版本，以及 golang 版本为 1.17 或更高级版本， 并且必须正确配置 golang 环境（GOPATH、GOROOT）。因为需要支持 nacos2.x 版本的gRPC连接功能和 go mod 功能。

## 构建
```
git clone https://github.com/nacos-group/nacos-coredns-plugin.git 
cp nacos-coredns-plugin/bin/build.sh ~/
cd ~/
sh build.sh
```

## 配置
运行本 nacos-coredns 插件，您需要一个配置文件。 一个标准的配置文件如下：
```
. {
    log
    nacos {
    nacos_namespaceId public
    nacos_server_host 127.0.0.1:8848
    }
    forward . /etc/resolv.conf
}
```
- forward：未在 nacos 注册的域名将被转发到upstream。
- nacos_namespaceId：nacos namespaceId，默认为public。
- nacos_server_host：nacos 服务端的IP地址和端口，如果有两个或多个 nacos 服务端，用逗号分隔

## 运行
1. 首先需要部署一个nacos服务端。 [部署参考](https://github.com/alibaba/nacos)
2. 其次，在nacos上注册服务。
3. 然后输入配置文件 **($path_to_corefile)** 和指定端口 **($dns_port)** ，运行本插件。
```
$GOPATH/src/coredns/coredns   -conf $path_to_corefile   -dns.port $dns_port 
```
![](https://cdn.nlark.com/yuque/0/2022/png/29425667/1663504581023-95437fee-0e3d-4b6a-851c-44a352dedd81.png)

## 服务发现例子
- 输入服务名 **($nacos_service_name)** ，以及插件的IP地址 **($dns_ip)** 和端口 **($dns_port)**

```
dig   $nacos_service_name   @$dns_ip   -p $dns_port 
```
![](https://cdn.nlark.com/yuque/0/2022/png/29425667/1663504588231-341b38fe-da55-41eb-a24b-e3752b86faa4.png)
