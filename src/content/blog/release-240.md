---
title: Nacos 2.4.0 正式版发布，支持初始化指定密码，默认关闭derby运维接口
keywords: [2.4.0, Python-SDK, Go-SDK]
description: Nacos 2.4.0 正式版发布，支持初始化指定密码，默认关闭derby运维接口
date: "2024-07-24"
category: announcement
---
# Nacos 2.4.0 正式版发布，支持初始化指定密码，默认关闭derby运维接口

## Nacos 2.4.0 正式版

> 从Github下载时请使用版本[2.4.0.1](https://github.com/alibaba/nacos/releases/tag/2.4.0.1)，[官网下载](/download/nacos-server/)中2.4.0版本已自动升级成[2.4.0.1](https://github.com/alibaba/nacos/releases/tag/2.4.0.1)

2.4.0版本是Nacos2.X的又一个功能性版本，此版本的更新主要在 Nacos 的安全性、扩展功能和改进用户体验方面的持续努力，为用户提供了更安全、更灵活的服务管理平台。版本主要的功能如下：

1. **增强安全性**：Nacos 现在支持维护人员在初始化时设置管理员用户 `nacos` 的密码，替代默认密码，以提高 Nacos 集群的默认安全性。此外，默认情况下禁用了 Derby OPS API，以防止在单例模式部署时，未启用身份验证的用户遇到相关风险的误报问题。如果维护人员需要使用该 API 进行 Derby 数据的维护和查询，可以通过设置 `nacos.config.derby.ops.enabled=true` 来启用此功能。
2. **TLS Grpc 通信**：Nacos 支持作为可选功能在集群节点间使用 TLS Grpc 通信，以增强 Nacos 的安全性。这意味着 Nacos 现在不仅支持客户端与服务器之间的 TLS 通信，还支持集群节点间的安全通信。
3. **扩展功能**：在注册中心模块中，Nacos 允许用户在回调 `Subscriber` 之前扩展 `Selector`，不仅可以根据健康状态和集群选择服务实例，还可以支持更多自定义逻辑。此外，Nacos 客户端通过新的事件支持回调服务差异，以减少在 `Subscriber` 中实现的缓存和比较逻辑。
4. **控制台和插件支持**：Nacos 控制台现在支持更多配置使用，并增强了插件的使用，例如支持将所有元数据添加到 Prometheus SD 协议中以及支持阿里云 RAM V4 签名。

除了这些重要的功能更新外，此版本还修复了一些前版本中的错误，并升级了某些存在安全漏洞的依赖项。
具体的变更详情如下：

```markdown
## Feature
[#10374] Support naming custom selectors and support service diff events.
[#11456] Support TLS Grpc communication between Nacos cluster nodes.
[#11847] Nacos console support publish config with cas.
[#11943] Record users for import configs.
[#11957] Remove default password for user `nacos`.
[#12130] Add metadata as labels in prometheus http sd.
[#12162] Support aliyun ram v4 signature method.

## Enhancement&Refactor
[#11956] Refactor nacos client logging module, use SPI load current logger adapter.
[#12013] Enhance to fast config Nacos memory setting in startup.sh by environment CUSTOM_NACOS_MEMORY.
[#12072] Support does not impose any limit when totalCountLimit is less than 0.
[#12166] Enhance nacos client init properties logger.
[#12177] Update console header link to new nacos.io.
[#12178] Add total record count display in pagination.
[#12185] Use nacos properties in CacheDirUtil.
[#12221] Remove the accessToken from the URL.
[#12235] Enhance logging format in the ResponseExceptionHandler.
[#12246] Internationalize the display of total counts in the configuration list and service list.
[#12321] Enhance log for unexpected exception from NetworkInterface.ifUp.
[#12355] Record the cost of ConfigDump in Prometheus.
[#12372] Disable derby ops api default.
[#12382] Support ram info switch.

## BugFix
[#10639] Fix the `encrypted_data_key` is text type so that old version can't upgrade directly.
[#11902] Fix leak of request and response for java native runtime for nacos-client.
[#11926] Fix Nacos can't triggle self protection when disk full in some OS.
[#11951] Fix the problem that the serviceName and groupName are not resolved correctly when deleting an empty service instance.
[#11967] Fix Config can't publish and listen when dataId contains some special words in Window OS.
[#11968] Fix Multiple config change plugin implementation configuration conflicts problem.
[#12022] Fix nacos datasource plugin ClassCastException problem.
[#12046] Fix cipher-aes config encrypt plugin not effect when publish config again.
[#12060] Fix too large ttl when auth disabled.
[#12146] Fix the operation type does not display when rolling back a configuration with a delete operation type.
[#12168] Fix the labels of the query conditions on the Permission Control - Role Management page are still displayed in Chinese after switching the system language to English.
[#12180] Fix the operator is not recorded during clone and import operations.
[#12196] Fix prometheus http sd invalid label names.
[#12207] Fix disk failover datasource not keep status.
[#12197] Add an id primary key column to both the roles and permissions tables.
[#12219] Fix ServerListManager in nacos-client fails to parse the endpoint in the config.
[#12253] Add endpoint cluster name for config & naming server list manager.
[#12265] Fix nacos client dependencies tree without grpc package.
[#12323] Fix nacos client logback configuration will override packagingData problem.
[#12333] Fix auth Plugin resource parser can't parser v2 config openAPI namespaceId.

## Dependency
[#11904] Bump Spring Security to 5.7.12.
[#11975] Remove unused dependency javatuple.
[#11980] Bump spring framework to 5.3.34.
[#12135] Upgrade module naocs-console from junit4 to junit5.
[#12369] Upgrade grpc to 1.64.2.
```

## Nacos 多语言SDK

### Nacos Python SDK稳定版发布，助力AI应用接入Nacos

Nacos Python SDK稳定版1.0.0正式发布，为您在Python生态中实现通用配置管理和微服务发现提供了一流的解决方案。Nacos作为阿里巴巴开源的动态配置管理和服务发现平台，如今跨越语言边界，让Python开发者也能轻松享受其强大功能！

🌟核心亮点
1. 全面兼容性：支持Python 2.7、3.6及3.7版本，确保广泛的项目适配性。
2. 无缝对接Nacos：兼容Nacos 0.8.0+、Nacos 1.x 以及 Nacos 2.x with http protocol 版本，无论是现有项目升级还是新项目集成，都能平滑过渡。
3. 便捷安装：通过pip一键安装，快速上手，命令行输入pip install nacos-sdk-python即可开启服务注册、配置管理之旅。
4. 简洁API设计：无论是获取配置、监听变更，还是服务注册与发现，API接口设计直观易用，极大降低了学习成本。
5. 安全认证：支持用户名密码加密认证模式，通过AK/SK机制确保交互的安全性。
6. 灵活配置：丰富的额外选项配置，包括日志轮转配置、自定义超时时间、长轮询间隔、后台心跳保活等，满足不同场景下的定制需求。
7. 本地快照与故障转移：自动存储配置快照，即使服务器不可达，也能从本地恢复配置，保障服务连续性。
8. 强大的监听与通知机制：轻松添加监听器，实时响应配置变化，确保服务配置的即时更新。
9. 详尽API参考：详尽的API文档，涵盖从基础配置获取到高级服务管理的所有操作，助力您高效开发。

```markdown
* Support naming auth by @pixystone in https://github.com/nacos-group/nacos-sdk-python/pull/116
* Add user-agent for client. by @pixystone in https://github.com/nacos-group/nacos-sdk-python/pull/118
* Update version to 0.1.9 by @realJackSun in https://github.com/nacos-group/nacos-sdk-python/pull/119
* Fix add header by @pixystone in https://github.com/nacos-group/nacos-sdk-python/pull/120
* support endpoint url model to get server list and fix add watch fail on mac & linux  by @shiyiyue1102 in https://github.com/nacos-group/nacos-sdk-python/pull/147
* 修复传参bug、新增日志轮转、优化明文用户名密码鉴权，支持后台服务实例自动心跳保活 by @CZJCC in https://github.com/nacos-group/nacos-sdk-python/pull/160
* 增加access token调用判断 by @CZJCC in https://github.com/nacos-group/nacos-sdk-python/pull/163
* 升级版本 by @CZJCC in https://github.com/nacos-group/nacos-sdk-python/pull/164
* fix readme by @CZJCC in https://github.com/nacos-group/nacos-sdk-python/pull/165
* 在docker中启动多个gunicorn进程时，偶发异常"File exists',导致服务启动失败 by @projoy in https://github.com/nacos-group/nacos-sdk-python/pull/171
* 心跳检测异常 by @nightosong in https://github.com/nacos-group/nacos-sdk-python/pull/169
```

关于Nacos Python SDK适配Nacos 2.x Grpc模式工作也在进行中，不久的将来就能跟大家正式亮相！


### Nacos Go SDK 2.2.7版本发布

Nacos Go SDK 2.2.7版本也同期发布， 修复日志输出问题以及断线重连时可能丢失服务的问题，请使用旧版本Go SDK的用户尽快升级。

```markdown
* Fix InitLogger just no work by @dingyang666 in https://github.com/nacos-group/nacos-sdk-go/pull/759
* fix #736, [掉线重连可能导致服务丢失](https://github.com/nacos-group/nacos-sdk-go/… by @ijustyce in https://github.com/nacos-group/nacos-sdk-go/pull/737
* update getFailOverConfig log level by @binbin0325 in https://github.com/nacos-group/nacos-sdk-go/pull/768
```

## About Nacos

Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

Nacos 帮助您更敏捷和容易地构建、交付和管理微服务平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式) 的服务基础设施。

最后欢迎大家扫码加入Nacos社区群

![image.png](https://cdn.nlark.com/yuque/0/2024/jpeg/1577777/1721799847016-353eca94-a5b6-4a73-bfc9-686a5bd2a510.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1080%2Climit_0%2Finterlace%2C1)

