---
title: Nacos 3.1.1 发布，进一步加强MCP&A2A注册中心能力， 同时2.5.2版本也迎来发布。
keywords: [3.1.1, A2A Registry, MCP Registry, 2.5.2]
description: Nacos 3.1.1 正式发布，进一步在A2A（Agent-to-Agent）注册中心和MCP（Model-Context-Protocol）注册中心两大核心能力上实现重大突破；同时2.5.2也迎来版本发布，修复大量旧版本问题，提升稳定性。
date: "2025-11-27"
category: announcement
---

## Nacos 3.1.1 正式发布

Nacos社区正式发布`3.1.1`版本！该版本聚焦于增强 **MCP（Model-Context-Protocol）** 与 **A2A（Agent-to-Agent）** 两大核心能力，并对系统稳定性、安全性及配置管理进行了全面优化。新版本引入了Agent端点批量注册、MCP服务导入时版本合并、默认安全配置等关键特性，为构建安全的AI Agent交互奠定了坚实基础。

以下是本次版本的核心亮点：

### 1.1. A2A（Agent-to-Agent）能力增强
Nacos 3.1.1 持续探索A2A注册中心，在功能完备性上进一步提升：

*   **核心功能增强**：
    *   **支持Agent端点批量注册**：简化了大规模Agent服务的部署与管理流程，提升运维效率。
    *   **重构AgentEndpoint模型**：模型结构得到优化，新增字段以支持更高级的通信协议和复杂的查询场景。

### 1.2. MCP协议生态持续完善
在`3.1.0`版本的基础上，3.1.1进一步提升了MCP协议的易用性和灵活性：

*  **导入与更新能力优化**：
    *   **支持导入时合并版本**：在导入MCP服务规范时，能够智能合并不同版本，简化了多版本服务的管理。
    *   **灵活的更新选项**：更新MCP服务时提供`overrideExisting`选项，允许用户选择是否覆盖现有配置，增强了配置更新的灵活性。
    *   **增强`importToolsFromMcp` API**：支持从流式协议服务器（streamable protocol servers）导入工具，扩展了MCP的生态兼容性。
    *   **新增默认安全配置**：添加默认安全配置支持，包括下行和上行安全方案的选择与配置。
*   修复一些MCP控制台页面的已知问题。

### 1.3. 其他重要改进

*   **功能优化与易用性**：
    *   为控制台模块新增可配置的CORS过滤器，方便前后端分离部署与跨域访问。
    *   重构配置列表（List config）API，使其支持返回`configTags`与`desc`字段，丰富了配置元信息。
*   **稳定性与性能**：
    *   新增线程池配置，允许核心线程超时，以优化系统资源管理。
*   修复了其他3.1.0版本中发现的已知问题。

更多`3.1.1`版本的变更日志如下:

```markdown
## Feature

[#13867] Support override existing configuration when updating MCP server.
[#13922] Add thread pool configuration to allow core thread timeout.
[#13946] Refactor AgentEndpoint model and add new fields to support advanced protocol and queries.
[#13953] Add support for default security configurations, including selection and setup for inbound and outbound security schemes.
[#13957] Support batch registration of agent endpoints.
[#13951] Add configurable CORS filter for console module.

## Enhancement/Refactor

[#13822] Separate responsibilities between client executor and login scheduled executor to prevent thread pool exhaustion.
[#13863] Optimize shutdown.sh script to combine multiple PIDs into a single line for cleaner process termination.
[#13911] Enhance importToolsFromMcp API to support streamable protocol servers.
[#13914] Upgrade checkStyle plugin version to improve code linting and maintainability.
[#13945] Support merging versions when importing MCP server specifications.
[#13963] Refactor List config apis to support return configTags and desc.

## BugFix

[#13140] Fix consistent namespace handling for ConfigChangeNotifyRequest when client namespace is empty.
[#13860] Fix potential null pointer exception risk in ConfigMigrateService.
[#13866] Fix inability to edit imported MCP servers in the console.
[#13869] Fix error creating bean 'consoleHealthController' due to missing dependency injection.
[#13877] Fix namespaceId issue in McpRemoteHandler causing incorrect context propagation.
[#13882] Fix synchronization lock and add volatile keyword for TpsControlManager to ensure thread safety.
[#13884] Fix JSON parsing error in MCP server validation API during import.
[#13902] Fix deprecated Log4j2 package scanning warnings by updating logger initialization logic.
[#13948] Fix failure when updating agent card through the console interface.
[#13959] Fix Password update fails when deployed with independent console/server.
[#13964] Fix when nacos.extension.ai.enabled is false, nacos start failed.

## Dependencies

[#13879] Add unit tests for AI-related components.
[#13881] Add utility APIs for development and testing purposes.
```

