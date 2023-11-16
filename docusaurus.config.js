// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nacos',
  favicon: 'https://img.alicdn.com/tfs/TB1hgJpHAPoK1RjSZKbXXX1IXXa-64-64.png',

  // Set the production url of your site here
  url: 'https://nacos.io',
  // url: 'https://nacos-group.github.io',
  // organizationName: 'qq635840580',
  // deploymentBranch: 'develop-new-framework',
  // projectName: 'nacos-group.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'alibaba', // Usually your GitHub org/user name.
  projectName: 'nacos', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  clientModules: [require.resolve('./src/myClientModule.ts'), require.resolve('./src/custom-js.ts')],
  i18n: {
    defaultLocale: 'default',
    locales: ['en', 'zh-cn', 'default'],
    localeConfigs: {
      'en': {
        label: 'En',
        htmlLang: 'en-US',
      },
      'zh-cn': {
        label: '中',
        htmlLang: 'zh-CN',
      },
    }
  },
  scripts: [
    { src: '//g.alicdn.com/mamba/mse-arc-ui/0.0.21/umd/mse-arc-ui.min.js' },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-0YDFJ7LX7F',
      async: true,
    },
  ],
  stylesheets: [
    {
      href: '//g.alicdn.com/mamba/mse-arc-ui/0.0.21/umd/mse-arc-ui.min.css',
    },
  ],
  plugins: ['docusaurus-plugin-sass',
    './postcss-tailwind-loader.js',
    ['docusaurus-plugin-includes',
      {
        injectedHtmlTags: {
          headTags: [
            {
              tagName: 'meta',
              attributes: {
                name: 'aes-config',
                content: 'pid=xux-opensource&user_type=101&uid=&username=&dim10=nacos',
              },
            },
          ],
          preBodyTags: [
            {
              tagName: 'script',
              attributes: {
                src: '//g.alicdn.com/alilog/mlog/aplus_v2.js',
                id: 'beacon-aplus',
                exparams: 'clog=o&aplus&sidx=aplusSidx&ckx=aplusCkx',
              },
            },
            {
              tagName: 'script',
              attributes: {
                src: '//g.alicdn.com/aes/??tracker/1.0.34/index.js,tracker-plugin-pv/2.4.5/index.js,tracker-plugin-event/1.2.5/index.js,tracker-plugin-jserror/1.0.13/index.js,tracker-plugin-api/1.1.14/index.js,tracker-plugin-perf/1.1.8/index.js,tracker-plugin-eventTiming/1.0.4/index.js',
              },
            },
            {
              tagName: 'script',
              attributes: {
                src: '//hm.baidu.com/hm.js?e3a5cec56ef8619cf9d7c2abebd509e3',
              },
            }
          ],
        }
      },
    ]
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // lastVersion: 'current',
          // versions: {
          //   current: {
          //     label: '',
          //     path: '',
          //   },
          // },
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: '全部博文',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      metadata: [{ name: 'keywords', content: 'Nacos' }],
      image: 'img/nacos_colorful.png',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true, // 禁止切换主题模式
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Nacos Logo',
          src: 'img/nacos_colorful.png',
        },
        items: [
          {
            label: ' ',
            to: 'https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html',
            activeBaseRegex: '^/$',
            position: 'right',
          },
          // {
          //   label: 'Blog',
          //   to: '/blog',
          //   activeBaseRegex: '^/blog/',
          // },
          {
          label: 'Home',
          to: '/',
          activeBaseRegex: '^/$',
          position: 'right',
        },
          // {
          //   label: 'Blog',
          //   to: '/blog',
          //   activeBaseRegex: '^/blog/',
          // },
          {
            type: "docsVersionDropdown",
            label: "Docs",
            docid: "what-is-nacos",
            position: "right",
          },
          // {
          //   label: 'Solutions',
          //   type: 'dropdown',
          //   position: 'right',
          //   items: [
          //     {
          //       label: 'Microservice Solution',
          //       href: 'https://www.alibabacloud.com/product/microservices-engine',
          //     }, 
          //     {
          //       label: 'Microservice on Serverless Solution',
          //       href: 'https://cn.aliyun.com/product/aliware/sae?spm=nacos-website.topbar.0.0.0',
          //     }, 
          //     {
          //       label: 'PaaS Solution',
          //       href: 'https://www.aliyun.com/product/edas?spm=nacos-website.topbar.0.0.0',
          //      },
          //      {
          //       label: 'Distributed transaction Solution',
          //       href: 'https://www.aliyun.com/aliware/txc?spm=nacos-website.topbar.0.0.0',
          //     }, 
          //     {
          //       label: 'High-availability Solution',
          //       href: 'https://www.aliyun.com/product/ahas?spm=nacos-website.topbar.0.0.0',
          //     },
          //     {
          //       label: 'Service mesh Solution',
          //       href: 'https://www.aliyun.com/product/servicemesh?spm=nacos-website.topbar.0.0.0',
          //     },
          //   ],
          // },
          // {
          //   label: 'NACOS IN CLOUD',
          //   href: 'https://cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0',
          //   position: 'right',
          //   target: '_blank',
          // },
          {
            label: 'NACOS CLOUD',
            position: 'right',
            to: '/cloud'
          },
          {
            label: 'E-BOOK-NACOS',
            href: 'https://developer.aliyun.com/ebook/36?spm=a2c6h.20345107.ebook-index.18.152c2984fsi5ST',
            position: 'right',
            target: '_blank',
          },
          {
            label: 'BLOG',
            position: 'right',
            to: '/blog',
          },
          {
            label: 'COMMUNITY',
            position: 'right',
            to: '/community',
          },
          {
            label: 'DEMO-CONSOLE',
            position: 'right',
            href: 'http://console.nacos.io/nacos/index.html',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      prism: {
        theme: lightCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: '1QV814950M',

        // Public API key: it is safe to commit it
        apiKey: 'c64d042c0f37873d8d45183b2f3675f8',

        indexName: 'nacos',
      },
    }),

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'referrer',
        content: 'no-referrer',
      }
    }
  ]
};

module.exports = config;
