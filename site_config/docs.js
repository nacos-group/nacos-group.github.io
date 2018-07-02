export default {
  'en-us': {
    sidemenu: [
      {
        title: 'Nacos ',
        children: [
          {
            title: 'what is Nacos',
            opened: true,
            children: [
              {
                title: 'what is nacos',
                link: '/docs/nacos.md',
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
            title: 'user guide',
            opened: true,
            children: [
              {
                title: 'quickstart',
                link: '/docs/quick-start.md',
              },
              {
                title: 'SDK',
                link: '/docs/sdk.md',
              },
              {
                title: 'open-API',
                link: '/docs/open-API.md',
              }
            ],
          },
          {
            title: 'admin guide',
            children: [
              {
                title: 'deployment',
                link: '/docs/simple-ops.md',
              },
              {
                title: 'operations',
                link: '/docs/cluster-management.md',
              },
              {
                title: 'cluster management',
                link: '/docs/cluster-management.md',
              },
              {
                title: 'open-API',
                link: '/docs/open-API.md',
              }
            ],
          },
          {
            title: 'contributor guide',
            children: [
              {
                title: 'Contributing to Nacos',
                link: '/docs/contributing.md',
              },
              {
                title: 'request template',
                link: '/docs/request_template.md',
              },
              {
                title: 'roadMap',
                link: '/docs/request_template.md',
              }
            ],
          },
          {
            title: 'community',
            link: '/docs/community.md',
            children: [
              {
                title: 'community',
                link: '/docs/community.md',
              }
            ],
          },
        ],
      },
    ],
    barText: 'Documentation',
  },
};