## 2. Nacos 2.5.2 发布

Nacos 社区正式发布`2.5.2`版本！该版本修复了多个旧版本问题。

具体`2.5.2`版本的变更日志如下：

```markdown
This version is mainly do some enhancement and fix some bugs from 2.5.1.

Please see the details of the changes below:

# Change details

## Enhancement&Refactor
[#12102] Fix deprecated Log4j2 package scanning warnings.
[#13183] Add grpc client request metrics switch.
[#13234] Make the IP input box in Listening Query be required.
[#13297] Add build-helper-maven-plugin to support IDEA auto-recognize generated sources.

## BugFix
[#12484] Fix ConfigController.stopBeta srcUser param is null.
[#13171] Fix the full regular dump for gray configuration.
[#13193] Fix Configuration database health check sql for mysql and derby plugin.
[#13218] Fix naming v1 catalog page service api return all datum when pageSize is large.
[#13223] Fix the permission problem of ip dimension query configuration monitoring.
[#13229] Fix the config tag being lost during configuration export.
[#13249] Fix configuration change plugin return incompatibility.
[#13273] Fix create cluster client don't effect fpr nacos.remote.client.grpc config problem.
[#13400] Fix naming subscriber get appName is `-` problem.
[#13614] Fix namespace conversion bug for default namespaceId from `` to `public`.
[#13629] Fix NPE problem when update instance metadata with null value.
[#13716] Fix namespaceId has no default value in the oracle database plugin.
[#13744] Fix CONFIG_INFO_GRAY_WRAPPER_ROW_MAPPER not registered to database plugin.


## Dependency
[#13183] Bump tomcat-embed-core to 9.0.99.
[#13454] Upgrade nacos-logback-adapter to 1.1.4.
```

## 3. About Nacos
Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及AI管理。

Nacos 帮助用户更敏捷和容易地构建、交付和管理云原生AI应用的平台。 Nacos 是构建以“服务”为中心的现代应用架构 (例如微服务范式、云原生范式、AI原生范式) 的服务基础设施。

Nacos 3.0 还有很多待完成的功能及大量待探索和开发的领域，欢迎大家扫码加入 Nacos 社区群及 Nacos MCP社区讨论群，参与 Nacos 社区的贡献和讨论，在 Nacos 社区一起搭把手，让你的代码和能力有机会能在各行各业领域内进行释放能量，期待认识你和你一起共建 Nacos 社区；



_<font style="color:#585a5a;">“Nacos 相信一切都是服务，每个服务节点被构想为一个星球，每个服务都是一个星系；Nacos 致力于帮助这些服务建立连接赋予智能，助力每个有面向星辰的梦想能够透过云层，飞在云上，更好的链接整片星空。”_



Nacos 官网：[https://nacos.io/](https://nacos.io/)

Nacos 仓库地址：[https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)

“Nacos社区群6”群的钉钉群号： 145925004742

“Nacos MCP 社区讨论群2”群的钉钉群号： 115205016856

| ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758610254667-6853e2dc-8e89-4ad5-b938-edfdfde8b0d1.png) | ![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/297800/1758610123865-f1dc233c-d445-492e-bdf8-6ad97afa8e6b.png) |
| --- | --- |




