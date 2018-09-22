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
                link: '/en-us/docs/what-is-nacos.html',
              },
              {
                title: 'Concepts',
                link: '/en-us/docs/concepts.html',
              },
              {
                title: 'Architecure',
                link: '/en-us/docs/architecture.html',
              },
            ],
          },
          {
            title: 'Quick Start',
            opened: true,
            children: [
              {
                title: 'Nacos Quick Start',
                link: '/en-us/docs/quick-start.html',
              },
                {
                    title: 'Quick Start Spring',
                    link: '/en-us/docs/quick-start-spring.html',
                },
                {
                    title: 'Quick Start Spring Boot',
                    link: '/en-us/docs/quick-start-spring-boot.html',
                },
                {
                    title: 'Quick Start Spring Cloud',
                    link: '/en-us/docs/quick-start-spring-cloud.html',
                },
            ],
          },
          {
            title: 'User Guide',
            opened: true,
            children: [
              {
                 title: 'Java SDK',
                 link: '/en-us/docs/sdk.html',
              },
              {
                  title: 'Other Language',
                  link: '/en-us/docs/other-language.html',
               },
              {
                title: 'Open-API',
                link: '/en-us/docs/open-API.html',
              },
            ],
          },
          {
            title: 'Admin Guide',
            children: [
              {
                title: 'Deployment Guide',
                link: '/en-us/docs/deployment.html',
              },
                {
                    title: 'Cluster Mode Deployment',
                    link: '/en-us/docs/cluster-mode-quick-start.html',
                },
              {
                title: 'Management OpenAPI',
                link: '/en-us/docs/managementAPI.html',
              },
              {
                title: 'Nacos Operator CLI Guide',
                link: '/en-us/docs/CLI-guide.html',
              },
              {
                title: 'Admin Console Guide',
                link: '/en-us/docs/console-guide.html',
              },
            ],
          },
          {
            title: 'Contributor Guide',
            children: [
              {
                title: 'Contribute to Nacos',
                link: '/en-us/docs/contributing.html',
              },
              {
                title: 'Nacos Activity',
                link: '/zh-cn/docs/activity.html',
              },
              {
                title: 'Pull Request Template',
                link: '/en-us/docs/pull-request.html',
              },
              {
                title: 'How to reporting bugs',
                link: '/en-us/docs/how-to-reporting-bugs.html',
              },
              {
                title: 'Nacos RoadMap',
                link: '/en-us/docs/roadmap.html',
              },
              {
                title: 'Nacos with SpringCloud',
                link: '/en-us/docs/use-nacos-with-springcloud.html',
              },
              {
                title: 'Nacos with Dubbo',
                link: '/en-us/docs/use-nacos-with-dubbo.html',
              },
              {
                title: 'Nacos with K8s',
                link: '/en-us/docs/use-nacos-with-kubernetes.html',
              },
              {
                title: 'Nacos with Istio',
                link: '/en-us/docs/use-nacos-with-istio.html',
              },
            ],
          },
          {
            title: 'Community',
            children: [
              {
                title: 'Community',
                link: '/en-us/docs/community.html',
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
                link: '/zh-cn/docs/what-is-nacos.html',
              },
              {
                title: '概念',
                link: '/zh-cn/docs/concepts.html',
              },
              {
                title: '架构',
                link: '/zh-cn/docs/architecture.html',
              },
            ],
          },
            {
                title: '快速入门',
                opened: true,
                children: [
                    {
                        title: '快速入门',
                        link: '/zh-cn/docs/quick-start.html',
                    },
            {
                title: 'Nacos与Spring快速入门',
                link: '/zh-cn/docs/quick-start-spring.html',
            },
            {
                title: 'Nacos与Spring Boot快速入门',
                link: '/zh-cn/docs/quick-start-spring-boot.html',
            },
            {
                title: 'Nacos与Spring Cloud快速入门',
                link: '/zh-cn/docs/quick-start-spring-cloud.html',
            },
            ]
            },
          {
            title: '用户指南',
            opened: true,
            children: [
              {
                 title: 'Java的SDK',
                  link: '/zh-cn/docs/sdk.html',
              },

              {
                  title: '其他语言的SDK',
                  link: '/zh-cn/docs/other-language.html',
              },
              {
                  title: 'Open-API指南',
                  link: '/zh-cn/docs/open-API.html',
              },
            ],
          },
          {
            title: '运维指南',
            children: [
              {
                title: '部署手册',
                link: '/zh-cn/docs/deployment.html',
              },
                {
                    title: '集群部署说明',
                    link: '/zh-cn/docs/cluster-mode-quick-start.html',
                },
                {
                title: '运维API',
                link: '/zh-cn/docs/managementAPI.html',
              },
              {
                title: '命令行手册',
                link: '/zh-cn/docs/CLI-guide.html',
              },
              {
                title: '控制台手册',
                link: '/zh-cn/docs/console-guide.html',
              }
            ],
          },
          {
            title: '开源共建',
            children: [
              {
                title: '贡献源码',
                link: '/zh-cn/docs/contributing.html',
              },
              {
                title: 'Nacos有奖活动介绍',
                link: '/zh-cn/docs/activity.html',
               },
              {
                title: 'pull request模板',
                link: '/zh-cn/docs/pull-request.html',
              },
              {
                title: '如何提交问题报告',
                link: '/zh-cn/docs/how-to-reporting-bugs.html',
              },
              {
                title: 'Nacos规划',
                link: '/zh-cn/docs/roadmap.html',
              },
              {
                  title: 'Nacos支持SpringCloud生态',
                  link: '/zh-cn/docs/use-nacos-with-springcloud.html',
              },
              {
                  title: 'nacos支持dubbo生态',
                  link: '/zh-cn/docs/use-nacos-with-dubbo.html',
              },
              {
                  title: 'Nacos支持k8s',
                  link: '/zh-cn/docs/use-nacos-with-kubernetes.html',
              },
              {
                  title: 'nacos支持istio',
                  link: '/zh-cn/docs/use-nacos-with-istio.html',
              },
            ],
          },
          {
            title: '社区',
            children: [
              {
                title: '社区',
                link: '/zh-cn/docs/community.html',
              }
            ],
          },
        ],
      },
    ],
    barText: 'Nacos 文档',
  },
};
