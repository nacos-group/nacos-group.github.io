---
title: 关于Nacos默认token.secret.key风险说明及解决方案公告
keywords: nacos,auth,risk,token.secret.key
description: 关于Nacos默认token.secret.key风险说明及解决方案公告
---

# 关于Nacos默认token.secret.key风险说明及解决方案公告

近期Nacos社区收到关于Nacos鉴权功能通过`token.secret.key`默认值进行撞击，绕过身份验证安全漏洞的问题。社区在2.2.0.1版本已移除了自带的默认值，并在`token.secret.key`未传入或非法时阻止Nacos节点启动来提醒用户设置自定义`token.secret.key`。
    
使用旧版本的用户请根据[文档](https://nacos.io/zh-cn/docs/v2/guide/user/auth.html)进行环境检查，查看是否使用了默认的`token.secret.key`，如仍然使用默认值，请参考文档内容尽快进行修改。

新部署环境请使用最新2.2.0.1版本部署，并根据文档设置`token.secret.key`，并尽快修改默认密码。

[Download page](https://github.com/alibaba/nacos/releases/tag/2.2.0.1).

# 关于Nacos的部署建议

Nacos 定义为一个应用服务发现和配置管理中间件服务，这类应用一般应该部署于**内部网络环境**，因此不建议用户将Nacos暴露在**公网环境**。

同时应开启鉴权，设置自定义`token.secret.key`，并修改`nacos`用户的密码，提高安全性。

另外，即使升级到最新版本，开启鉴权并修改了token.secret.key和`nacos`用户的密码，也请不要暴露在**公网环境**使用。

## 关于变更token.secret.key对正在运行程序的影响及初步解决方式

修改`token.secret.key`并重启Nacos Server端后，来自Nacos Client的请求将会因无效token被拒绝。直到客户端到达旧token的TTL时间后，才会重新去获取新token。

### 解决方式

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