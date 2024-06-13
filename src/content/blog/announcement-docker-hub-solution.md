---
title: 关于Nacos镜像无法从DockerHub进行下载的临时解决方案
keywords: [nacos, docker, dockerhub, download]
description: 关于Nacos镜像无法从DockerHub进行下载的临时解决方案公告
date: "2024-06-13"
category: announcement
---

# 关于Nacos镜像无法从DockerHub进行下载的临时解决方案

尊敬的 Nacos 社区用户，

近期我们收到许多用户反馈，称他们无法访问 Docker Hub 仓库下载 Nacos 的镜像。经过排查，我们确认这问题是由于网络原因导致的，当前无法访问 Docker Hub Nacos 的镜像仓库并下载镜像。

为了解决这一问题，社区临时使用了 [阿里云镜像服务 ACR](https://www.aliyun.com/product/acr?spm=nacos.cloud.topbar.0.0.0) 对 Nacos-Server 的镜像进行了备份，并提供了临时的下载地址。备份的镜像规则为镜像 tag 以 v.* 为格式，能够涵盖绝大部分 2.X 版本和最近两年的 1.X 版本。

## 关于Nacos镜像下载的临时解决方案

您可以通过如下命令下载Nacos的镜像

```shell
docker pull nacos-registry.cn-hangzhou.cr.aliyuncs.com/nacos/nacos-server:v${nacos.version}
```

例如：

```shell
docker pull nacos-registry.cn-hangzhou.cr.aliyuncs.com/nacos/nacos-server:v2.3.2

```

:::note
由于此镜像仓库为临时解决方案，因此仅支持`nacos/nacos-server`中较新的版本，规则为镜像 tag 以 v.* 为格式的版本。

且此镜像仓库的拉取存在一定的限流，请社区同学们按需下载镜像。
:::