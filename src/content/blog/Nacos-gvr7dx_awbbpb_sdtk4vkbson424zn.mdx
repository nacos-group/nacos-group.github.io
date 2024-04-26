---
title: "Nacos 安全零信任实践"
description: "Nacos 安全零信任实践"
date: "2024-04-22"
category: "article"
keywords: ["Nacos"]
authors: "CH3CHO"
---

作者 柳遵飞<br />Nacos 作为配置中心经常存储一些敏感信息，但是由于误用导致安全风险，最常见的主要是以下两个问题：<br />1、Nacos暴露公网可以吗？ 不可以，因为Nacos定位是注册配置中心，是内部系统，不应该暴露到公网使用。<br />2、不得已要开公网不开鉴权可以吗？ 不可以，开公网不开鉴权等同于裸奔，为黑客攻击创造充分条件。

看到赶紧自查一下是否有这两类问题，如果有立即解决一下！！！  解决完这些基础问题，可以看一下下面安全的进阶玩法。
<a name="cf040"></a>
# 安全问题的现实背景
Nacos作为国内被广泛使用的注册配置中心，是云原生时代不可或缺的基础中间件组件，在开源社区拥有庞大的开发者群体，Nacos也被广泛运行在生产环境之中。随着当前云计算，物联网，大数据AI等技术的兴起，相比于传统的基于“安全内网”的网络架构，现代的系统网络部署架构复杂性上升，传统的网络边界逐渐模糊化，对传统的网络安全架构产生了极大的冲击，业内数据泄露，网络攻击等事件频发，安全问题给企业的发展带来的影响越来越大。在此背景下，安全零信任的理念逐渐兴起，成为了现代化网络安全架构的指导思想，本文将介绍如何基于安全零信任的理念来保证Nacos的数据安全。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713423908204-e4f4731f-75f3-451e-abde-ff3ac9052c94.png#clientId=ud164d702-1502-4&from=paste&height=831&id=u32fffc78&originHeight=1828&originWidth=3410&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=3720871&status=done&style=none&taskId=ubd763543-1374-42f6-96cd-321126c5410&title=&width=1549.9999664046554)<br />今天分享的内容分为三个部分展开，第一个部分会简单介绍下Nacos这款产品以及其常见的一些使用场景，第二个部分会根据Nacos运行时的原理来分析其可能面临的安全风险，没有对Nacos做必要安全保护也是当前造成Nacos数据泄露的真实现状，最后一个部分会分享Nacos在安全零信任理念下的最佳实践，如何让Nacos更加安全的运行在生产环境。
<a name="bUaVW"></a>
# Nacos发展及使用场景
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713423960185-9dd54cc1-e426-4751-8ba4-f38d0e7cbd16.png#clientId=ud164d702-1502-4&from=paste&height=845&id=u95b8f281&originHeight=1860&originWidth=3440&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1890978&status=done&style=none&taskId=u06eb07ce-05ff-4f80-9827-4309b489ed3&title=&width=1563.6363297454589)<br />Nacos是什么？它的名字是由服务和配置管理的英文首字母，他的核心功能包括动态服务发现管理，动态配置管理，动态DNS服务。动态服务管理可以和上层的微服务RPC调用框架结合，比如Spring Cloud， Dubbo等实现节点上下线自动流量拆除或者上线，动态配置管理提供了在运行期不重启业务节点的情况下改变业务应用的运行时行为，也可以结合CoreDNS将Nacos上注册的服务导出为DNS域名来实现动态DNS服务。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424026465-2912b6bd-97e3-4dcc-b37c-7cb6663b7ee3.png#clientId=ud164d702-1502-4&from=paste&height=892&id=ufa6bee27&originHeight=1962&originWidth=3554&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=6479714&status=done&style=none&taskId=u42369dbb-aee3-4200-97fe-25660084534&title=&width=1615.454510440512)<br />Nacos 将阿里巴巴集团内部Diamond，ConfigServer，VipServer三款中间件融合进一款产品，承袭了阿里内部十几年双十一大促的性能，稳定性，高可用方面的技术经验，2018年从阿里内部开源以来，无论从github上的star数，fork数，社区活跃度还是知名技术网站论坛评选的奖项可以看出它的受欢迎程度。从注册配置中心单一领域产品角度看，Nacos现在是国内首选，被非常多的头部企业使用，占据国内60%+的市场份额。<br />Nacos能收到这么多开源社区的关注度和参与度，和它的使用场景是息息相关的。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424054235-44a1c6e6-b907-40d6-a626-fdeee073133c.png#clientId=ud164d702-1502-4&from=paste&height=818&id=ud72eed62&originHeight=1800&originWidth=3562&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=2481452&status=done&style=none&taskId=u3550d490-7c88-44ec-a7e3-bc2af73d2ec&title=&width=1619.0908739980596)<br />上图列举了Nacos的一些非常常见的使用场景，覆盖了微服务领域，高可用领域，前端生态，数据库领域等等，产品功能角度看，服务发现和注册涉及的场景会相对聚焦一些，它所承载的数据是服务名或者域名到ip地址的映射关系，而配置管理涉及的场景就会丰富很多，可以说是涉及到任何的领域。从上面图中可以看出，其中有一些非常关键的场景都是靠配置中心来完成的，比如流量调度，路由规则，应急预案，一些业务的关键开关，数据库的一些数据源配置。<br />这些数据是非常敏感的，如果数据被误写，密码数据被泄露，可能会产生非常大的数据安全问题。<br />在业界内也发生过不少的敏感数据泄漏事件，用户把开源的Nacos部署到了生产环境，但没有对Nacos做一些必要的安全防护的措施，当前行业对安全方面的意识也在逐渐提高，国家颁布的网络安全三级等保也对非银行业的平台做了若干个角度的安全要求。
<a name="kkwzp"></a>
# Nacos面临的安全问题![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424112815-a1166b26-a651-4adb-a5aa-dc37f58d57b6.png#clientId=ud164d702-1502-4&from=paste&height=846&id=u288b84c0&originHeight=1862&originWidth=3564&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=4956853&status=done&style=none&taskId=u25d77982-b142-4117-81fc-a4cb00722a8&title=&width=1619.9999648874464)
上面是Nacos运行时的简要示意图，左侧是业务应用和nacos-client，通常是部署在一个进程中，右侧是Nacos的服务端，包括Nacos-Server和中心化的持久化存储。从数据流转方向上看，数据由业务应用侧产生调用nacos-client的配置发布接口，通过网络传输至Nacos-Server端，Nacos-Server端将配置内容持久化存储，并且从持久化存储加载到Server本地的磁盘缓存和内存缓存中，客户端查询配置时将配置内容从服务端拉取到本地，出于高可用容灾的考虑，客户端会将配置内容缓存在客户端本地磁盘中。从数据的角度看，配置内容会存在于业务应用本地的磁盘缓存，服务端本地的磁盘缓存，持久化的数据库中，并且数据会在传输过程中经过每一个中间网络设备。<br />现在我们做个假设，让我们先忽略安全内网，假设这些组件都是暴露在公网之中。基于这个假设，可能会存在以下几个方面的问题。

   - **业务应用机器被入侵**

