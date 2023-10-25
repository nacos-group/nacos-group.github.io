export default {
  'en-us': {
    sidemenu: [
      {
        title: 'Nacos ',
        children: [
          {
            title: 'What is Nacos',
            opened: true,
            children: [
              {
                title: 'What is Nacos',
                link: '/en-us/docs/v2/what-is-nacos.html',
              },
              {
                title: 'Concepts',
                link: '/en-us/docs/v2/concepts.html',
              },
              {
                title: 'Architecure',
                link: '/en-us/docs/v2/architecture.html',
              },
            ],
          },
          {
            title: 'Quick Start',
            opened: true,
            children: [
              {
                title: 'Nacos',
                link: '/en-us/docs/v2/quickstart/quick-start.html',
              },
              {
                title: 'Nacos Docker',
                link: '/en-us/docs/v2/quickstart/quick-start-docker.html',
              },
              {
                title: 'Nacos kubernetes',
                link: '/en-us/docs/v2/quickstart/quick-start-kubernetes.html',
              },
            ]
          },
          {
            title: 'Upgrading',
            children: [
              {
                title: 'Compatibility&Usage',
                link: '/en-us/docs/v2/upgrading/2.0.0-compatibility.html',
              },
              {
                title: 'Upgrading',
                link: '/en-us/docs/v2/upgrading/2.0.0-upgrading.html',
              },
            ],
          },
          {
            title: 'Plugin',
            children: [
              {
                title: 'Authentication',
                link: '/en-us/docs/v2/plugin/auth-plugin.html',
              },
              {
                title: 'Configuration Encryption',
                link: '/en-us/docs/v2/plugin/config-encryption-plugin.html',
              },
              {
                title: 'Datasource',
                link: '/en-us/docs/v2/plugin/datasource-plugin.html',
              },
              {
                title: 'Track Tracing',
                link: '/en-us/docs/v2/plugin/trace-plugin.html',
              },
              {
                title: 'Custom Environment',
                link: '/en-us/docs/v2/plugin/custom-environment-plugin.html',
              },
              {
                title: 'Control',
                link: '/en-us/docs/v2/plugin/control-plugin.html',
              },
              {
                title: 'Configuration Change',
                link: '/en-us/docs/v2/plugin/config-change-plugin.html',
              },
            ]
          },
          {
            title: 'User Guide',
            children: [
              {
                title: 'Java SDK',
                link: '/en-us/docs/v2/guide/user/sdk.html',
              },
              {
                title: 'Other Language',
                link: '/en-us/docs/v2/guide/user/other-language.html',
              },
              {
                title: 'Open-API',
                link: '/en-us/docs/v2/guide/user/open-api.html',
              },
              {
                title: 'Parameter Check',
                link: '/zh-cn/docs/v2/guide/user/parameters-check.html',
              },
              {
                title: 'Authentication',
                link: '/en-us/docs/v2/guide/user/auth.html',
              },
              {
                title: 'FAQ',
                link: '/en-us/docs/v2/guide/user/faq.html',
              },
            ],
          },
          {
            title: 'Admin Guide',
            children: [
              {
                title: 'Deployment Guide',
                link: '/en-us/docs/v2/guide/admin/deployment.html',
              },
              {
                title: 'Cluster Mode Deployment',
                link: '/en-us/docs/v2/guide/admin/cluster-mode-quick-start.html',
              },
              {
                title: 'System Configurations',
                link: '/en-us/docs/v2/guide/admin/system-configurations.html',
              },
              {
                title: 'Management OpenAPI',
                link: '/en-us/docs/v2/guide/admin/management-api.html',
              },
              {
                title: 'Console Guide',
                link: '/en-us/docs/v2/guide/admin/console-guide.html',
              },
              {
                title: 'Monitor Guide',
                link: '/en-us/docs/v2/guide/admin/monitor-guide.html',
              },
              {
                title: 'Config Benchmark',
                link: '/en-us/docs/v2/guide/admin/nacos2-config-benchmark.html',
              },
              {
                title: 'Naming Benchmark',
                link: '/en-us/docs/v2/guide/admin/nacos2-naming-benchmark.html',
              },
              {
                title: 'Data Migration to Nacos',
                link: '/en-us/docs/v2/ecology/use-nacos-sync.html',
              },
            ],
          },
          {
            title: 'Ecology',
            children: [
              {
                title: 'Dubbo',
                link: '/en-us/docs/v2/ecology/use-nacos-with-dubbo.html',
              },
              {
                title: 'Spring',
                link: '/en-us/docs/v2/ecology/use-nacos-with-spring.html',
              },
              {
                title: 'Spring Boot',
                link: '/en-us/docs/v2/ecology/use-nacos-with-spring-boot.html',
              },
              {
                title: 'Spring Cloud',
                link: '/en-us/docs/v2/ecology/use-nacos-with-spring-cloud.html',
              },
              {
                title: 'Nacos Sync',
                link: '/en-us/docs/v2/ecology/use-nacos-sync.html',
              },
              {
                title: 'CoreDNS',
                link: '/en-us/docs/v2/ecology/use-nacos-with-coredns.html',
              },
            ]
          },
          {
            title: 'Contributor Guide',
            children: [
              {
                title: 'Contribute to Nacos',
                link: '/en-us/docs/v2/contribution/contributing.html',
              },
              {
                title: 'Contributing Flow',
                link: '/en-us/docs/v2/contribution/contributing-flow.html',
              },
              {
                title: 'Pull Request Template',
                link: '/en-us/docs/v2/contribution/pull-request.html',
              },
              {
                title: 'How to report bugs',
                link: '/en-us/docs/v2/contribution/how-to-reporting-bugs.html',
              },
            ],
          },
          {
            title: 'Community',
            children: [
              {
                title: 'Community',
                link: '/en-us/docs/v2/community/community.html',
              },
              {
                title: 'Develop Team',
                link: '/en-us/docs/v2/community/nacos-dev.html',
              },
            ],
          },
        ],
      },
    ],
    barText: 'Documentation',
  },
  'zh-cn': {
    sidemenu: [
      {
        title: 'Nacos ',
        children: [
          {
            title: 'Nacos是什么?',
            opened: true,
            children: [
              {
                title: 'Nacos简介',
                link: '/zh-cn/docs/v2/what-is-nacos.html',
              },
              {
                title: '概念',
                link: '/zh-cn/docs/v2/concepts.html',
              },
              {
                title: '架构',
                link: '/zh-cn/docs/v2/architecture.html',
              },
            ],
          },
          {
            title: '快速开始',
            opened: true,
            children: [
              {
                title: 'Nacos',
                link: '/zh-cn/docs/v2/quickstart/quick-start.html',
              },
              {
                title: 'Nacos Docker',
                link: '/zh-cn/docs/v2/quickstart/quick-start-docker.html',
              },
              {
                title: 'Nacos kubernetes',
                link: '/zh-cn/docs/v2/quickstart/quick-start-kubernetes.html',
              },
            ]
          },
          {
            title: '升级',
            children: [
              {
                title: '兼容性及使用',
                link: '/zh-cn/docs/v2/upgrading/2.0.0-compatibility.html',
              },
              {
                title: '升级文档',
                link: '/zh-cn/docs/v2/upgrading/2.0.0-upgrading.html',
              },
            ],
          },
          {
            title: '插件',
            children: [
              {
                title: '鉴权',
                link: '/zh-cn/docs/v2/plugin/auth-plugin.html',
              },
              {
                title: '配置加密',
                link: '/zh-cn/docs/v2/plugin/config-encryption-plugin.html',
              },
              {
                title: '数据源',
                link: '/zh-cn/docs/v2/plugin/datasource-plugin.html',
              },
              {
                title: '轨迹追踪',
                link: '/zh-cn/docs/v2/plugin/trace-plugin.html',
              },
              {
                title: '环境变量',
                link: '/zh-cn/docs/v2/plugin/custom-environment-plugin.html',
              },
              {
                title: '反脆弱',
                link: '/zh-cn/docs/v2/plugin/control-plugin.html',
              },
              {
                title: '配置变更',
                link: '/zh-cn/docs/v2/plugin/config-change-plugin.html',
              },
            ]
          },
          {
            title: '用户指南',
            children: [
              {
                title: 'Java的SDK',
                link: '/zh-cn/docs/v2/guide/user/sdk.html',
              },
              {
                title: '其他语言的SDK',
                link: '/zh-cn/docs/v2/guide/user/other-language.html',
              },
              {
                title: 'Open-API指南',
                link: '/zh-cn/docs/v2/guide/user/open-api.html',
              },
              {
                title: '参数校验',
                link: '/zh-cn/docs/v2/guide/user/parameters-check.html',
              },
              {
                title: '权限认证',
                link: '/zh-cn/docs/v2/guide/user/auth.html',
              },
              {
                title: 'FAQ',
                link: '/zh-cn/docs/v2/guide/user/faq.html',
              },
            ],
          },
          {
            title: '运维指南',
            children: [
              {
                title: '部署手册',
                link: '/zh-cn/docs/v2/guide/admin/deployment.html',
              },
              {
                title: '集群部署说明',
                link: '/zh-cn/docs/v2/guide/admin/cluster-mode-quick-start.html',
              },
              {
                title: '系统参数说明',
                link: '/zh-cn/docs/v2/guide/admin/system-configurations.html',
              },
              {
                title: '运维API',
                link: '/zh-cn/docs/v2/guide/admin/management-api.html',
              },
              {
                title: '控制台手册',
                link: '/zh-cn/docs/v2/guide/admin/console-guide.html',
              },
              {
                title: '监控手册',
                link: '/zh-cn/docs/v2/guide/admin/monitor-guide.html',
              },
              {
                title: 'Nacos2.0配置模块压测报告',
                link: '/zh-cn/docs/v2/guide/admin/nacos2-config-benchmark.html',
              },
              {
                title: 'Nacos2.0服务发现模块压测报告',
                link: '/zh-cn/docs/v2/guide/admin/nacos2-naming-benchmark.html',
              },
              {
                title: '其他环境迁移到Nacos',
                link: '/zh-cn/docs/v2/ecology/use-nacos-sync.html',
              },
            ],
          },
          {
            title: '生态融合',
            children: [
              {
                title: 'Dubbo',
                link: '/zh-cn/docs/v2/ecology/use-nacos-with-dubbo.html',
              },
              {
                title: 'Spring',
                link: '/zh-cn/docs/v2/ecology/use-nacos-with-spring.html',
              },
              {
                title: 'Spring Boot',
                link: '/zh-cn/docs/v2/ecology/use-nacos-with-spring-boot.html',
              },
              {
                title: 'Spring Cloud',
                link: '/zh-cn/docs/v2/ecology/use-nacos-with-spring-cloud.html',
              },
              {
                title: 'Nacos Sync',
                link: '/zh-cn/docs/v2/ecology/use-nacos-sync.html',
              },
              {
                title: 'CoreDNS',
                link: '/zh-cn/docs/v2/ecology/use-nacos-with-coredns.html',
              },
            ]
          },
          {
            title: '开源共建',
            children: [
              {
                title: '贡献源码',
                link: '/zh-cn/docs/v2/contribution/contributing.html',
              },
              {
                title: '贡献流程',
                link: '/zh-cn/docs/v2/contribution/contributing-flow.html',
              },
              {
                title: 'pull request模板',
                link: '/zh-cn/docs/v2/contribution/pull-request.html',
              },
              {
                title: '如何提交问题报告',
                link: '/zh-cn/docs/v2/contribution/how-to-reporting-bugs.html',
              },
            ],
          },
          {
            title: '社区',
            children: [
              {
                title: '社区',
                link: '/zh-cn/docs/v2/community/community.html',
              },
              {
                title: '开发团队',
                link: '/zh-cn/docs/v2/community/nacos-dev.html',
              },
            ],
          },
        ],
      },
    ],
    barText: 'Nacos 文档',
  },
};
