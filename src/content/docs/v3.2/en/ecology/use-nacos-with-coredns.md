---
title: Nacos push domain with CoreDNS
keywords: [CoreDNS, DNS-F]
description: Nacos push domain with CoreDNS
sidebar:
    order: 6
---

# Nacos DNS user guide
This plugin provides a DNS-F client based on CoreDNS, which can help export those registed services on Nacos as DNS domain. DNS-F client is a dedicated agent process(side car) beside the application's process to foward the service discovery DNS domain query request to Nacos.
## Quick Start
To build and run nacos coredns plugin, the OS must be Linux or Mac. And also, make sure your nacos version is 2.2 or higher and golang version is 1.17 or higher. And golang environments(GOPATH,GOROOT,GOHOME) must be configured correctly. Because it needs to support the gRPC connection feature of the nacos2.x version and the go mod function.
## Build
```
git clone https://github.com/nacos-group/nacos-coredns-plugin.git 
cp nacos-coredns-plugin/bin/build.sh ~/
cd ~/
sh build.sh
```

## Configuration
To run nacos coredns plugin, you need a configuration file. A possible file may be as bellow:
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
- forward: domain names those not registered in nacos will be forwarded to upstream.
- nacos_namespaceId: nacos namespaceId, defalut is public.
- nacos_server_host: Ip and Port of nacos server, seperated by comma if there are two or more nacos servers

## Run
1. Firstly, you need to deploy nacos server.  [Here](https://github.com/alibaba/nacos)
2. Secondly, register service on nacos.
3. Finally, configure the file  **($path_to_corefile)**  and the port  **($dns_port)**  to run the plugin.
```
$GOPATH/src/coredns/coredns  -conf $path_to_corefile  -dns.port $dns_port 
```
![](https://cdn.nlark.com/yuque/0/2022/png/29425667/1663504581023-95437fee-0e3d-4b6a-851c-44a352dedd81.png)

## Test

Input the service name  **($nacos_service_name)**  , and the plugin's IP address  **($dns_ip)**  and port  **($dns_port)** . We can get the DNS answer from the plugin. 

```
dig  $nacos_service_name   @$dns_ip   -p $dns_port 
```
![](https://cdn.nlark.com/yuque/0/2022/png/29425667/1663504588231-341b38fe-da55-41eb-a24b-e3752b86faa4.png)