因为nacos的配置数据会在客户端进行缓存，所以如果业务应用的机器被入侵，本地缓存中的配置内容也会泄漏

   - **数据传输过程中被中间网络设备获取**

数据经过中间网络设备，可能被流量抓包，如果数据是明文传输，数据就会泄漏

   - **Nacos服务端被入侵**

            如果Nacos服务端所部署的机器被外部攻破，那么存在于本地磁盘缓存内的也会被明文获取

   - **持久化层数据库被拖库**

             配置存储的中心化数据库被拖库也会导致配置泄露

   - **Nacos服务端可公开访问**

Nacos服务端没有开启权限访问，任何知道server节点IP地址的人都可以通过Nacos接口API拉取到配置内容，或者对Nacos服务端的节点设置了比较宽泛的ACL规则，这两种情况在用户使用Nacos的场景中都比较常见，比如在商业化MSE Nacos的真实案例中，有很多用户给实例开了公网访问并且设置了比较宽泛的ACL规则的情况下没有开启鉴权，这些都是风险比较高的场景。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424143835-a51c202a-2371-436c-910e-f084e8af3edc.png#clientId=ud164d702-1502-4&from=paste&height=795&id=u02763dc1&originHeight=1750&originWidth=3540&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=2930129&status=done&style=none&taskId=u5e1e953a-c0f5-4254-99b9-69334c41497&title=&width=1609.0908742148035)<br />我们对以上的几个问题进行一些简单的归纳，可以分为三个方面，存储安全，传输安全，访问控制。<br />上面我们做了几个假设，比如忽略安全内网隔离的问题，假设每一个环境都可能会被攻破的。其实这也就是安全零信任理念中一个非常重要的原则，”永不信任，永远验证“，下一节我们将介绍下Nacos的安全零信任实践，如何通过安全零信任理念来保障Nacos数据安全。
<a name="SX0W0"></a>
# Nacos安全零信任实践
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1712816663849-a9061707-933f-42c1-9a4a-468844e49451.png#clientId=uf7634ed2-a985-4&from=paste&height=541&id=ua1e564af&originHeight=1082&originWidth=1920&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1167964&status=done&style=none&taskId=u31334da2-ce2f-4415-aa38-a9cb24349ef&title=&width=960)<br />我们先简单了解下安全零信任的相关内容。<br />**零信任的定义**<br />顾名思义，即对任何未经验证的访问实体默认不信任。零信任是一种现代化的网络安全访问理念，核心思想是“永不信任，持续验证”。<br />**零信任解决的问题**<br />它诞生的背景是基于当前IT网络架构下的一系列现实因素。

