---
title: 控制台手册
keywords: [控制台,手册]
description: Nacos 控制台主要旨在于增强对于服务列表，健康状态管理，服务治理，分布式配置管理等方面的管控能力。
sidebar:
    order: 9
---

# 控制台手册

[Nacos 控制台](http://console.nacos.io/nacos/index.html)主要旨在于增强对于服务列表，健康状态管理，服务治理，分布式配置管理等方面的管控能力，以便进一步帮助用户降低管理微服务应用架构的成本，将提供包括下列基本功能:

* 服务管理
  * 服务列表及服务健康状态展示
  * 服务元数据存储及编辑
  * 服务流量权重的调整
  * 服务优雅上下线
* 配置管理
  * 多种配置格式编辑
  * 编辑DIFF
  * 示例代码
  * 推送状态查询
  * 配置版本及一键回滚
* 命名空间
* 登录管理

## 1. 特性详解

### 1.1. 服务管理

开发者或者运维人员往往需要在服务注册后，通过友好的界面来查看服务的注册情况，包括当前系统注册的所有服务和每个服务的详情。并在有权限控制的情况下，进行服务的一些配置的编辑操作。Nacos在这个版本开放的控制台的服务发现部分，主要就是提供用户一个基本的运维页面，能够查看、编辑当前注册的服务。

#### 1.1.1. 服务列表管理

服务列表帮助用户以统一的视图管理其所有的微服务以及服务健康状态。整体界面布局是左上角有服务的搜索框和搜索按钮，页面中央是服务列表的展示。服务列表主要展示服务名、集群数目、实例数目、健康实例数目和详情按钮五个栏目。

![image.png | left | 747x281](https://cdn.nlark.com/lark/0/2018/png/15356/1540536911804-3660f0e9-855f-4439-ac23-e76f6f644360.png "")

在服务列表页面点击详情，可以看到服务的详情。可以查看服务、集群和实例的基本信息。

#### 1.1.2. 服务流量权重支持及流量保护

Nacos 为用户提供了流量权重控制的能力，同时开放了服务流量的阈值保护，以帮助用户更好的保护服务服务提供者集群不被意外打垮。如下图所以，可以点击实例的编辑按钮，修改实例的权重。如果想增加实例的流量，可以将权重调大，如果不想实例接收流量，则可以将权重设为0。

![image.png | left | 747x266](https://cdn.nlark.com/lark/0/2018/png/15356/1540537029452-dffbb078-4ae5-4397-9f70-083e0ebbb5be.png "")

#### 1.1.3. 服务元数据管理

Nacos提供多个维度的服务元数据的暴露，帮助用户存储自定义的信息。这些信息都是以K-V的数据结构存储，在控制台上，会以k1=v1,k2=v2这样的格式展示。类似的，编辑元数据可以通过相同的格式进行。例如服务的元数据编辑，首先点击服务详情页右上角的“编辑服务”按钮，然后在元数据输入框输入：version=1.0,env=prod。

![image.png | left | 747x271](https://cdn.nlark.com/lark/0/2018/png/15356/1540537359751-217d7500-c19c-4bad-8508-27f347f48a2f.png "")

点击确认，就可以在服务详情页面，看到服务的元数据已经更新了。

![image.png | left | 747x145](https://cdn.nlark.com/lark/0/2018/png/15356/1540537452673-01dc6c92-329a-4b6f-a616-36dc546c3355.png "")

#### 1.1.4. 服务优雅上下线

Nacos还提供服务实例的上下线操作，在服务详情页面，可以点击实例的“上线”或者“下线”按钮，被下线的实例，将不会包含在健康的实例列表里。

![image.png | left | 747x142](https://cdn.nlark.com/lark/0/2018/png/15356/1540537640435-b28cb279-75af-4965-8a9a-54cee213f1a5.png "")

### 1.2. 配置管理

Nacos支持基于Namespace和Group的配置分组管理，以便用户更灵活的根据自己的需要按照环境或者应用、模块等分组管理微服务以及Spring的大量配置，在配置管理中主要提供了配置历史版本、回滚、订阅者查询等核心管理能力。

![image.png | left | 747x297](https://cdn.nlark.com/lark/0/2018/png/9687/1540458893745-219a46a8-ebd9-405b-9e8f-226f3f0c7e76.png "")

#### 1.2.1. 多配置格式编辑器

Nacos支持 YAML、Properties、TEXT、JSON、XML、HTML 等常见配置格式在线编辑、语法高亮、格式校验，帮助用户高效编辑的同时大幅降低格式错误带来的风险。

Nacos支持配置标签的能力，帮助用户更好、更灵活的做到基于标签的配置分类及管理。同时支持用户对配置及其变更进行描述，方便多人或者跨团队协作管理配置。

![image.png | left | 747x426](https://cdn.nlark.com/lark/0/2018/png/9687/1540458995051-b3e67fd4-c905-4552-9e52-f54b6ef59941.png "")

#### 1.2.2. 编辑DIFF

Nacos支持编辑DIFF能力，帮助用户校验修改内容，降低改错带来的风险。

![image.png | left | 747x338](https://cdn.nlark.com/lark/0/2018/png/9687/1540457990344-a60e1db3-ca1a-47ed-a03e-f92e37745247.png "")

#### 1.2.3. 示例代码

Nacos提供示例代码能力，能够让新手快速使用客户端编程消费该配置，大幅降低新手使用门槛。

![image.png | left | 747x223](https://cdn.nlark.com/lark/0/2018/png/9687/1540456991412-01acc11c-8b48-48d8-9032-589ebb9388d9.png "")

![image.png | left | 747x380](https://cdn.nlark.com/lark/0/2018/png/9687/1540532899571-ccea6b6f-a1e1-44d1-a130-f9afaba01c51.png "")

#### 1.2.4. 监听者查询

Nacos提供配置订阅者即监听者查询能力，同时提供客户端当前配置的MD5校验值，以便帮助用户更好的检查配置变更是否推送到 Client 端。

![image.png | left | 747x185](https://cdn.nlark.com/lark/0/2018/png/9687/1540459212236-0abdc558-68b9-4585-b11e-c9a1924ce7ef.png "")

#### 1.2.5. 配置的版本及一键回滚

Nacos通过提供配置版本管理及其一键回滚能力，帮助用户改错配置的时候能够快速恢复，降低微服务系统在配置管理上的一定会遇到的可用性风险。

![image.png | left | 747x242](https://cdn.nlark.com/lark/0/2018/png/9687/1540459226967-a258b9a7-f95f-41b0-874f-2a0a5da2fc5c.png "")

![image.png | left | 747x493](https://cdn.nlark.com/lark/0/2018/png/9687/1540459237821-d4c06d16-b356-4953-a6e7-da949b1f3aec.png "")

## 2. 命名空间管理

Nacos 基于Namespace 帮助用户逻辑隔离多个命名空间，这可以帮助用户更好的管理测试、预发、生产等多环境服务和配置，让每个环境的同一个配置（如数据库数据源）可以定义不同的值。

![image.png | left | 747x298](https://cdn.nlark.com/lark/0/2018/png/9687/1540519411777-74908cc2-29bc-4270-be58-aed62605228f.png "")

![image.png | left | 747x206](https://cdn.nlark.com/lark/0/2018/png/9687/1540519427066-effd5153-02c9-4e21-ae9f-1a2e9ae7713e.png "")

## 3. 登录管理

Nacos支持简单登录功能，在开启[鉴权](./auth.mdx)功能后启用，管理员用户名为： `nacos`, 密码需要在首次开启控制台时进行初始化。

![login](https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561262748106-4fc05174-bf70-4806-bcbd-90296c5bcbaa.jpeg)

### 3.1. 修改默认用户名/密码方法

#### 3.1.1. 初始化时生成

当Nacos集群开启鉴权后访问Nacos控制台时，会校验是否已经初始化过管理员用户`nacos`的密码，若发现未初始化密码时，则会跳转至初始化密码的页面进行初始化。在该页面密码文本框内输入自定义密码，然后点击提交即可；

> 注意：若密码文本框内未输入自定义密码或输入空白密码，Nacos将会生成随机密码，请保存好生成的随机密码。

初始化成功后会弹窗提示初始化成功，并展示指定的密码或随机生成的密码，请保存好此密码。

#### 3.1.2. 控制台上修改

1. 登录控制台，选择`权限控制` -> `用户列表`。
2. 找到nacos用户，并在该用户对应的`操作`列表中点击`修改`按钮，进行密码修改

### 3.2. 关闭登录功能

Nacos默认控制台在`2.2.2`版本前，无论是否开启[鉴权](../../guide/user/auth.md)功能，默认控制台都会跳转到登录页，导致用户被误导认为控制台存在鉴权功能，实际没有开启鉴权，存在安全隐患。

经过社区和安全工程师协商讨论，需要在使用Nacos默认控制台时，鉴权开关关闭时将会自动关闭控制台登录功能。

当鉴权开关`nacos.core.auth.enabled`关闭时，Nacos默认控制台将不再跳转登录页，同时添加页面提示，提示当前集群未开启鉴权功能。

同时针对自定义的[鉴权插件](../../plugin/auth-plugin.md)添加新接口`com.alibaba.nacos.plugin.auth.spi.server.AuthPluginService#isLoginEnabled(默认返回false)`来对自定义插件进行登录页控制。

### 3.3. 关闭默认控制台

部分公司或用户希望关闭默认控制台，使用公司的统一平台进行Nacos的配置和服务管理；或将控制台鉴权和客户端访问的鉴权分离，即控制台操作进行鉴权但客户端请求不进行鉴权。

可以通过`${nacoshome}/conf/application.properties`中的`nacos.console.ui.enabled`来开启或关闭Nacos默认控制台，默认为开启。

同时在关闭默认控制台时，默认控制台会读取`${nacoshome}/conf/console-guide.conf`文件中的内容，并在默认控制台中生成引导页，让维护者自定义将使用默认控制台的用户引导向自定义的统一平台上进行操作。

### 3.4. 会话时间

默认会话保持时间为30分钟。30分钟后需要重新登录认证。可通过`${nacoshome}/conf/application.properties`中的`nacos.core.auth.plugin.nacos.token.expire.seconds`来设置会话保持时间。

## 4. 社区参与的前端共建

在Nacos前端风格、布局的讨论中，社区踊跃投票，最终选择了这套经典黑白蓝风格的皮肤，并且通过我们UED程瑶同学的设计，布局，让交互变得十分自然流畅。 后续又由社区添加了深色主题风格，可以让Nacos控制台在两种样式主题中切换。

在控制台的开发之前，我们通过社区招募到了很多前端同学一起参与了前端代码的开发，在此尤其感谢李晨、王庆、王彦民等同学在Nacos前端开发过程中的大力支持！

## 5. 坚持社区化发展，欢迎加入并贡献社区

> 比吐槽更重要的是搭把手，参与社区一起发展Nacos！

要加入Nacos 社区群进行讨论和参与贡献，请扫描下方二维码加入社区群。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1577777/1679276899363-83081d59-67c6-4501-9cf8-0d84ba7c6d7e.png#averageHue=%23c1c2c2&clientId=u9dfeac18-3281-4&from=paste&height=551&id=ubcf45e51&name=image.png&originHeight=1102&originWidth=854&originalType=binary&ratio=2&rotation=0&showTitle=false&size=155261&status=done&style=none&taskId=ud6bea1fe-b003-441b-a810-84435d2aeff&title=&width=427)

更多与 Nacos 相关的开源项目信息：

* [Nacos](https://github.com/alibaba/nacos)
* [Nacos Spring Project](https://github.com/nacos-group/nacos-spring-project)
* [Nacos Spring Boot](https://github.com/nacos-group/nacos-spring-boot-project)
* [Spring Cloud Alibaba](https://github.com/alibaba/spring-cloud-alibaba)
* [Dubbo](https://github.com/apache/dubbo)
* [Sentinel](https://github.com/alibaba/Sentinel)