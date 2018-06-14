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
                link: '/docs/quick-start.md',
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
                link: '/docs/quickstart.md',
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
            title: 'OPS/admin guide',
            children: [
              {
                title: 'simple OPS',
                link: '/docs/simple-ops.md',
              },
              {
                title: 'cluster management',
                link: '/docs/cluster-management.md',
              }
            ],
          },
          {
            title: 'contributor/developer guide',
            children: [
              {
                title: 'Contributing to Nacos',
                link: '/docs/contributing.md',
              },
              {
                title: 'request template',
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
          {
            title: 'roadMap',
            children: [
              {
                title: 'roadMap',
                link: '/docs/roadMap.md',
              }
            ],
          }
        ],
      },
      
    ],
    barText: 'Documentation',
  },
};
