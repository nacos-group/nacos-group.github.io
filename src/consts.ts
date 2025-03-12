// Place any global data in this file.

// You can import this data from anywhere in your site by using the `import` keyword.
export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

// 吊顶提示文案
export const TOPBAR = {
    "text": "大促采购季，新用户首购低至5折",
    "mobileText": "大促采购季，新用户首购低至5折",
    "link": "https://www.aliyun.com/activity/purchase/mseapiwg20251",
    "target": "_blank",
    "display": true
}
export const MEDIARESOURCE = [
    {
        "key": "1",
        "src": "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsNjFUYnBNSkd6cmpoU0U5cG9KRWtZQzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        "cover": "https://img.alicdn.com/imgextra/i2/O1CN01mZMLGh1WIsTB2WOEB_!!6000000002766-0-tps-2516-1282.jpg "
    },
    {
        "key": "2",
        "src": "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsMWppZ21TWGh4TDE/U2FmT3I2OU9yZTZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        "cover": "https://img.alicdn.com/imgextra/i2/O1CN01S9Q8mE1FJvunXlzc2_!!6000000000467-0-tps-2296-1164.jpg"
    },
    {
        "key": "3",
        "src": "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsMERLOHRmWmdQR1Ywcjl5dlM2Nk1YSzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        "cover": "https://img.alicdn.com/imgextra/i2/O1CN01MOLx6f1k1qMPncU8j_!!6000000004624-0-tps-2552-1158.jpg"
    },
    {
        "key": "4",
        "src": "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsNFFUMXFoNnp2NXBPaEFUNFNDYUVRRzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        "cover": "https://img.alicdn.com/imgextra/i1/O1CN01fkLmjc1n7HuqYQst1_!!6000000005042-0-tps-2300-1166.jpg"
    }
]

// 文档根据版本区分的提示banner
export const DOCS_BANNER = {
    latest: '',
    next: '',
    v1: '',
    v2: '',
}

export const i18nMap = {
    "blog": {
        article: 'blog.article.technical',
        case: 'blog.article.case.best.practices',
        ecosystem: 'blog.article.ecosystem.articles',
        all: 'blog.all.articles',
        announcement: 'blog.activity.community.announcement',
        customer: 'blog.article.customer',
        community: 'blog.article.community',
        other: 'blog.article.other',
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
    // {
    //     type: 'article',
    //     title: '技术文章',
    //     href: '/blog/article'
    // },

    // {
    //     type: 'ecosystem',
    //     title: '生态文章',
    //     href: '/blog/ecosystem'
    // },
    // {
    //     type: 'case',
    //     title: '最佳实践',
    //     href: '/blog/case'
    // },
    {
        type: 'article',
        title: '技术',
        href: '/blog/article'
    },
    {
        type: 'announcement',
        title: '公告',
        href: '/blog/announcement'
    },
    // {
    //     type: 'customer',
    //     title: '客户',
    //     href: '/blog/customer'
    // },
    {
        type: 'community',
        title: '社区',
        href: '/blog/community'
    },
    // {
    //     type: 'other',
    //     title: '其他',
    //     href: '/blog/other'
    // },
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
        "slug": "announcement-nacos-security-problem-file",
        "description": "关于近期Nacos的任意文件读写漏洞说明及解决办法",
        "imageUrl": "https://img.alicdn.com/imgextra/i4/O1CN01bGnAVW1pFeLFnlaQL_!!6000000005331-2-tps-508-370.png"
    },
    {
        "collection": "blog",
        "slug": "case-authorization",
        "description": "Nacos 安全使用最佳实践 - 访问控制实践",
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

export const versionDataSource = [
    { 
        title: "可用性", 
        data: [
        {
            name: {
                title: 'SLA',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: '',
                des: '无 SLA 保障'
            },
            speciality: {
                checked: '',
                des: '99.95%',
            },
            serverless: {
                checked: '',
                des: '99.99%'
            },
        },
        {
            name: {
                title: '风险自动扫描管理',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '异常节点自愈',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '配置标签灰度',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '多节点容灾',
                des: ''
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '多可区容灾',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '推空保护',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '流量防护',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '配额管理',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '无损变更能力',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '自动扩缩容',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: false,
                des: ''
            },
            serverless: {
                checked: true,
                des: '内置扩容上限，避免恶意攻击导致资损'
            },
        },
    ] },
    { title: "安全性", data: [
        {
            name: {
                title: 'RAM 鉴权体系',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '无 AK 的 访问模式',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: 'ACL 白名单访问控制',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: 'TLS 传输加密，变更实时生效',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: 'KMS 配置存储加密，自定义轮转， 变更实时生效',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '漏洞热修复能力（无感知、不重启）',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
    ] },
    { title: "易用性", data:[
        {
            name: {
                title: '自动化运维',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: '',
                des: '免运维'
            },
        },
        {
            name: {
                title: '域名自动绑定',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '故障节点自愈（无需人工干预）',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '网关、服务治理等默认集成',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '平滑迁移工具',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: 'Eureka 协议兼容',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '事件中心',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
        {
            name: {
                title: '默认集成grafana监控大盘（30+监控项）',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: '只提供业务监控指标，用于自动弹性伸缩'
            },
        },
        {
            name: {
                title: '默认配置监控告警（可丰富自定义）',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: true,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: '只提供业务监控指标，用于自动弹性伸缩'
            },
        },
        {
            name: {
                title: '高级监控（服务推送轨迹、配置推送轨迹等）',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: ''
            },
            speciality: {
                checked: true,
                des: ''
            },
            serverless: {
                checked: true,
                des: ''
            },
        },
    ] },
    { title: "性能", data: [
        {
            name: {
                title: '推送性能提升',
            },
            free: {
                checked: '',
                des: '自行调优',
            },
            develop: {
                checked: '',
                des: '和社区版持平',
            },
            speciality: {
                checked: '',
                des: '202%',
            },
            serverless: {
                checked: '',
                des: '202%'
            },
        },
        {
            name: {
                title: 'TPS 性能提升',
            },
            free: {
                checked: '',
                des: '自行调优',
            },
            develop: {
                checked: '',
                des: '和社区版持平',
            },
            speciality: {
                checked: '',
                des: '40%',
            },
            serverless: {
                checked: '',
                des: '40%'
            },
        },
        {
            name: {
                title: 'QPS 送性能提升',
            },
            free: {
                checked: '',
                des: '自行调优',
            },
            develop:  {
                checked: '',
                des: '和社区版持平',
            },
            speciality:{
                checked: '',
                des: '55%',
            },
            serverless: {
                checked: '',
                des: '55%',
            },
        },
    ] },
]