- 网络边界模糊化，现代系统网络架构更加负责，云计算，物联网等兴起打破了传统的”安全内网“边界
- 安全漏洞无法避免：网络攻击和数据泄露事件增加，传统安全模型无法应对
- 数据泄露风险：数据泄露对企业造成的直接经济损失以及舆情影响
- 合规性要求：整体大环境下，行业和法规要求企业对网络安全实时更加严格的验证

**零信任基本功能**<br />零信任的几个基本功能包括：<br />•身份管理：提供对身份全生命周期管理<br />•身份认证：对所以访问的来源进行身份认证<br />•访问控制：确保对网络实体发起访问的资源进行授权<br />•传输安全：确保所有在网络中传输的数据不被窃取和篡改<br />•行为监控：对行为进行持续监测，实时响应异常<br />**零信任基本原则**<br />•永不信任，永远验证<br />•访问控制，最小权限访问<br />•微分段，防止横移，减少攻击面
<a name="jX4lD"></a>
## Nacos传输安全
接下来我会按照Nacos传输安全，存储安全，访问控制三个方面来介绍Nacos的安全零信任实践。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424189014-7fe97632-3ab9-44f8-86ca-ad3825e4f615.png#clientId=ud164d702-1502-4&from=paste&height=863&id=ua32050ff&originHeight=1898&originWidth=3540&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=3481401&status=done&style=none&taskId=u2919d3c0-623c-426b-9ace-77bdbb05b4c&title=&width=1609.0908742148035)<br />第一个方面是Nacos传输安全TLS，我们知道TLS解决的是数据传输过程中的三个问题，一个是数据保密性，基于TLS传输的数据都会被加密，无法被第三方获取明文，第二个是完整性，它保证的是数据不被第三方篡改，第三个是身份认证，它解决的是通信双方的身份认证问题，防止中间人攻击。<br />TLS的握手过程分为几个主要阶段，这里做了部分简化，第一个阶段是客户端和服务端之间进行TLS协议版本，加密算法，压缩方法等基本信息的确认   第二阶段是双方的证书交换及验证，这里保证的是身份认证的问题 ，第三个阶段是双方通过非对称加密来协商后续实际传输报文过程中所使用对称秘钥，第四个阶段，双方发送加密切换消息，双方开始基于对称加密秘钥进行通信  第5个阶段是进行实际的应用报文传输，这里会使用对称加密进行数据传输，同时对报文进行MAC校验保证完整性。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424222106-7d93a7c4-5de3-4b92-bf7d-4c094b301eab.png#clientId=ud164d702-1502-4&from=paste&height=882&id=u50aa6930&originHeight=1940&originWidth=3506&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1873902&status=done&style=none&taskId=u6202366e-4a84-4241-b969-7b792512e66&title=&width=1593.6363290952265)<br />Nacos在2.x的版本中使用grpc来作为底层通信协议，grpc内部使用netty作为网络通信框架，nacos的TLS能力也是基于grpc/netty来实现的，该图中描述了客户端服务端的基本组件，其中淡蓝色部分是用户通过参数来控制是否开启TLS的方式，包括属性文件，jvm参数，环境变量。深蓝色部分是nacos层提供的组件来接受参数，并将参数转换为底层grpc、netty的组件来实现TLS功能。另外在server端我们支持了服务端证书的动态轮转功能，可以自定义SPI扩展来实现当服务端证书文件变更时的处理逻辑。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424329446-597ea61a-3475-4553-ae87-2e98f490defd.png#clientId=ud164d702-1502-4&from=paste&height=866&id=u03ea0e59&originHeight=1906&originWidth=3546&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=2395074&status=done&style=none&taskId=u5af91a07-62a3-40a8-bfb0-67362c7ee81&title=&width=1611.8181468829644)<br />这里我们介绍Nacos如何开启TLS传输加密功能，整个过程分为三步：

