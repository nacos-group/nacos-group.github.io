---
title: 关于Nacos身份验证漏洞修复建议
keywords: [身份验证, 漏洞]
description: 关于Nacos身份验证漏洞修复建议及部署说明
date: "2021-01-15"
category: announcement
---

# 关于Nacos身份验证漏洞修复建议

近期Nacos社区收到关于Nacos鉴权功能通过UA绕过身份验证安全漏洞的问题。社区在1.4.1版本已进行了修复。用户可以自定义server 
identity来设置服务端之间通信的安全认证，不再简单使用UA进行认证。

在1.4.1发布之后，立刻收到了社区安全工程师的另一个使用相同语意的特殊url绕过身份验证的漏洞，于是社区立刻对其进行了修复，并进行了1.4.1版本的hotfix。

请用户尽快升级至最新的1.4.1版本（2021.01.15 release），并根据文档进行升级及修复。

十分抱歉给广大Nacos用户造成了困扰和问题。

[download page](https://github.com/alibaba/nacos/releases/tag/1.4.1).

[document](https://nacos.io/docs/latest/guide/user/auth/).

# 关于Nacos的部署建议

Nacos 定义为一个应用服务发现和配置管理中间件服务，这类应用一般应该部署于**内部网络环境**，因此不建议用户将Nacos暴露在**公网环境**。

即使升级到1.4.1版本，也请不要暴露在**公网环境**使用。

# 感谢社区

在此首先感谢本次为Nacos提出安全问题的工程师，感谢Nacos社区的大家对Nacos的意见，讨论和鞭策。

Nacos的发展离不开社区，希望社区能够有更多优秀的工程师加入，参与共建，让Nacos变得更好更安全。

最后，再次为本次的漏洞问题给大家造成的困扰和麻烦道歉。感谢大家的谅解与宽容。

# 关于安全漏洞的报告

由于安全漏洞的issue比较特殊，希望后续社区的安全工程师能够通过[ASRC（Alibaba Security Response Center阿里安全响应中心）]( https://security.alibaba.com) 告知漏洞。


