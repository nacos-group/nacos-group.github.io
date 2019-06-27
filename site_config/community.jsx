import React from 'react';

export default {
  'en-us': {
    barText: 'Community',
    events: {
      title: 'Events & News',
      list: [

          {
              img: 'https://07imgmini.eastday.com/mobile/20190125/20190125113742_a85399def3ae44c6f4669a4bb458f178_1.jpeg',
              title: 'Dubbo Nacos 发布 v0.8.0 PRE-GA版本，安全稳定上生产',
              content: '阿里巴巴微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos)于本周发布 v0.5.0 版本，该版本主要在 DNS-based Service Discovery，支持 TTL，支持 Java 11，优化Nacos产品用户体验，与Spring Cloud Gateway的集成等方面做了演进。',
              dateStr: 'Jan 20，2019',
              link: '/en-us/blog/nacos0.8.html',
          },
          {
              img: 'https://img.alicdn.com/tfs/TB1qqkLKxnaK1RjSZFBXXcW7VXa-1830-982.png',
              title: 'Nacos 0.9.0 发布，稳定的快速迭代',
              dateStr: 'Mar 7, 2019',
              content: 'Nacos一直秉承着稳定性和快速迭代，Nacos 0.9.0版本于上周正式发布release，功能围绕着，Nacos-Sync的稳定性、Server功能拆分部署、Nacos python语言体系的支持。',
              link: '/en-us/blog/nacos0.9.0.html',
          },
          {
              img: 'https://img.alicdn.com/tfs/TB1i4ugBjDpK1RjSZFrXXa78VXa-1522-584.png',
              title: '虎牙直播在微服务改造方面的实践和总结',
              content: '文章整理自虎牙基础保障部中间件团队负责人张波（社区ID：zhangjimmy）在Dubbo Meetup 广州站沙龙上的分享，介绍虎牙在DNS、服务注册、CMDB和服务配置中心等方面的实践。',
              dateStr: 'Feb 10，2019',
              link: '/en-us/blog/huya-practice.html',
          },
          // {
          //     img: 'https://cdn.nlark.com/lark/0/2018/png/11189/1544689744102-fd00fec6-ca80-4c0c-9b0d-538f17279963.png',
          //     title: 'Nacos 0.9.0 发布，稳定的快速迭代',
          //     dateStr: 'Mar 7, 2019',
          //     content: '本文介绍了阿里巴巴的微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos) v0.6 版本，该版本主要在支持了Dubbo生态和Docker部署。',
          //     link: '/en-us/blog/nacos0.6.html',
          // },
          // {
          //     img: 'https://cdn.nlark.com/lark/0/2018/png/11189/1540738282849-61e2022a-46a9-4d81-ae16-6d6f0515450b.png',
          //     title: 'Nacos 进入CNCF landscape',
          //     content: 'Nacos 被CNCF 纳入landscape大图.CNCF（Cloud Native Compute Foundation） 是 Linux 基金会旗下的一个组织，旨在推动以容器为中心的云原生系统。从 2016 年 11 月，CNCF 开始维护了一个 Cloud Native Landscape 的 repo。',
          //     dateStr: 'Oct 28，2018',
          //     link: '/en-us/blog/cncf.html',
          // },
      ]
    },
    contacts: {
      title: 'Talk To Us',
      desc: 'Nacos is an easy-to-use dynamic service discovery, configuration and service management platform for building cloud native application.',
      list: [
          {
              img: '/img/mailinglist.png',
              imgHover: '/img/mailinglist_hover.png',
              title: 'Mailing List',
              link: 'mailto:nacos_dev@linux.alibaba.com',
          },
          {
              img: '/img/alibaba.png',
              imgHover: '/img/alibaba_hover.png',
              title: '#alibaba/Nacos',
              link: 'https://gitter.im/alibaba/nacos',
          },
          {
              img: '/img/segmentfault.png',
              imgHover: '/img/segmentfault_hover.png',
              title: 'Segment Fault',
              link: 'https://segmentfault.com/t/nacos',
          },
          {
              img: '/img/weibo.png',
              imgHover: '/img/weibo_hover.png',
              title: '@Nacos',
              link: 'https://weibo.com/u/6574374908',
          },
      ],
    },
    contributorGuide: {
      title: 'Contributor Guide',
      desc: 'Want to contribute to Nacos?',
      list: [
        {
          img: '/img/mailinglist.png',
          title: 'Mailing List',
          content: <span>Be sure to follow our <a href="mailto:nacos_dev@linux.alibaba.com">our community addition guidelines</a></span>,
        },
        {
          img: '/img/issue.png',
          title: 'Issue',
          content: <span>Reporting issues via <a href="https://github.com/alibaba/nacos/issues">Github issues.</a></span>,
        },
        {
          img: '/img/documents.png',
          title: 'Documents',
          content: <span>Improve the <a href="https://github.com/xuechaos/nacos.io/tree/master/docs">documentation.</a></span>,
        },
        {
          img: '/img/pullrequest.png',
          title: 'Pull Request',
          content: <span>Send your awesome enhancement via <a href="https://github.com/alibaba/nacos/pulls">Pull requests.</a></span>,
        },
      ],
    },
    ecos: {
      title: 'Open Source Ecology Corelated',
      list: [
        {
          title: 'Dubbo and Dubbo Mesh',
          content: <span>Dubbo and Nacos are the classic combination from production practice of Aibaba's large-scale micro-service. Compared to traditional registry centers such as ZooKeeper and configuration center solutions, when building a microservice application platform by using cloud native and Service Mesh paradigm, with the use of Nacos in Dubbo, all the power of Dubbo in the large-scale microservice management, traffic management, service integration and sharing can be fully released.</span>,
          tags: [
              {
                  text: 'Dubbo',
                  link: 'http://dubbo.io/',
                  bgColor: '#7A63FC',
              },
              {
                  text: 'Dubbo Mesh',
                  link: 'http://dubbo.io/',
                  bgColor: '#00D0D9',
              },
          ]
        },
        {
          title: 'Kubernetes and CNCF',
          content: <span>Nacos supports service discovery and dynamic configuration management required by Kubernetes and CNCF. Nacos can replace completely and seamlessly Kubernetes’ primary DNS-based Service Discovery solutions. Nacos is featured with providing more service governance, which includes management of service domain, service health and life cycle management, traffic management and intelligent routing strategy management and etc. Nacos also enhances the management of ConfigMap, including version configuration and gated launch and etc.</span>,
          tags: [
              {
                  text: 'Kubernetes',
                  link: 'https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/',
                  bgColor: '#7A63FC',
              },
              {
                  text: 'CNCF',
                  link: 'https://www.cncf.io/',
                  bgColor: '#00D0D9',
              },
          ]
        },
        {
          title: 'Spring Cloud',
          content: <span>Nacos is fully compatible and seamlessly supports the relevant API and main related functions of Spring Cloud. You can use Nacos as a configuration service for Spring Cloud Config Server or a better alternative for product of service discovery such as Eureka/Consul/ZooKeeper and etc. Nacos brings many feature enhancements required by the production and micro-service governance in configuration management and service management.</span>,
          tags: [
              {
                  text: 'Spring Cloud',
                  link: 'http://projects.spring.io/spring-cloud/',
                  bgColor: '#7A63FC',
              },
              {
                  text: 'Microservice',
                  link: 'http://microservices.io/',
                  bgColor: '#00D0D9',
              },
          ],
        },
      ],
    },
  },
  'zh-cn': {
    barText: '社区',
    events: {
      title: '事件 & 新闻',
      list: [

          {
              img: 'https://07imgmini.eastday.com/mobile/20190125/20190125113742_a85399def3ae44c6f4669a4bb458f178_1.jpeg',
              title: 'Dubbo Nacos 发布 v0.8.0 PRE-GA版本，安全稳定上生产',
              content: '阿里巴巴微服务开源项目[Dubbo Nacos](https://github.com/alibaba/nacos)于本周发布 v0.5.0 版本，该版本主要在 DNS-based Service Discovery，支持 TTL，支持 Java 11，优化Nacos产品用户体验，与Spring Cloud Gateway的集成等方面做了演进。',
              dateStr: 'Jan 20，2019',
              link: '/en-us/blog/nacos0.8.html',
          },
          {
              img: 'https://img.alicdn.com/tfs/TB1qqkLKxnaK1RjSZFBXXcW7VXa-1830-982.png',
              title: 'Nacos 0.9.0 发布，稳定的快速迭代',
              dateStr: 'Mar 7, 2019',
              content: 'Nacos一直秉承着稳定性和快速迭代，Nacos 0.9.0版本于上周正式发布release，功能围绕着，Nacos-Sync的稳定性、Server功能拆分部署、Nacos python语言体系的支持。',
              link: '/en-us/blog/nacos0.9.0.html',
          },
          {
              img: 'https://img.alicdn.com/tfs/TB1i4ugBjDpK1RjSZFrXXa78VXa-1522-584.png',
              title: '虎牙直播在微服务改造方面的实践和总结',
              content: '文章整理自虎牙基础保障部中间件团队负责人张波（社区ID：zhangjimmy）在Dubbo Meetup 广州站沙龙上的分享，介绍虎牙在DNS、服务注册、CMDB和服务配置中心等方面的实践。',
              dateStr: 'Feb 10，2019',
              link: '/en-us/blog/huya-practice.html',
          },
          // {
          //     img: 'https://cdn.nlark.com/lark/0/2018/png/11189/1540738282849-61e2022a-46a9-4d81-ae16-6d6f0515450b.png',
          //     title: 'Nacos 进入CNCF landscape',
          //     content: 'Nacos 被CNCF 纳入landscape大图.CNCF（Cloud Native Compute Foundation） 是 Linux 基金会旗下的一个组织，旨在推动以容器为中心的云原生系统。从 2016 年 11 月，CNCF 开始维护了一个 Cloud Native Landscape 的 repo。',
          //     dateStr: 'Oct 28，2018',
          //     link: '/en-us/blog/cncf.html',
          // },
      ]
    },
      contacts: {
          title: '联系我们',
          desc: '有问题需要反馈？请通过一下方式联系我们。',
          list: [
              {
                  img: '/img/mailinglist.png',
                  imgHover: '/img/mailinglist_hover.png',
                  title: '邮件列表',
                  link: 'mailto:nacos_dev@linux.alibaba.com'
              },
              {
                  img: '/img/alibaba.png',
                  imgHover: '/img/alibaba_hover.png',
                  title: 'Gitter',
                  link: 'https://gitter.im/alibaba/nacos',
              },
              {
                  img: '/img/segmentfault.png',
                  imgHover: '/img/segmentfault_hover.png',
                  title: 'Segment Fault',
                  link: 'https://segmentfault.com/t/nacos'
              },
              {
                  img: '/img/weibo.png',
                  imgHover: '/img/weibo_hover.png',
                  title: '@Nacos',
                  link: 'https://weibo.com/u/6574374908',
              },
          ],
      },
      contributorGuide: {
          title: '贡献指南',
          desc: 'Nacos社区欢迎任何形式的贡献。',
          list: [
              {
                  img: '/img/mailinglist.png',
                  title: '邮件列表',
                  content: <span>发送 <a href="mailto:nacos_dev@linux.alibaba.com">邮件列表 </a>参与讨论。</span>,
              },
              {
                  img: '/img/issue.png',
                  title: '报告缺陷',
                  content: <span>通过<a href="https://github.com/alibaba/nacos/issues"> Github issues </a>报告缺陷。</span>,
              },
              {
                  img: '/img/documents.png',
                  title: '文档',
                  content: <span>优化Nacos <a href="http://nacos.io/zh-cn/docs/what-is-nacos.html"> 文档</a>。</span>,
              },
              {
                  img: '/img/pullrequest.png',
                  title: 'Pull Request',
                  content: <span>提交 <a href="https://github.com/alibaba/nacos/pulls"> Pull requests </a>来修复问题。</span>,
              },
          ],
      },
    ecos: {
      title: '开源生态相关',
      list: [
        {
          title: 'Dubbo and Dubbo Mesh',
          content: <span>Dubbo 及 Nacos是阿里巴巴大规模微服务生产实践中的经典组合，对比传统的如ZooKeeper等注册中心与配置中心解决方案，在使用云原生及Service Mesh范式构建微服务应用平台时，通过在Dubbo中使用Nacos，可以完全释放Dubbo在大规模微服务治理、流量管理、服务集成及共享上的所有威力。</span>,
          tags: [
            {
              text: 'Dubbo',
              link: 'http://dubbo.io/',
              bgColor: '#7A63FC',
            },
            {
              text: 'Dubbo Mesh',
              link: 'http://dubbo.io/',
              bgColor: '#00D0D9',
            },
          ]
        },
        {
          title: 'Kubernetes and CNCF',
          content: <span>Nacos 支持Kubernetes 以及 CNCF所需要的服务发现及动态配置管理的需求，Nacos可以完全无缝的替代Kubernetes的原生的DNS-based Service Discovery 解决方案，Nacos 提供了更多的服务治理侧的特性，这包括服务的域名管理，服务健康及生命周期管理，流量管理及智能路由策略管理等，Nacos也增强了对ConfigMap的管理，这包括版本配置、灰度发布等。</span>,
          tags: [
            {
              text: 'Kubernetes',
              link: 'https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/',
              bgColor: '#7A63FC',
            },
            {
              text: 'CNCF',
              link: 'https://www.cncf.io/',
              bgColor: '#00D0D9',
            },
          ]
        },
        {
          title: 'Spring Cloud',
          content: <span>Nacos 完全兼容和无缝支持 Spring Cloud的相关API及主要相关功能，你可以将Nacos作为SpringCloud Config Server的配置服务或者Eureka/Consul/ZooKeeper等的服务发现产品的更好替代者，Nacos 在配置管理和服务管理上带来了很多面向生产及微服务治理所需要的特性增强。</span>,
          tags: [
            {
              text: 'Spring Cloud',
              link: 'http://projects.spring.io/spring-cloud/',
              bgColor: '#7A63FC',
            },
            {
              text: 'Microservice',
              link: 'http://microservices.io/',
              bgColor: '#00D0D9',
            },
          ],
        },
      ],
    },
  },
};