- 证书准备

      可以通过购买商业证书来获得相关的文件信息，如果是开发测试，可以通过keytool openssl自签的方式来生成SSL证书，该步骤可以参考网上的自签SSL证书流程，此处不在赘述。这一步中需要得到如下几个信息：

   - CA证书文件：用于对端的证书合法性，对端使用的证书必须是通过是由该CA签发，防止身份冒充中间人攻击   
   - 证书文件&证书私钥文件：用于服务端开启TLS功能
   - 私钥文件密码：处于安全性考虑，通常需要为私钥文件设置密码。
- Nacos服务端启动
   - nacos.remote.server.rpc.tls.enable=true

开启TLS开关，设置为true表示服务端开启TLS功能

   - nacos.remote.server.rpc.tls.certChainFile={certFilePath}

指定证书文件路径

   - nacos.remote.server.rpc.tls.certPrivateKey={keyPath}

指定证书私钥文件

   - *nacos.remote.server.rpc.tls.mutualAuth=true/false

是否开启双向认证，默认为false，设置为true表示需要验证客户端的身份，客户端也需要同步设置证书和私钥文件

   - *nacos.remote.server.rpc.tls.trustCollectionChainPath={trustFilePath}

受信任客户端CA证书，当开启双向认证时，用于校验客户端的证书合法性

   - *nacos.remote.server.rpc.tls.compatibility=true/false 

是否支持非加密客户端，默认是true

   - *nacos.remote.server.rpc.tls.sslContextRefresher={spiName} 

指定证书轮转感应器SPI名称

- Nacos客户端启动
   - nacos.remote.client.rpc.tls.enable=true

客户端开启TLS开关，如果设置为true的情况下，服务端不支持TLS或者没有开启TLS，则会连接失败

   - nacos.remote.client.rpc.tls.trustAll=true/false

是否信任所有支持TLS的服务端，设置为true表示不对服务端证书进行CA校验

   - *nacos.remote.client.rpc.tls.trustCollectionChainPath={trustFilePath}

trustAll为false时，需要设置受信任服务端CA证书文件

   - *nacos.remote.client.rpc.tls.mutualAuth=true/false

是否开启双向认证，设置为true时，则需要同步设置客户端的证书文件和私钥

   - *nacos.remote.client.rpc.tls.certChainFile={certFilePath}

指定客户端的证书文件路径

   - *nacos.remote.client.rpc.tls.certPrivateKey={keyPath}

指定客户端的证书私钥文件 

