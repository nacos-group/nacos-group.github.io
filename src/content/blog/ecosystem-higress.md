---
title: Higress + Nacos 微服务网关最佳实践
keywords: [higress, higress nacos]
description: Higress：Nacos的最佳拍档
author: 澄潭
date: "2023-01-10"
category: ecosystem
---

# 前言
在去年11月的云栖大会上，我们开源了云原生网关 Higress，时隔 2 月，Higress 的 Github 项目([https://github.com/alibaba/higress](https://github.com/alibaba/higress))已经收获了 700+ star，以及大量社区小伙伴的关注。在社区的交流中我们发现有不少微服务开发者在使用如 Spring Cloud Gateway/Zuul 等微服务网关对接 Nacos 注册中心实现微服务的路由，并且希望了解迁移到 Higress 网关能带来哪些好处。
本文将介绍 Higress 组合 Nacos 作为微服务网关能力，并介绍微服务网关发展的两个趋势，为网关的选型指明道路：

- 趋势一：统一 API 标准，向云原生微服务架构演进
- 趋势二：合并安全&流量网关，向 DevSecOps 演进
## Higress：Nacos的最佳拍档
![image.png](https://img.alicdn.com/imgextra/i2/O1CN01Ww9gDw1PwXJUlwwRy_!!6000000001905-2-tps-1200-475.png)
Higress 和 Nacos 其实是师出同门——阿里中间件团队。在 Higress 支撑阿里内部业务的阶段，Higress 就已经搭配 Nacos 作为微服务网关使用，凭借高性能支撑了双十一的洪峰流量；到了云产品商业化阶段，Higress 和 Nacos 继续基于阿里云 MSE（Microservices Engine）产品，紧密协作演进产品功能；Higress 开源之后，如果想要自建微服务网关，选择 Higress 配合 Nacos 使用，具备以下优势：

1. 对比 Spring Cloud Gateway/Zuul 等传统 Java 微服务网关性能高出 2-4 倍，可以显著降低资源成本
2. 作为云原生网关，实现了 Ingress/Gateway API 标准，兼容 Nginx Ingress 大部分注解，支持业务渐进式向基于 K8s 的微服务架构演进
3. 与 Dubbo/OpenSergo/Sentinel 等开源微服务生态深度整合，提供最佳实践

这里默认已经安装好 Higress，搭配 Nacos 使用的具体方式如下：
### 配置服务来源
```yaml
apiVersion: networking.higress.io/v1
kind: McpBridge
metadata:
  name: default
  namespace: higress-system
spec:
  registries:
    # 定义一个名为 “production” 的服务来源
  - name: production
    # 注册中心类型是 Nacos 2.x，支持 gRPC 协议
    type: nacos2  
    # 注册中心的访问地址，可以是域名或者IP
    domain: 192.xxx.xx.32
    # 注册中心的访问端口，Nacos 默认都是 8848
    port: 8848
    # Nacos 命名空间 ID
    nacosNamespaceId: d8ac64f3-xxxx-xxxx-xxxx-47a814ecf358    
    # Nacos 服务分组
    nacosGroups:
    - DEFAULT_GROUP
    # 定义一个名为 “uat” 的服务来源
  - name: uat
    # 注册中心类型是 Nacos 1.x，只支持 HTTP 协议
    type: nacos
    # 注册中心的访问地址，可以是域名或者IP
    domain: 192.xxx.xx.31
    # 注册中心的访问端口，Nacos 默认都是 8848
    port: 8848
    # Nacos 命名空间 ID
    nacosNamespaceId: 98ac6df3-xxxx-xxxx-xxxx-ab98115dfde4    
    # Nacos 服务分组
    nacosGroups:
    - DEFAULT_GROUP    
```
我们通过 McpBridge 资源配置了两个服务来源，分别取名 “production”和“uat”，需要注意的是 Higress 对接 Nacos 同时支持 HTTP 和 gRPC 两种协议，建议将 Nacos 升级到 2.x 版本，这样可以在上述配置的 type 中指定 “nacos2” 使用 gRPC 协议，从而更快速地感知到服务变化，并消耗更少的 Nacos 服务端资源。
基于 McpBridge 中的 registries 数组配置，Higress 可以轻松对接多个且不同类型的服务来源（Nacos/Zookeeper/Eureka/Consul/...），这里对于 Nacos 类型的服务来源，支持配置多个不同命名空间，从而实现不同命名空间的微服务可以共用一个网关，降低自建微服务网关的资源成本开销。
### 配置 Ingress 
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    higress.io/destination: service-provider.DEFAULT-GROUP.d8ac64f3-xxxx-xxxx-xxxx-47a814ecf358.nacos
  name: demo
  namespace: default
spec:
  rules:
  - http:
      paths:
      - backend:
          resource:
            apiGroup: networking.higress.io
            kind: McpBridge
            name: default
        path: /
        pathType: Prefix
```
和常见的 Ingress 在 backend 中定义 service 不同，这里基于 Ingress 的 resource backend 将上面定义服务来源的 McpBridge 进行关联。并通过注解`higress.io/destination`指定路由最终要转发到的目标服务。对于 Nacos 来源的服务，这里的目标服务格式为：“服务名称.服务分组.命名空间ID.nacos”，注意这里需要遵循 DNS 域名格式，因此服务分组中的下划线'_'被转换成了横杠'-'。
### 丰富的微服务网关能力
Higress 在微服务发现的基础上，提供了多种实用的微服务网关能力，这里以“灰度发布”和“自定义扩展”进行举例，更多能力可以点击原文参考 Higress 官网文档进行了解。
#### 灰度发布
Higress 完全兼容了 Nginx Ingress 的金丝雀（Canary）相关注解，如下所示，可以将带有HTTP Header为x-user-id: 100的请求流量路由到灰度服务中。
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    higress.io/destination: service-provider.DEFAULT-GROUP.98ac6df3-xxxx-xxxx-xxxx-ab98115dfde4.nacos
    nginx.ingress.kubernetes.io/canary: 'true'
    nginx.ingress.kubernetes.io/canary-by-header: x-user-id
    nginx.ingress.kubernetes.io/canary-by-header-value: '100'
  name: demo-uat
  namespace: default
spec:
  rules:
  - http:
      paths:
      - backend:
          resource:
            apiGroup: networking.higress.io
            kind: McpBridge
            name: default
        path: /
        pathType: Prefix
```
您还可以基于 OpenKruise Rollout 让灰度发布和服务部署过程联动，从而实现渐进式交付，具体可以参考这篇文章[《Higress & Kruise Rollout: 渐进式交付为应用发布保驾护航》](https://mp.weixin.qq.com/s/vqwAUITNq9_twYHWX_5ZDg)
#### 自定义扩展
作为微服务网关，需要在微服务架构中承担部分通用逻辑的处理，例如认证鉴权，安全防护等。通用的逻辑无法满足多样性的业务场景，Higress 可以支持开发者添加自定义处理逻辑。与 Spring Cloud Gateway 等传统微服务网关需要开发者自己在 Gateway 代码中加 Filter 不同，Higress 支持开发者使用多种语言编写 Wasm 插件，并动态加载生效，插件生效过程无需重启网关，变更插件逻辑对流量完全无损。
下例是一个屏蔽特定请求的 Wasm 插件，当请求 url 中出现 “swagger.html” 时将被直接拒绝访问，插件实现代码参考：[https://github.com/alibaba/higress/tree/main/plugins/wasm-go/extensions/request-block](https://github.com/alibaba/higress/tree/main/plugins/wasm-go/extensions/request-block)
```yaml
apiVersion: extensions.istio.io/v1alpha1
kind: WasmPlugin
metadata:
  name: request-block
  namespace: higress-system
spec:
  selector:
    matchLabels:
      higress: higress-system-higress-gateway
  pluginConfig:
    block_urls:
    - "swagger.html"
  url: oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block:1.0.0
```
Wasm 插件的开发&编译&镜像推送方式可以参考这篇文章[《Higress 实战：30 行代码写一个 Wasm Go插件》](https://mp.weixin.qq.com/s/eoPlaOgRm7u5wJAxhbVGGg)
## 微服务网关发展趋势
### 趋势一：统一 API 标准，向云原生微服务架构演进
基于一套 API 可以有不同的实现，既让用户不被具体实现锁定，又桥接了技术演进的鸿沟。API 可以说是整个云原生架构的基石，或许有一天 K8s 会消失，但是面向抽象的 API 标准定会长存。在流量网关领域，Ingress API 已经成为标准。而对于微服务网关等更复杂的使用场景，Ingress 受限于其简单的协议字段，需要通过 Ingress 注解等方式进行能力扩展，难以被标准化。因此诸如 Contour、Emissary、Kong、APISIX 等都定义了自己的 HTTP 路由等 CRD，网关的 API 定义开始呈现碎片化。
这一背景之下，Gateway API 应运而生，并且在过去的一年里从 alpha 演进到了 beta 阶段。虽然目前 Gateway API 还未定稿，协议仍会发生变动，不建议用于生产，但 API 统一趋势已经不可阻挡，只是时间的问题。下图是 Gateway API 的一个用例场景，不同于 Ingress API，将集群运维和业务运维的职责进行了划分，这样业务开发人员不再需要关心网站证书等集群级的细节，只专注于业务本身的 DevOps，集群运维任务可以交给 SRE 人员进行统一处理。
![image.png](https://img.alicdn.com/imgextra/i3/O1CN01jDsDrv1zaqj82YkYP_!!6000000006731-2-tps-2735-1519.png)
Higress 目前采用 Ingress 注解的能力来实现能力扩展，并兼容了 Nginx Ingress 大部分常用注解，且具备平滑迁移到 Gateway API 的能力。
Higress 为传统微服务架构，提供了渐进式的方式，向基于 K8s 的云原生微服务架构演进：可以通过 Nacos 发现部署在 K8s 之外的服务，从而实现了网关后端微服务可以和 K8s 解耦，业务团队可以将微服务逐个迁移至 K8s，而不用担心网关层的流量影响。
从传统微服务网关迁移到 Higress，再渐进式完成整个微服务架构的云原生化，是一个明智的选择。
### 趋势二：合并安全&流量网关，向 DevSecOps 演进
Higress 提出了将安全、流量、微服务网关三合一的概念，首先来看一个典型的多层网关架构：
![](https://img.alicdn.com/imgextra/i2/O1CN0178hdNj25QDDnqmISC_!!6000000007520-2-tps-1318-198.png)
在这个架构中，用 WAF 网关实现安全能力，Ingress 网关实现集群入口网关能力（非 K8s 场景或会部署一层 Nginx），SCG（Spring Cloud Gateway） 实现微服务网关能力。这样的架构下，需要对每一层网关都进行容量评估，每一层网关都是潜在的瓶颈点，都可能需要进行扩容。这样造成的资源成本和运维人力成本都是巨大的。并且每多一层网关，就多一层可用性风险。一旦出现可用性问题，多层网关会导致问题定位复杂度显著上升，对应的平均故障恢复时间（MTTR）将大幅增加。
![](https://img.alicdn.com/imgextra/i1/O1CN01BnAVqH1SCE73I5l85_!!6000000002210-2-tps-1318-198.png)
采用三合一的架构中，可以显著降低成本，并提高系统整体可用性。同时这也符合 DevSecOps 的微服务演进趋势，微服务开发者可以更多地从业务接口视角关注安全性，而不是采用所有路由一刀切的 WAF 防护模式。
技术架构演进的背后是组织架构演进，这也是微服务 DevOps 一直在强调的，要围绕开发者为核心，从而提升微服务开发效率。向 DevSecOps 演进并没有捷径，依然需要开发角色和运维角色之间的双向奔赴，打破传统开发与运维之间的壁垒，形成从开发、部署、安全运营这样一个全功能化的敏捷团队。
通过 Higress 将网关合并作为向 DevSecOps 演进的抓手，是一个明智的选择。
## 参与 Higress 社区
Higress 开源贡献小组正在火热招募贡献者。如果您有时间，有热情，有意愿，欢迎联系社区加入开源贡献小组，一起共同完善 Higress，一起主导下一代云原生网关的设计和实现。
社区官网（点击“阅读原文”跳转）: [https://higress.io](https://higress.io)
社区开发者群：
![image.png](https://img.alicdn.com/imgextra/i1/O1CN01Zc7yGt1p0zYq3OCwj_!!6000000005299-2-tps-979-1280.png)
社区交流群：
![higress-comm.png](https://img.alicdn.com/imgextra/i2/O1CN01Ebh7P021yKGBaP35B_!!6000000007053-2-tps-720-405.png)
## 实战演示直播
1月12号（本周四）将在线直播 Higress 通过 Nacos 实现微服务网关能力的实战演示，可以扫描图中二维码，预约观看，将在直播开始前收到短信通知。
![image.png](https://img.alicdn.com/imgextra/i4/O1CN01fZzh1e1EQVqOnw415_!!6000000000346-2-tps-1500-2044.png)
