---
title: Nacos 客户端初始化说明
keywords: [Nacos,客户端,初始化,配置,集群]
description: 本文详细介绍了Nacos客户端初始化的两种方式，包括直接配置服务器信息与通过接入点接入，以及非必传参数如链接路径、区域隔离与鉴权设置。
---

Nacos 客户端初始化说明

```
	public final static String ENDPOINT = "endpoint";
	public final static String NAMESPACE = "namespace";
	public final static String ACCESS_KEY = "accessKey";
	public final static String SECRET_KEY = "secretKey";
	public final static String SERVER_ADDR = "serverAddr";
	public final static String CONTEXT_PATH = "contextPath";
	public final static String CLUSTER_NAME = "clusterName";
	public final static String ENCODE = "encode";

```
一、客户端可以通过两种方式初始化（二选一，必传）

1. 通过直接传入Nacos server端信息（ip:port，或者域名）方式

	``
	SERVER_ADDR server地址，格式为“ip1:port,ip2.port”
	``
2. 通过接入点进行接入获取环境信息

	```
	ENDPOINT 接入点
	CLUSTER_NAME 集群名字
	```

二、链接的server的路径（非必传）

```
CONTEXT_PATH server根路径 （默认值 nacos）
```
三、区域隔离（非必传）

```
NAMESPACE 名称区域
```

四、鉴权参数（非必传）

```
ACCESS_KEY 公钥
SECRET_KEY 私钥
```
