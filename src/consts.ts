// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

// 吊顶提示文案
export const TOPBAR = {
    text: 'Nacos 配置中心安全问题汇总及解决方案',
    mobileText:'Nacos 配置中心安全问题汇总及解决方案',
    link: 'https://nacos.io/blog/nacos-gvr7dx_awbbpb_sdtk4vkbson424zn/?source=blog_article',
    target: '_blank'
}
export const MEDIARESOURCE = [
    {
      src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsNjFUYnBNSkd6cmpoU0U5cG9KRWtZQzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
      cover:'https://img.alicdn.com/imgextra/i2/O1CN01mZMLGh1WIsTB2WOEB_!!6000000002766-0-tps-2516-1282.jpg'
    },
    {
      src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsMWppZ21TWGh4TDE/U2FmT3I2OU9yZTZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
      cover:'https://img.alicdn.com/imgextra/i2/O1CN01S9Q8mE1FJvunXlzc2_!!6000000000467-0-tps-2296-1164.jpg'
    },
    {
      src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsMERLOHRmWmdQR1Ywcjl5dlM2Nk1YSzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
      cover:"https://img.alicdn.com/imgextra/i2/O1CN01MOLx6f1k1qMPncU8j_!!6000000004624-0-tps-2552-1158.jpg"
    },
    {
      src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsNFFUMXFoNnp2NXBPaEFUNFNDYUVRRzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
      cover:"https://img.alicdn.com/imgextra/i1/O1CN01fkLmjc1n7HuqYQst1_!!6000000005042-0-tps-2300-1166.jpg",
    },
  ];

// 文档根据版本区分的提示banner
export const DOCS_BANNER = {
    latest: '',
    next:'',
    v1: '',
    v2:'',
}

export const i18nMap = {
    "blog": {
        article: 'blog.article.technical',
        case: 'blog.article.case.best.practices',
        ecosystem: 'blog.article.ecosystem.articles',
        all: 'blog.all.articles'
    },
    "news": {
        announcement: 'blog.activity.community.announcement',
        release: 'blog.activity.release.statement',
        committer: 'page.blog.news.personnel.promotion',
        cooperate: 'page.blog.news.community.cooperation',
        all: 'page.blog.news.all'
    },
    "activity": {
        'announcement': 'blog.activity.community.announcement',
        'activity-preview': 'blog.activity.preview.event',
        'activity-detail': 'blog.activity.detail.event',
        'all': 'blog.activity.all.event'

    },
    "wuyi": {
      'expertConsultation': 'wuyi.meet-professor.title',
    },
}

export const BLOG_CATEGORY = [
    {
        type: 'all',
        title: '全部文章',
        href: '/blog'
    },
    {
        type: 'article',
        title: '技术文章',
        href: '/blog/article'
    },

    {
        type: 'ecosystem',
        title: '生态文章',
        href: '/blog/ecosystem'
    },
    {
        type: 'case',
        title: '最佳实践',
        href: '/blog/case'
    },
];

export const WUYI_CATEGORY = [
    {
        type: 'expertConsultation',
        title: '全部文章',
        href: '/wuyi/'
    },
];

export const BLOG_CATEGORY_EN = BLOG_CATEGORY.map(item => ({
    ...item,
    href: '/en' + item.href
}));

export const NEWS_CATEGORY = [
    {
        type: 'announcement',
        title: '社区公告',
        href: '/news/announcement'
    },
    {
        type: 'release',
        title: '发布声明',
        href: '/news/release'
    },
    {
        type: 'committer',
        title: '人员晋升',
        href: '/news/committer'
    },
    {
        type: 'cooperate',
        title: '社区合作',
        href: '/news/cooperate'
    },
    {
        type: 'all',
        title: '全部新闻',
        href: '/news/all'
    }
]

export const ACTIVITY_CATEGORY = [
    {
        type: 'announcement',
        title: '社区公告',
        href: '/activity/announcement'
    },
    {
        type: 'activity-preview',
        title: '活动预告',
        href: '/activity/activity-preview'
    },
    {
        type: 'activity-detail',
        title: '活动详情',
        href: '/activity/activity-detail'
    },
    {
        type: 'all',
        title: '全部活动',
        href: '/activity/all'
    }
]

export const HEADER_ACTIVITY_CARD = [
    {
        "collection": "blog",
        "slug": "announcement-docker-hub-solution",
        "description": "关于Nacos镜像无法从DockerHub进行下载的临时解决方案",
        "imageUrl": "https://img.alicdn.com/imgextra/i4/O1CN01bGnAVW1pFeLFnlaQL_!!6000000005331-2-tps-508-370.png"
    },
    {
        "collection": "blog",
        "slug": "release-240-beta",
        "description": "2.4.0-BETA发布，欢迎试用",
        "imageUrl": "https://img.alicdn.com/imgextra/i4/O1CN01zfayJW1Lhe4kliPv9_!!6000000001331-2-tps-508-370.png"
    }
]

export const BLOG_IMAGE_SOURCE = [
    "https://img.alicdn.com/imgextra/i1/O1CN0114MKuq1qKyZ0heOq7_!!6000000005478-2-tps-304-179.png",
    "https://img.alicdn.com/imgextra/i2/O1CN01E4YfjD1WmBmWymUJC_!!6000000002830-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i1/O1CN01o9sjZA1Efd1bMrl0C_!!6000000000379-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i1/O1CN011wgjV01CZ695M8OEB_!!6000000000094-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i2/O1CN01swoIUH1csxKPKfwJE_!!6000000003657-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i4/O1CN01nIy1Wf1DjSiy0TCxe_!!6000000000252-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i3/O1CN019EjKf11Dj0KQKkP3e_!!6000000000251-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i2/O1CN01l7gM7r1Y4L5ngHWb8_!!6000000003005-2-tps-608-358.png",
    "https://img.alicdn.com/imgextra/i2/O1CN01oWfLB51kfENwUFaQw_!!6000000004710-2-tps-608-358.png"
]

export const ALGOLIA_CONFIG = {
    appId: '1QV814950M',
    apiKey: '7445da3dec050d45d29f3fe93ed45af3',
    indexName: 'nacos',
}