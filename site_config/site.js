export default {
  rootPath: '', // 发布到服务器的根目录，需以/开头但不能有尾/，如果只有/，请填写空字符串
  port: 8080, // 本地开发服务器的启动端口
  domain: 'nacos.io', // 站点部署域名
  defaultSearch: 'baidu', // 默认搜索引擎，baidu或者google
  defaultLanguage: 'zh-cn',
  'en-us': {
    pageMenu: [
      {
        key: 'home', // 用作顶部菜单的选中
        text: 'HOME',
        link: '/en-us/index.html',
      },
      {
        key: 'docs',
        text: 'DOCS',
        link: '/en-us/docs/quick-start.html',
      },
      {
        key: 'solution',
        text: 'SOLUTIONS',
        link: '',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png',
        children: [
        {
          key: 'micoservice',
          text: 'Microservice Solution',
          link: 'https://www.alibabacloud.com/product/microservices-engine'
        }, {
          key: 'serverless',
          text: 'Microservice on Serverless Solution',
          link: 'https://cn.aliyun.com/product/aliware/sae?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'appas',
          text: 'PaaS Solution',
          link: 'https://www.aliyun.com/product/edas?spm=nacos-website.topbar.0.0.0'
         },
         {
          key: 'gts',
          text: 'Distributed transaction Solution',
          link: 'https://www.aliyun.com/aliware/txc?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'msha',
          text: 'High-availability Solution',
          link: 'https://www.aliyun.com/product/ahas?spm=nacos-website.topbar.0.0.0'
        },
        {
          key: 'mesh',
          text: 'Service mesh Solution',
          link: 'https://www.aliyun.com/product/servicemesh?spm=nacos-website.topbar.0.0.0',
        }
        ]
      },
      {
        key: 'Nacos in Cloud',
        text: 'NACOS IN CLOUD',
        link: 'https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png'
      },
      {
        key: 'E-BOOK',
        text: 'E-BOOK',
        link: 'https://developer.aliyun.com/topic/download?id=8230',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png'
      },
      {
        key: 'blog',
        text: 'BLOG',
        link: '/en-us/blog',
      },
      {
        key: 'community',
        text: 'COMMUNITY',
        link: '/en-us/community',
      },
      {
        text: 'DEMO-CONSOLE',
        link: 'http://console.nacos.io/nacos/index.html',
      },
    ],
    disclaimer: {
      title: 'Vision',
      content: 'By providing an easy-to-use service infrastructure such as dynamic service discovery, service configuration, service sharing and management and etc., Nacos help users better construct, deliver and manage their own service platform, reuse and composite business service faster and deliver value of business innovation more quickly so as to win market for users in the era of cloud native and in all cloud environments, such as private, mixed, or public clouds.',
    },
    documentation: {
      title: 'Documentation',
      list: [
        {
          text: 'Overview',
          link: '/en-us/docs/what-is-nacos.html',
        },
        {
          text: 'Quick start',
          link: '/en-us/docs/quick-start.html',
        },
        {
          text: 'Developer guide',
          link: '/en-us/docs/contributing.html',
        },
      ],
    },
    resources: {
      title: 'Resources',
      list: [
        {
          text: 'Community',
          link: '/en-us/community/index.html',
        },
        {
          text: 'Cloud Service MSE',
          link: 'https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0',
        },
        {
          text: 'Cloud Service EDAS',
          link: 'https://www.aliyun.com/product/edas?source_type=nacos_pc_20181219',
        },
        {
          text: 'Cloud Service AHAS',
          link: 'https://www.aliyun.com/product/ahas?source_type=nacos_pc_20190225',
        },
      ],
    },

    copyright: '@ 2022 The Nacos Authors | An Alibaba Middleware (Aliware) Project',
  },
  'zh-cn': {
    pageMenu: [
      {
        key: 'home',
        text: '首页',
        link: '/zh-cn/index.html',
      },
      {
        key: 'docs',
        text: '文档',
        link: '/zh-cn/docs/what-is-nacos.html',
      },
      {
        key: 'solution',
        text: '解决方案',
        link: '',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png',
        children: [
        {
          key: 'micoservice',
          text: '微服务解决方案',
          link: 'https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'serverless',
          text: '微服务Serverless解决方案',
          link: 'https://cn.aliyun.com/product/aliware/sae?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'appas',
          text: 'PaaS解决方案',
          link: 'https://www.aliyun.com/product/edas?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'gts',
          text: '分布式事务解决方案',
          link: 'https://www.aliyun.com/aliware/txc?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'msha',
          text: '高可用解决方案',
          link: 'https://www.aliyun.com/product/ahas?spm=nacos-website.topbar.0.0.0'
        }, {
          key: 'mesh',
          text: '服务网格解决方案',
          link: 'https://www.aliyun.com/product/servicemesh?spm=nacos-website.topbar.0.0.0',
        }
        ]
      },
      {
        key: 'Nacos in Cloud',
        text: '企业版NACOS',
        link: 'https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png'
      },
      {
        key: 'E-BOOK',
        text: 'NACOS架构与原理',
        link: 'https://developer.aliyun.com/topic/download?id=8230',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png'
      },
      {
        key: 'E-BOOK1',
        text: '治理白皮书',
        link: 'https://developer.aliyun.com/ebook/7565',
        imgUrl: 'https://img.alicdn.com/tfs/TB1esl_m.T1gK0jSZFrXXcNCXXa-200-200.png'
      },
      {
        key: 'blog',
        text: '博客',
        link: '/zh-cn/blog/index.html',
      },
      {
        key: 'community',
        text: '社区',
        link: '/zh-cn/community/index.html',
      },
      {
        text: '控制台样例',
        link: 'http://console.nacos.io/nacos/index.html',
      },
    ],
    disclaimer: {
      title: '愿景',
      content: 'Nacos 通过提供简单易用的动态服务发现、服务配置、服务共享与管理等服务基础设施，帮助用户在云原生时代，在私有云、混合云或者公有云等所有云环境中，更好的构建、交付、管理自己的微服务平台，更快的复用和组合业务服务，更快的交付商业创新的价值，从而为用户赢得市场。',
    },
    documentation: {
      title: '文档',
      list: [
        {
          text: '概览',
          link: '/zh-cn/docs/what-is-nacos.html',
        },
        {
          text: '快速开始',
          link: '/zh-cn/docs/quick-start.html',
        },
        {
          text: '开发者指南',
          link: '/zh-cn/docs/contributing.html',
        },
      ],
    },
    resources: {
      title: '资源',
      list: [
        {
          text: '社区',
          link: '/zh-cn/community/index.html',
        },
        {
          text: '云服务 MSE',
          link: 'https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0',
        },
        {
          text: '云服务 EDAS',
          link: 'https://www.aliyun.com/product/edas?source_type=nacos_pc_20181219',
        },
        {
          text: '云服务 AHAS',
          link: 'https://www.aliyun.com/product/ahas?source_type=nacos_pc_20190225',
        },
      ],
    },
    copyright: '@ 2022 The Nacos Authors | An Alibaba Middleware (Aliware) Project',
  },
};
