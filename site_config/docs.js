export default {
  'en-us': {
    sidemenu: [
      {
        title: '类别标题1',
        children: [
          {
            title: '快速启动',
            link: '/docs/quick-start.md',
          },
          {
            title: '标题2',
            link: '/docs/demo2.md',
          },
          {
            title: '标题3',
            opened: true,
            children: [
              {
                title: '子标题3-1',
                link: '/docs/demo3.md',
              },
              {
                title: '子标题3-2',
                link: '/docs/demo4.md',
              }
            ],
          }
        ],
      },
    ],
    barText: 'Documentation',
  },
};
