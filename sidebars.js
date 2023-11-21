/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // versionC: {
  //   docs:[
  //     {
  //       type: 'category',
  //       label: 'What is Nacos',
  //       collapsible: false,
  //       items: ['v2/what-is-nacos', 'v2/concepts', 'v2/architecture'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Quick Start',
  //       collapsible: false,
  //       items: ['v2/quickstart/quick-start', 'v2/quickstart/quick-start-docker', 'v2/quickstart/quick-start-kubernetes'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Upgrading',
  //       collapsible: false,
  //       items: ['v2/upgrading/2.0.0-compatibility', 'v2/upgrading/2.0.0-upgrading'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Plugin',
  //       collapsible: false,
  //       items: ['v2/plugin/auth-plugin', 'v2/plugin/config-encryption-plugin','v2/plugin/datasource-plugin','v2/plugin/trace-plugin','v2/plugin/custom-environment-plugin','v2/plugin/config-change-plugin','v2/plugin/control-plugin'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'User Guide',
  //       collapsible: false,
  //       items: ['v2/guide/user/sdk', 'v2/guide/user/other-language', 'v2/guide/user/open-api','v2/guide/user/auth','v2/guide/user/faq','v2/guide/user/parameters-check','v2/guide/user/failover'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Admin Guide',
  //       collapsible: false,
  //       items: ['v2/guide/admin/deployment', 
  //         'v2/guide/admin/cluster-mode-quick-start', 
  //         'v2/guide/admin/system-configurations',
  //         'v2/guide/admin/management-api',
  //         'v2/guide/admin/console-guide',
  //         'v2/guide/admin/monitor-guide',
  //         'v2/guide/admin/nacos2-config-benchmark',
  //         'v2/guide/admin/nacos2-naming-benchmark',
  //         'v2/ecology/use-nacos-sync',
  //       ],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Ecology',
  //       collapsible: false,
  //       items: ['v2/ecology/use-nacos-with-dubbo', 
  //         'v2/ecology/use-nacos-with-spring', 
  //         'v2/ecology/use-nacos-with-spring-boot',
  //         'v2/ecology/use-nacos-with-spring-cloud',
  //         'v2/ecology/use-nacos-sync',
  //         'v2/ecology/use-nacos-with-coredns',
  //       ],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Contributor Guide',
  //       collapsible: false,
  //       items: ['v2/contribution/contributing', 
  //         'v2/contribution/contributing-flow', 
  //         'v2/contribution/pull-request',
  //         'v2/contribution/how-to-reporting-bugs',
  //       ],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Community',
  //       collapsible: false,
  //       items: ['v2/community/community', 'v2/community/nacos-dev',],
  //     },
  //   ]
  // },
  // version1: {
  //   docs: [
  //     {
  //       "type": "category",
  //       "label": "What is Nacos",
  //       "collapsible": false,
  //       "items": [
  //         "what-is-nacos",
  //         "concepts",
  //         "architecture"
  //       ]
  //     },
  //     {
  //       "type": "category",
  //       "label": "Quick Start",
  //       "collapsible": false,
  //       "items": [
  //         "quick-start",
  //         "quick-start-spring",
  //         "quick-start-spring-boot",
  //         "quick-start-spring-cloud",
  //         "quick-start-docker",
  //         "use-nacos-with-dubbo",
  //         "use-nacos-with-kubernetes",
  //         "nacos-sync"
  //       ]
  //     },
  //     {
  //       "type": "category",
  //       "label": "User Guide",
  //       "collapsible": false,
  //       "items": [
  //         "sdk",
  //         "other-language",
  //         "open-api",
  //         "nacos-spring",
  //         "system-configurations",
  //         "auth",
  //         "faq"
  //       ]
  //     },
  //     {
  //       "type": "category",
  //       "label": "Admin Guide",
  //       "collapsible": false,
  //       "items": [
  //         "deployment",
  //         "cluster-mode-quick-start",
  //         "management-api",
  //         "console-guide",
  //         "monitor-guide",
  //         "nacos-config-benchmark",
  //         "nacos-naming-benchmark",
  //         "nacos-sync-use"
  //       ]
  //     },
  //     {
  //       "type": "category",
  //       "label": "Contributor Guide",
  //       "collapsible": false,
  //       "items": [
  //         "contributing",
  //         "contributing-flow",
  //         "pull-request",
  //         "how-to-reporting-bugs"
  //       ]
  //     },
  //     {
  //       "type": "category",
  //       "label": "Community",
  //       "collapsible": false,
  //       "items": [
  //         "community",
  //         "nacos-dev"
  //       ]
  //     }
  //   ]
  // },
  // // 版本 2 的侧边栏配置
  // version2: {
  //   docs:[
  //     {
  //       type: 'category',
  //       label: 'What is Nacos',
  //       collapsible: false,
  //       items: ['v2/what-is-nacos', 'v2/concepts', 'v2/architecture'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Quick Start',
  //       collapsible: false,
  //       items: ['v2/quickstart/quick-start', 'v2/quickstart/quick-start-docker', 'v2/quickstart/quick-start-kubernetes'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Upgrading',
  //       collapsible: false,
  //       items: ['v2/upgrading/2.0.0-compatibility', 'v2/upgrading/2.0.0-upgrading'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Plugin',
  //       collapsible: false,
  //       items: ['v2/plugin/auth-plugin', 'v2/plugin/config-encryption-plugin','v2/plugin/datasource-plugin','v2/plugin/trace-plugin','v2/plugin/custom-environment-plugin','v2/plugin/config-change-plugin','v2/plugin/control-plugin'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'User Guide',
  //       collapsible: false,
  //       items: ['v2/guide/user/sdk', 'v2/guide/user/other-language', 'v2/guide/user/open-api','v2/guide/user/auth','v2/guide/user/faq','v2/guide/user/parameters-check','v2/guide/user/failover'],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Admin Guide',
  //       collapsible: false,
  //       items: ['v2/guide/admin/deployment', 
  //         'v2/guide/admin/cluster-mode-quick-start', 
  //         'v2/guide/admin/system-configurations',
  //         'v2/guide/admin/management-api',
  //         'v2/guide/admin/console-guide',
  //         'v2/guide/admin/monitor-guide',
  //         'v2/guide/admin/nacos2-config-benchmark',
  //         'v2/guide/admin/nacos2-naming-benchmark',
  //         'v2/ecology/use-nacos-sync',
  //       ],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Ecology',
  //       collapsible: false,
  //       items: ['v2/ecology/use-nacos-with-dubbo', 
  //         'v2/ecology/use-nacos-with-spring', 
  //         'v2/ecology/use-nacos-with-spring-boot',
  //         'v2/ecology/use-nacos-with-spring-cloud',
  //         'v2/ecology/use-nacos-sync',
  //         'v2/ecology/use-nacos-with-coredns',
  //       ],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Contributor Guide',
  //       collapsible: false,
  //       items: ['v2/contribution/contributing', 
  //         'v2/contribution/contributing-flow', 
  //         'v2/contribution/pull-request',
  //         'v2/contribution/how-to-reporting-bugs',
  //       ],
  //     },
  //     {
  //       type: 'category',
  //       label: 'Community',
  //       collapsible: false,
  //       items: ['v2/community/community', 'v2/community/nacos-dev',],
  //     },
  //   ]
  // },
  docs:[
    {
      type: 'category',
      label: 'What is Nacos',
      collapsible: false,
      items: ['v2/what-is-nacos', 'v2/concepts', 'v2/architecture'],
    },
    {
      type: 'category',
      label: 'Quick Start',
      collapsible: false,
      items: ['v2/quickstart/quick-start', 'v2/quickstart/quick-start-docker', 'v2/quickstart/quick-start-kubernetes'],
    },
    {
      type: 'category',
      label: 'Upgrading',
      collapsible: false,
      items: ['v2/upgrading/2.0.0-compatibility', 'v2/upgrading/2.0.0-upgrading'],
    },
    {
      type: 'category',
      label: 'Plugin',
      collapsible: false,
      items: ['v2/plugin/auth-plugin', 'v2/plugin/config-encryption-plugin','v2/plugin/datasource-plugin','v2/plugin/trace-plugin','v2/plugin/custom-environment-plugin','v2/plugin/config-change-plugin','v2/plugin/control-plugin'],
    },
    {
      type: 'category',
      label: 'User Guide',
      collapsible: false,
      items: ['v2/guide/user/sdk', 'v2/guide/user/other-language', 'v2/guide/user/open-api','v2/guide/user/auth','v2/guide/user/faq','v2/guide/user/parameters-check','v2/guide/user/failover'],
    },
    {
      type: 'category',
      label: 'Admin Guide',
      collapsible: false,
      items: ['v2/guide/admin/deployment', 
        'v2/guide/admin/cluster-mode-quick-start', 
        'v2/guide/admin/system-configurations',
        'v2/guide/admin/management-api',
        'v2/guide/admin/console-guide',
        'v2/guide/admin/monitor-guide',
        'v2/guide/admin/nacos2-config-benchmark',
        'v2/guide/admin/nacos2-naming-benchmark',
        'v2/ecology/use-nacos-sync',
      ],
    },
    {
      type: 'category',
      label: 'Ecology',
      collapsible: false,
      items: ['v2/ecology/use-nacos-with-dubbo', 
        'v2/ecology/use-nacos-with-spring', 
        'v2/ecology/use-nacos-with-spring-boot',
        'v2/ecology/use-nacos-with-spring-cloud',
        'v2/ecology/use-nacos-sync',
        'v2/ecology/use-nacos-with-coredns',
      ],
    },
    {
      type: 'category',
      label: 'Contributor Guide',
      collapsible: false,
      items: ['v2/contribution/contributing', 
        'v2/contribution/contributing-flow', 
        'v2/contribution/pull-request',
        'v2/contribution/how-to-reporting-bugs',
      ],
    },
    {
      type: 'category',
      label: 'Community',
      collapsible: false,
      items: ['v2/community/community', 'v2/community/nacos-dev',],
    },
  ]

  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;