<a name="SV6Gp"></a>
## Nacos存储安全
配置存储安全解决的问题是当各个可能存在配置内容的介质被攻破，配置被明文访问的问题。在这种情况下，我们需要对配置内的内容进行加密存储，加密存储需要第三方加密系统来辅助完成，复杂性会上升，通常我们建议对部分敏感配置进行加密存储。下面我们将介绍如何通过配置的加解密插件来实现敏感配置存储。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424372341-22385f76-3e1a-4ac9-ad37-b95cdde18752.png#clientId=ud164d702-1502-4&from=paste&height=834&id=uace9f462&originHeight=1834&originWidth=3532&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1720839&status=done&style=none&taskId=u649bcaef-91ae-4aef-adee-0633c30e77b&title=&width=1605.4545106572562)<br />上图介绍了加密配置的发布过程，明文内容在业务应用中产生，经由nacos-client发往服务端，在客户端内部，加密配置经过IConfigFilter过滤器，会经过加解密插件的加密encrypt步骤，将明文转化为密文和dataKey，通常的做法是本地先生成一个随机key，通过这个随机key对明文内容进行本地加密为密文，将key经由加解密插件加密的dataKey，然后把将密文配置内容和加密后的dataKey发向服务端，服务端将密文+dataKey进行持久化存储，并且通知集群所有节点将密文+dataKey从数据库加载到服务端本地的磁盘缓存和内存缓存中。这种情况下，即使服务端被攻破，持久化数据库被拖库，无法通过密文+dataKey解密对应的明文，降低数据泄露带来的安全风险。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424398923-3485676b-5ac3-47d6-8226-896e706403c2.png#clientId=ud164d702-1502-4&from=paste&height=874&id=uab151889&originHeight=1922&originWidth=3534&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1889139&status=done&style=none&taskId=u2647a744-e03b-42ad-b55a-e285850836b&title=&width=1606.363601546643)<br />接下来是加密后的配置的查询过程，客户端从服务端查询配置，服务端将密文+dataKey返回给客户端，客户端经由IConfigFilter过滤器，会经过加解密插件的解密decrypt，将密文+dataKey解密为明文，然后在内存中将明文回调给业务的监听器，其中客户端本地缓存中存储的是密文和dataKey，并不是明文，以此来保证整个链路中的配置存储安全。<br />在整个链路中引入了第三方加解密插件，增加数据安全的同时，也会带来额外的链路复杂度，我们建议是对一些敏感信息进行加解密，比如用户名密码，数据库配置，AK/SK, Token等。同时因为加解密插件实现了密文->明文的加密过程，在与其的交互过程中也要保证数据传输安全，并且如果它是有状态的，也要保证它的存储安全。在商业化MSE Nacos中，我们使用KMS作为第三方加解密插件的实现方，来保证整体的数据安全。
<a name="BMhAG"></a>
## Nacos访问控制
第三个部分，我们将介绍如何通过Nacos鉴权插件实现对Nacos的访问控制。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424446425-90e1a039-4be8-432c-a83d-55d671004a82.png#clientId=ud164d702-1502-4&from=paste&height=846&id=u596941a6&originHeight=1862&originWidth=3574&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=1857930&status=done&style=none&taskId=u9dccc36d-0ad3-454e-a7b7-66f1c38e6af&title=&width=1624.5454193343808)<br />鉴权插件对Nacos访问控制进行了基础的模型抽象，分为客户端和服务端，两者通过约定的规则实现整体的访问控制功能。

- 客户端
   - 提取识别客户端身份信息IdentityContext
   - 使用身份信息对访问资源进行签名
   - 在报文中上传身份信息+签名
- 服务端
   - 提取客户端上传的身份信息 identityNames
   - 验证身份合法性及验证签名 validateIdentity
   - 验证身份与访问资源的权限 validateAuthority

身份信息IdentityContext可以是用户名密码，AK/SK, 或者STS/RAM ROLE自动轮转的AK/TOKEN，如果想自定义实现自己的身份信息，只需要按需实现SPI即可，也可在自定义实现中实现动态身份轮转的逻辑。无论使用哪种身份识别信息，客户端和服务端要保持一致的规则，包括身份信息的提取以及签名验证的逻辑。<br />服务端处理身份验证和签名验证之外，还需要对身份和访问资源进行权限的校验，用户权限管理比较通用的是RBAC模型，RBAC全称是基于角色的访问控制，当前Nacos默认的鉴权插件也就是使用这个模型。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424473496-84695f27-9b56-4da1-8b29-018e8a8d9455.png#clientId=ud164d702-1502-4&from=paste&height=882&id=u6fd3db70&originHeight=1940&originWidth=3572&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=2275882&status=done&style=none&taskId=ue36179af-b151-42c2-a582-b5af5b48551&title=&width=1623.636328444994)<br />RBAC模型由权限-角色-用户三个部分组成。

