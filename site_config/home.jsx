import React from 'react';

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
                    link: '/en-us/docs/what-is-nacos.html',
                    type: 'normal',
                },
            ],
            version: {
                text: 'V1.0.0',
                link: 'https://github.com/alibaba/nacos/releases',
            },
            note: {
                text: 'Release Note',
                link: 'https://github.com/alibaba/nacos/releases',
            },
            releaseDate: 'Released on Apr 10, 2019',
        },
        functions: {
            title: 'Features',
            list: [
                {
                    img: '/img/dynamic_configuration.png',
                    title: 'Dynamic Configuration Service',
                    content: 'Dynamic Configuration Service allows you to manage configurations in all environments in a centralized, externalized, and dynamic approach. Dynamic configuration saves you from redeploying your applications and services when configuration is updated. You can implement stateless services and achieve on-demand scaling effortlessly.',
                },
                {
                    img: '/img/service_discovery.png',
                    title: 'Service Discovery and Management',
                    content: 'Dynamic Service Discovery is key to service-centric (for example microservice or cloud-native) architectures. Nacos supports both DNS-based and RPC-based (Dubbo, gRPC) service discovery, and provides real-time service health checks to prevent routing requests from being sent to unhealthy hosts or service instances. With Nacos, you can also implement circuit breakers for your services with ease.',
                },
                {
                    img: '/img/dynamic_DNS.png',
                    title: 'Dynamic DNS Service',
                    content: 'By supporting weighted routing, Dynamic DNS Service helps you implement mid-tier load balancing, more flexible routing, traffic control and DNS resolution services in the production environment within your data center. Dynamic DNS Service also makes it easier for you to implement DNS-based service discovery, which minimizes the risk of coupling to vendor-specific service discovery APIs.',
                },
            ],
        },
        features: {
            title: 'Why Nacos',
            list: [
                {
                    img: '/img/feature_easy_to_use.png',
                    title: 'Easy to use',
                    content: [
                        'One-stop solution for dynamic service discovery, configuration management and dynamic DNS service',
                        '20+ out-of-the-box features for service-centric architectures',
                        'Light-weight production-ready console',
                    ],
                },
                {
                    img: '/img/feature_adaptable.png',
                    title: 'More adaptive to cloud architectures',
                    content: [
                        'Seamlessly support kubernetes and spring cloud',
                        'Easier to deploy and run on popular public cloud (for example AliCloud and AWS)',
                        'Support multi-tenants and multi-environments',
                    ],
                },
                {
                    img: '/img/feature_production_grade.png',
                    title: 'Production grade',
                    content: [
                        'Originated from time-tested internal products from Alibaba Group',
                        'Supports large-scale scenarios with millions of services',
                        'Open-source product with enterprise-level SLA',
                    ],
                },
                {
                    img: '/img/feature_rich.png',
                    title: 'Rich internet application scenarios affinity',
                    content: [
                        'Supports rate throttling, big promotion plans, and multi-region active-active architectures',
                        'Supports a variety of relevant internet-based use cases directly or with slight extension',
                        'Traffic scheduling & service governance',
                    ],
                },
            ],
        },
        users: {
            title: '谁在使用Nacos',
            desc: <span>请在 <a rel="noopener noreferrer" target="_blank" href="https://github.com/alibaba/nacos/issues/273">Wanted: who&#39;s using nacos</a> 上提供信息来帮助Nacos做的更好。</span>,
            list: [
                '/img/users_alibaba.png',
                '/img/users_aiqiyi.png',
                '/img/users_baishi.png',
                '/img/users_beike.png',
                '/img/users_fengchao.png',
                '/img/users_fenghuangwang.png',
                '/img/users_haojing.png',
                '/img/users_huya.png',
                '/img/users_icbc.png',
                '/img/users_meicai.png',
                '/img/users_pingan.png',
                '/img/users_qichezhijia.png',
                '/img/users_sany.png',
                '/img/users_sifa.png',
                '/img/users_youke.png',
                '/img/users_zhishi.png',
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
                    link: '/zh-cn/docs/what-is-nacos.html',
                    type: 'normal',
                },
            ],
            version: {
                text: 'V1.0.0',
                link: 'https://github.com/alibaba/nacos/releases',
            },
            note: {
                text: '版本说明',
                link: 'https://github.com/alibaba/nacos/releases',
            },
            releaseDate: '2019年04月10日发布',
        },
        functions: {
            title: '功能',
            list: [
                {
                    img: '/img/dynamic_configuration.png',
                    title: '动态配置服务',
                    content: '动态配置服务让您能够以中心化、外部化和动态化的方式管理所有环境的配置。动态配置消除了配置变更时重新部署应用和服务的需要。配置中心化管理让实现无状态服务更简单，也让按需弹性扩展服务更容易。',
                },
                {
                    img: '/img/service_discovery.png',
                    title: '服务发现及管理',
                    content: '动态服务发现对以服务为中心的（例如微服务和云原生）应用架构方式非常关键。Nacos支持DNS-Based和RPC-Based（Dubbo、gRPC）模式的服务发现。Nacos也提供实时健康检查，以防止将请求发往不健康的主机或服务实例。借助Nacos，您可以更容易地为您的服务实现断路器。',
                },
                {
                    img: '/img/dynamic_DNS.png',
                    title: '动态DNS服务',
                    content: '通过支持权重路由，动态DNS服务能让您轻松实现中间层负载均衡、更灵活的路由策略、流量控制以及简单数据中心内网的简单DNS解析服务。动态DNS服务还能让您更容易地实现以DNS协议为基础的服务发现，以消除耦合到厂商私有服务发现API上的风险。',
                },
            ],
        },
        features: {
            title: '特性一览',
            list: [
                {
                    img: '/img/feature_easy_to_use.png',
                    title: '易于使用',
                    content: [
                        '动态配置管理、服务发现和动态的一站式解决方案',
                        '20多种开箱即用的以服务为中心的架构特性',
                        '基本符合生产要求的轻量级易用控制台',
                    ],
                },
                {
                    img: '/img/feature_adaptable.png',
                    title: '更适应云架构',
                    content: [
                        '无缝支持Kubernetes和Spring Cloud',
                        '在主流公共云上更容易部署和运行（例如阿里云和AWS）',
                        '多租户和多环境支持',
                    ],
                },
                {
                    img: '/img/feature_production_grade.png',
                    title: '生产等级',
                    content: [
                        '脱胎于历经阿里巴巴10年生产验证的内部产品',
                        '支持具有数百万服务的大规模场景',
                        '具备企业级SLA的开源产品',
                    ],
                },
                {
                    img: '/img/feature_rich.png',
                    title: '丰富的应用场景',
                    content: [
                        '支持限流、大促销预案和异地多活',
                        '直接支持或稍作扩展即可支持大量有用的互联网应用场景',
                        '流量调度和服务治理',
                    ],
                },
            ],
        },
        users: {
            title: '谁在使用Nacos',
            desc: <span>请在 <a rel="noopener noreferrer" target="_blank" href="https://github.com/alibaba/nacos/issues/273">Wanted: who&#39;s using nacos</a> 上提供信息来帮助Nacos做的更好。</span>,
            list: [
                '/img/users_alibaba.png',
                '/img/users_aiqiyi.png',
                '/img/users_baishi.png',
                '/img/users_beike.png',
                '/img/users_fengchao.png',
                '/img/users_fenghuangwang.png',
                '/img/users_haojing.png',
                '/img/users_huya.png',
                '/img/users_icbc.png',
                '/img/users_meicai.png',
                '/img/users_pingan.png',
                '/img/users_qichezhijia.png',
                '/img/users_sany.png',
                '/img/users_sifa.png',
                '/img/users_youke.png',
                '/img/users_zhishi.png',
            ],
        },
    },
};
