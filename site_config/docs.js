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
                link: '/docs/what-is-nacos.md',
              },
              {
                title: 'Concepts',
                link: '/docs/concepts.md',
              },
              {
                title: 'Architecure',
                link: '/docs/architecure.md',
              },
            ],
          },
          {
            title: 'User Guide',
            opened: true,
            children: [
              {
                title: 'Quick Start',
                link: '/docs/quick-start.md',
              },

              {
                 title: 'Java SDK',
                 link: '/docs/sdk.md',
              },
              {
                  title: 'Other Language',
                  link: '/docs/other-language.md',
               },
              {
                title: 'Open-API',
                link: '/docs/open-API.md',
              },
            ],
          },
          {
            title: 'Admin Guide',
            children: [
              {
                title: 'Deployment Guide',
                link: '/docs/deployment.md',
              },
              {
                title: 'Management OpenAPI',
                link: '/docs/managementAPI.md',
              },
              {
                title: 'Nacos Operator CLI Guide',
                link: '/docs/CLI-guide.md',
              },
              {
                title: 'Admin Console Guide',
                link: '/docs/console-guide.md',
              },
            ],
          },
          {
            title: 'Contributor Guide',
            children: [
              {
                title: 'Contribute to Nacos',
                link: '/docs/contributing.md',
              },
              {
                title: 'Pull Request Template',
                link: '/docs/pull-request.md',
              },
              {
                title: 'Nacos RoadMap',
                link: '/docs/roadmap.md',
              },
            ],
          },
          {
            title: 'Community',
            children: [
              {
                title: 'Community',
                link: '/docs/community.md',
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
                link: '/docs/what-is-nacos.md',
              },
              {
                title: '概念',
                link: '/docs/concepts.md',
              },
              {
                title: '架构',
                link: '/docs/architecure.md',
              },
            ],
          },
          {
            title: '用户指南',
            opened: true,
            children: [
              {
                title: '快速入门',
                link: '/docs/quick-start.md',
              },
              {
                 title: 'Java的SDK',
                  link: '/docs/sdk.md',
              },
              {
                  title: '其他语言的SDK',
                  link: '/docs/other-language.md',
              },
              {
                  title: 'Open-API指南',
                  link: '/docs/open-API.md',
              },
            ],
          },
          {
            title: '运维指南',
            children: [
              {
                title: '部署手册',
                link: '/docs/deployment.md',
              },
              {
                title: '运维API',
                link: '/docs/managementAPI.md',
              },
              {
                title: '命令行手册',
                link: '/docs/CLI-guide.md',
              },
              {
                title: '控制台手册',
                link: '/docs/console-guide.md',
              }
            ],
          },
          {
            title: '开源共建',
            children: [
              {
                title: '贡献源码',
                link: '/docs/contributing.md',
              },
              {
                title: 'pull request模板',
                link: '/docs/pull-request.md',
              },
              {
                title: 'Nacos规划',
                link: '/docs/roadmap.md',
              },
            ],
          },
          {
            title: '社区',
            children: [
              {
                title: '社区',
                link: '/docs/community.md',
              }
            ],
          },
        ],
      },
    ],
    barText: 'Nacos 文档',
  },
};
