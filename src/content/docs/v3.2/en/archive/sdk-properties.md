---
title: Nacos Client Initialization
keywords: [Nacos,client,initialization]
description: Nacos client initialization.
---

Nacos Client Initialization

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
I. The client can be initialized in either of the following two ways. Choose one; it is required.

1. Pass Nacos Server information directly, such as `ip:port` or a domain name.

	``
	SERVER_ADDR server address, in the format "ip1:port,ip2:port"
	``
2. Use an endpoint to access and obtain environment information.

	```
	ENDPOINT endpoint
	CLUSTER_NAME cluster name
	```

II. Server path for the connection (optional)

```
CONTEXT_PATH server root path (default value: nacos)
```
III. Namespace isolation (optional)

```
NAMESPACE namespace
```

IV. Authentication parameters (optional)

```
ACCESS_KEY public key
SECRET_KEY private key
```
