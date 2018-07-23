export default {
  'en-us': {
    brand: {
      briefIntroduction: 'an easy-to-use dynamic service discovery, configuration and service management platform for building cloud native applications',
      buttons: [
        {
          text: 'View on Github',
          link: 'https://github.com/alibaba/nacos',
          type: 'primary',
        },
        {
          text: 'Manual',
          link: 'http://nacos.io/#/docs/what-is-nacos.md',
          type: 'normal',
        },
      ],
      version: {
        text: 'V0.1.0',
        link: '',
      },
      note: {
        text: 'Release Note',
        link: '',
      },
      releaseDate: 'released July 20, 2018',
    },
    functions: {
      title: 'Function',
      list: [
        {
          img: './img/dynamic_configuration.png',
          title: 'Dynamic Configuration Service',
          content: 'Dynamic Configuration Service allows you to manage application or service configuration in a centralized and dynamic style across all environments. Dynamic configuration eliminates the need to redeploy applications when configuration is updated. You can implement stateless services and achieve on-demand scaling more easily.',
        },
        {
          img: './img/service_discovery.png',
          title: 'Service Discovery and Management',
          content: 'Dynamic Service Discovery is essential to service-centric (i.e. microservice or cloud-native) architectures. Nacos supports both DNS-based and RPC-based (Dubbo, gRPC) service discovery, and provides service health checks for you to prevent routing requests from unhealthy hosts. You can also implement circuit breakers for your services more easier.',
        },
        {
          img: './img/dynamic_DNS.png',
          title: 'Dynamic DNS Service',
          content: 'Dynamic DNS Service which supports weighted routing makes it easier for you to implement mid-tier load balancing, `more flexible intelligent routing`, flow control and DNS resolution services in the production environment within your data center.Dynamic DNS Service also help you to implement DNS-based service discovery more easilier and prevent applications from coupling to vendor-specific service discovery APIs.',
        },
      ],
    },
    features: {
      title: 'Feature List',
      list: [
        {
          img: './img/feature_easy_to_use.png',
          title: 'Easy to use',
          content: [
            'One-stop solution for dynamic service discovery, configuration management and dynamic DNS service',
            'More than 20+ out-of-the-box features for service-centric architecture',
            'Light-weighted but production-ready console',
          ],
        },
        {
          img: './img/feature_adaptable.png',
          title: 'More adaptable to cloud architecture',
          content: [
            'Seamlessly support kubernetes and spring cloud',
            'Easy to deploy and run on mainstream public cloud (i.e AliCloud、AWS）',
            'Support multi-tenants and multi-environments',
          ],
        },
        {
          img: './img/feature_production_grade.png',
          title: 'Production grade',
          content: [
            'Born out of 10 years\' production verification within Alibaba Group',
            'Supports large-scale scenarios with millions of services',
            'Provides enterprise-level SLA',
          ],
        },
        {
          img: './img/feature_rich.png',
          title: 'Rich internet application scenarios affinity',
          content: [
            'Rate limiting and throttling, big promotion plan, multi-region active-active architecture',
            'Easy to expand and support common internet application scenarios as follows',
            'Traffic scheduling & service governance',
          ],
        },
      ],
    },
  },
  'zh-cn': {
    brand: {
      briefIntroduction: '一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。',
      buttons: [
        {
          text: '前往 Github',
          link: 'https://github.com/alibaba/nacos',
          type: 'primary',
        },
        {
          text: '手册',
          link: 'http://nacos.io/#/docs/what-is-nacos.md',
          type: 'normal',
        },
      ],
      version: {
        text: 'V0.1.0',
        link: '',
      },
      note: {
        text: 'Release notes.',
        link: '',
      },
      releaseDate: 'released July 20, 2018',
    },
    functions: {
      title: '功能',
      list: [
        {
          img: './img/dynamic_configuration.png',
          title: '动态配置服务',
          content: '动态配置服务让用户可以以中心化、外部化和动态化的方式管理所有环境的配置。动态配置消除了配置变更时重新部署应用和服务的需要。通过配置中心化管理，让实现无状态服务更简单，也让服务的按需弹性扩展变的更容易。',
        },
        {
          img: './img/service_discovery.png',
          title: '服务发现及管理',
          content: '动态服务发现对以服务为中心（如微服务及云原生）的应用架构方式非常关键。Nacos支持DNS-based 和 RPC-based(Dubbo, gRPC) 模式的服务发现。Nacos也提供实时的健康检查以便组织将请求发向不健康的主机或服务实例。基于Nacos你可以更容易的为你的服务实现断路器。',
        },
        {
          img: './img/dynamic_DNS.png',
          title: '动态DNS服务',
          content: '动态DNS服务通过支持权重路由让你更容易实现中间层负载均衡、更灵活的路由策略、流量控制以及简单的数据中心内网的简单DNS解析服务。动态DNS服务也帮你更容易的实现以DNS协议为基础的服务发现，以消除耦合到厂商私有服务发现API上的风险。',
        },
      ],
    },
    features: {
      title: '特性一览',
      list: [
        {
          img: './img/feature_easy_to_use.png',
          title: '易于使用',
          content: [
            '动态配置管理，服务发现和动态DNS服务的一站式解决方案',
            '超过20多种开箱即用的服务架构特性',
            '轻量级但基本符合生产要求的易用的控制台',
          ],
        },
        {
          img: './img/feature_adaptable.png',
          title: '更适应云架构',
          content: [
            '无缝支持kubernetes和spring cloud',
            '在主流公共云上更容易部署和运行（如AliCloud，AWS）',
            '多租户和多环境支持',
          ],
        },
        {
          img: './img/feature_production_grade.png',
          title: '生产等级',
          content: [
            '脱胎于阿里10年生产验证的内部产品',
            '支持具有数百万服务的大规模场景',
            '虽然是开源产品，但能做到企业级的 SLA 保障/水准',
          ],
        },
        {
          img: './img/feature_rich.png',
          title: '丰富的应用场景',
          content: [
            '支持限流，大促销预案，异地多活',
            '很容易支持或者稍作扩展就能支持大量的有用的互联网应用场景',
            '流量调度和服务治理',
          ],
        },
      ],
    },
  },
};
