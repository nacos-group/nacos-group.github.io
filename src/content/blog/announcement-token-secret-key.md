---
title: 关于Nacos默认token.secret.key及server.identity风险说明及解决方案公告
keywords: [nacos, auth, risk, token.secret.key, server.identity]
description: 关于Nacos默认token.secret.key及server.identity风险说明及解决方案公告
date: "2023-03-02"
category: announcement
---

# 关于Nacos默认token.secret.key及server.identity风险说明及解决方案公告

近期Nacos社区收到关于Nacos鉴权功能通过`token.secret.key`默认值进行撞击，绕过身份验证安全漏洞的问题。社区在2.2.0.1和1.4.5版本已移除了自带的默认值，并在`token.secret.key`未传入或非法时阻止Nacos节点启动来提醒用户设置自定义`token.secret.key`。考虑到现在的控制台登陆页面并没有进行模块化，无法和是否开启鉴权功能关联，因此暂时需要强制设置`token.secret.key`，社区正在进行控制台登陆页面和鉴权功能的关联，待完成后，**未开启鉴权**的集群将不再强制需要`token.secret.key`，**开启**后仍然强制需要。

同时Nacos社区还收到关于通过`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`默认值进行撞击，绕过身份验证安全漏洞的问题。社区在2.2.1和1.4.5版本已移除了自带的默认值，并在开启鉴权后，未填写这两个参数时阻止Nacos节点启动来提醒用户设置自定义的`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`。

> 说明：这两个默认值原意是为了方便新用户在快速搭建新集群进行使用时可以减少一些繁琐步骤，更简单的使用nacos，在实际部署时提供机制修改配置来提高安全性；随着社区用户对安全性要求提升，默认值可能会导致部分用户未修改直接使用时出现安全风险，因此Nacos社区去除了默认值，并在启动时进行校验，阻止启动提示用户配置。

使用旧版本的用户请根据[文档](https://nacos.io/docs/v2/guide/user/auth/)进行环境检查，查看是否使用了默认的`token.secret.key`、`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`，如仍然使用默认值，请参考文档内容尽快进行修改。

新部署环境请使用最新2.2.1版本部署，并根据文档设置`token.secret.key`、`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`，并尽快修改默认密码。

[Download page](https://github.com/alibaba/nacos/releases/tag/2.2.1).

# 关于Nacos的部署建议

Nacos 定义为一个应用服务发现和配置管理中间件服务，这类应用一般应该部署于**内部网络环境**，因此不建议用户将Nacos暴露在**公网环境**。

同时应开启鉴权，设置自定义`token.secret.key`、`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`，并修改`nacos`用户的密码，提高安全性。

另外，即使升级到最新版本，开启鉴权并修改了`token.secret.key`、`nacos.core.auth.server.identity.key`、`nacos.core.auth.server.identity.value`和`nacos`用户的密码，也请不要暴露在**公网环境**使用。

## 关于变更token.secret.key对正在运行程序的影响及初步解决方式

修改`token.secret.key`并重启Nacos Server端后，来自Nacos Client的请求将会因无效token被拒绝。直到客户端到达旧token的TTL时间后，才会重新去获取新token。

### 解决方式

目前该问题的解决有一个关联[ISSUE](https://github.com/alibaba/nacos/issues/10105)，欢迎大家进入讨论。

在修改`token.secret.key`前，先修改`token.expire.seconds`为5，客户端默认`每5s`检查一次token是否过期，需要让客户端尽快过期掉旧token。

```properties
# 2.1.0版本前
nacos.core.auth.default.token.expire.seconds=5

# 2.1.0版本及更高版本
nacos.core.auth.plugin.nacos.token.expire.seconds=5
```

修改`token.expire.seconds`后重启集群，运行一段时间（超过原`token.expire.seconds`值，以保证所有客户端已经获取到新TTL）

> 注意：修改后会导致客户端较为频繁地调用login接口，修改前请确保Nacos Server集群的资源足够。

最后将`token.secret.key`修改为新值，并重启集群，`token.expire.seconds`值请酌情修改。

## 关于变更`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`对正在运行程序的影响

修改`nacos.core.auth.server.identity.key` 和 `nacos.core.auth.server.identity.value`不会对当前正在运行造成影响，但可能会导致变更同步失败或自动摘除实例失败。

### 解决方式

按照[文档](https://nacos.io/docs/latest/guide/user/auth/)提示，先开启userAgent白名单，在变更新`server.identity`后，立刻关闭userAgent白名单。

或保证变更`server.identity`期间，不进行业务应用的变更。