- 权限：权限定义了对指定资源的访问规则，包括资源定义+ 操作(读/写)+许可(允许/拒绝)，比如允许对命名空间A下的配置进行读操作。
- 角色：拥有一系列权限集合的虚拟身份，它包含了多个权限的集合，比如定义命名空间A管理员角色，给其赋于对命名空间A下的配置进行读写操作。
- 用户：可实际访问系统的实体用户，用于一个代表自身身份的标识，可以将多个角色赋于实体的用户，间接拥有多种权限。分为管理员和普通用户，管理员拥有最高权限，一般对其会进行MFA多因素认证。普通用户由管理员创建，可以给用户赋于多种角色。

上面提到，Nacos默认的鉴权插件也是基于RBAC模型构建，可以完成基本的权限控制，开启默认的鉴权功能需要创建users，roles， permissions三张表用于存储对应的数据。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424501369-3433a977-0e4a-4527-9ab2-739375704dd4.png#clientId=ud164d702-1502-4&from=paste&height=836&id=u20e64bc7&originHeight=1840&originWidth=3522&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=3089072&status=done&style=none&taskId=ub5b0a04f-d81f-4dfe-9af7-db8098f635f&title=&width=1600.9090562103215)<br />开启Nacos访问控制需要三步：<br />**一 .服务端开启鉴权**

   - 打开鉴权开关：nacos.core.auth.enabled=true
   - 设置鉴权插件：nacos.core.auth.system.type=nacos ,指定为nacos模型内置鉴权插件名

**二.创建用户/角色/权限**

   - 修改admin角色默认密码：开启服务端鉴权开关后，登录Nacos控制台需要设置用户名密码，首次登录后务必替换默认密码。开启鉴权后，登录控制台，左侧会出现权限控制的菜单。
   - 创建普通用户，设置用户名密码
   - 创建角色，绑定用户-角色
   - 创建权限，绑定资源访问规则和角色的关系

**三. 创建用户/角色/权限**<br />        服务端打开鉴权之后，控制台登录需要验证用户名密码，通过nacos-client进行接口调用时也需要传入用户名，密码，在构建ConfigService和NamingService时需要在properties属性中传入用户名密码，否则接口访问会返回403无权限错误码。

*开源默认的鉴权插件当前支持基于命名空间粒度的权限控制，MSE商业化Nacos基于阿里云产品RAM实现访问控制，可以支持细粒度服务serviceName/配置dataId级别权限控制。
<a name="ZalnP"></a>
# 结语
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/2483/1713424533465-4ad930e3-6626-4f5a-8c98-1bb91f29484d.png#clientId=ud164d702-1502-4&from=paste&height=862&id=u5598b422&originHeight=1896&originWidth=3484&originalType=binary&ratio=2.200000047683716&rotation=0&showTitle=false&size=2143633&status=done&style=none&taskId=u21f6bcaf-41d4-4aff-9be6-cec9c278463&title=&width=1583.6363293119705)<br />以往我们更多地从用户的易用性角度出发，为了降低Nacos使用门槛，安全层面往往被忽视，在过去一年内，Nacos在安全方面做了很大的投入，其中也因为安全问题做了一下breakchange的版本更新，删除了一些默认的安全方面的参数，提升用户在使用Nacos过程中的安全意识。<br />除了实现业务功能，安全问题也是当下每一个架构师需要关注的必不可少的方面。上面我们介绍了如何在使用开源Nacos过程中实现传输安全，存储安全，访问控制三方面来构建安全零信任架构，在此我们倡议在生产环境使用Nacos中默认开启访问控制，关闭匿名访问，对身份权限进行精细化权限管控，使用TLS保证数据传输安全，并在此基础之上，使用加解密插件对高敏感信息进行加密存储。未来在开源Nacos侧我们会持续完善安全防护策略，在快速入门中引导安全相关设置，开源控制台中增加更多的提示，加强用户数据安全意识建设。<br />Nacos是一款开源产品，我们在2.0的版本中进行了多个插件化改造，用户可以进行插件化定制或者增强自建Nacos的安全等级，这些需要一些额外的定制开发工作。这里推荐大家试用商业化MSE Nacos ，可获得一站式安全防护能力。在商业化MSE Nacos中我们提供了完善了安全防护能力，包括TLS证书统一管理分发及自动轮转，联合KMS3.0支持加解密解决方案，结合RAM实现了完善细粒度的鉴权规则，支持日常安全巡检，风险管理等进阶安全防护能力，如果你有更多的安全需求，也欢迎联系我们（钉钉群号：_23371469_）。

