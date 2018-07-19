import { Link } from 'react-router-dom';
import React from 'react';

export default {
  'en-us': {
    barText: 'Community',
    events: {
      title: 'Events & News',
      list: [
        {
          img: '',
          title: 'Nacos',
          content: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many ',
          dateStr: 'March 06，2018',
          link: '/blog',
        },
        {
          img: '',
          title: 'Transpart & interface based RPC',
          content: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many ',
          dateStr: 'March 06，2018',
          link: '/blog',
        },
      ]
    },
    contacts: {
      title: 'Talk To Us',
      desc: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many',
      list: [
        {
          img: './img/weibo.png',
          imgHover: './img/weibo_hover.png',
          title: '@Nacos',
          link: '',
        },
        {
          img: './img/alibaba.png',
          imgHover: './img/alibaba_hover.png',
          title: '#alibaba/dubbo',
          link: '',
        },
        {
          img: './img/segmentfault.png',
          imgHover: './img/segmentfault_hover.png',
          title: 'Segment Fault',
          link: ''
        },
        {
          img: './img/mailinglist.png',
          imgHover: './img/mailinglist_hover.png',
          title: 'Mailing List',
          link: ''
        },
      ],
    },
    contributorGuide: {
      title: 'Contributor Guide',
      desc: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many',
      list: [
        {
          img: './img/mailinglist.png',
          title: 'Mailing List',
          content: <span>Be sure to follow our <Link to="">our community addition guidelines</Link></span>,
        },
        {
          img: './img/issue.png',
          title: 'Issue',
          content: 'gRPC has an active community of developers who are using, ',
        },
        {
          img: './img/documents.png',
          title: 'Documents',
          content: 'enhancing and building valuable integrations with other software projects.',
        },
        {
          img: './img/pullrequest.png',
          title: 'Pull Request',
          content: <span>Be sure to follow our <Link to="">our community addition guidelines</Link></span>,
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
              text: 'gRPC',
              link: '',
              bgColor: '#7A63FC',
            },
            {
              text: 'HTTP',
              link: '',
              bgColor: '#00D0D9',
            },
            {
              text: 'JsonRPC',
              link: '',
              bgColor: '#00D0D9',
            },
          ]
        },
        {
          title: 'Kubernetes and CNCF',
          content: <span>Nacos supports service discovery and dynamic configuration management required by Kubernetes and CNCF. Nacos can replace completely and seamlessly Kubernetes’ primary DNS-based Service Discovery solutions. Nacos is featured with providing more service governance, which includes management of service domain, service health and life cycle management, traffic management and intelligent routing strategy management and etc. Nacos also enhances the management of ConfigMap, including version configuration and gated launch and etc.</span>,
          tags: [
            {
              text: 'gRPC',
              link: '',
              bgColor: '#7A63FC',
            },
            {
              text: 'HTTP',
              link: '',
              bgColor: '#00D0D9',
            },
            {
              text: 'JsonRPC',
              link: '',
              bgColor: '#00D0D9',
            },
          ]
        },
        {
          title: 'Spring Cloud',
          content: <span>Nacos is fully compatible and seamlessly supports the relevant API and main related functions of Spring Cloud. You can use Nacos as a configuration service for Spring Cloud Config Server or a better alternative for product of service discovery such as Eureka/Consul/ZooKeeper and etc. Nacos brings many feature enhancements required by the production and micro-service governance in configuration management and service management.</span>,
          tags: [
            {
              text: 'gRPC',
              link: '',
              bgColor: '#7A63FC',
            },
            {
              text: 'HTTP',
              link: '',
              bgColor: '#00D0D9',
            },
            {
              text: 'JsonRPC',
              link: '',
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
          img: '',
          title: 'Transpart & interface based RPC',
          content: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many ',
          dateStr: 'March 06，2018',
          link: '/blog',
        },
        {
          img: '',
          title: 'Transpart & interface based RPC',
          content: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many ',
          dateStr: 'March 06，2018',
          link: '/blog',
        },
        {
          img: '',
          title: 'Transpart & interface based RPC',
          content: 'Apache Dubbo(incubating) is a high-performance,java based,open source RPC framework open-sourced by Alibaba.As in many ',
          dateStr: 'March 06，2018',
          link: '/blog',
        },
      ]
    },
      contacts: {
          title: '联系我们',
          desc: '有问题需要反馈？请通过一下方式联系我们。',
          list: [
              {
                  img: './img/mailinglist.png',
                  imgHover: './img/mailinglist_hover.png',
                  title: '邮件列表',
                  link: 'https://github.com/apache/incubator-dubbo/wiki/New-contributor-guide'
              },
              {
                  img: './img/alibaba.png',
                  imgHover: './img/alibaba_hover.png',
                  title: 'Gitter',
                  link: 'https://gitter.im/alibaba/nacos',
              },
              {
                  img: './img/segmentfault.png',
                  imgHover: './img/segmentfault_hover.png',
                  title: 'Segment Fault',
                  link: 'https://segmentfault.com/t/nacos'
              },
              {
                  img: './img/weibo.png',
                  imgHover: './img/twitter_hover.png',
                  title: '@Nacos',
                  link: 'https://twitter.com/ApacheDubbo',
              },
          ],
      },
      contributorGuide: {
          title: '贡献指南',
          desc: 'Dubbo社区欢迎任何形式的贡献。',
          list: [
              {
                  img: './img/mailinglist.png',
                  title: '邮件列表',
                  content: <span>加入 <a href="https://github.com/apache/incubator-dubbo/wiki/New-contributor-guide">邮件列表 </a>参与讨论。</span>,
              },
              {
                  img: './img/issue.png',
                  title: '报告缺陷',
                  content: <span>通过<a href="https://github.com/apache/incubator-dubbo/issues"> Github issues </a>报告缺陷。</span>,
              },
              {
                  img: './img/documents.png',
                  title: '文档',
                  content: <span>优化Dubbo <a href="http://dubbo.apache.org/#/docs/"> 文档</a>。</span>,
              },
              {
                  img: './img/pullrequest.png',
                  title: 'Pull Request',
                  content: <span>提交 <a href="https://github.com/apache/incubator-dubbo/pulls"> Pull requests </a>来修复问题。</span>,
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
              link: '',
              bgColor: '#7A63FC',
            },
            {
              text: 'Dubbo Mesh',
              link: '',
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
              link: '',
              bgColor: '#7A63FC',
            },
            {
              text: 'CNCF',
              link: '',
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
              link: '',
              bgColor: '#7A63FC',
            },
            {
              text: 'Microservice',
              link: '',
              bgColor: '#00D0D9',
            },
          ],
        },
      ],
    },
  },
};
