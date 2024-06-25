// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

// 吊顶提示文案
export const TOPBAR = {
    "text": "7月6日（周六）开源沙龙首个AI原生应用架构专场 | 上海站 ，欢迎报名！",
    "mobileText": "7月6日（周六）开源沙龙首个AI原生应用架构专场 | 上海站 ，欢迎报名！",
    "link": "https://summit.aliyun.com/cloudnative2024_developer_shanghai?spm=5176.20960838.0.0.7802305eyqMQf8",
    "target": "_self"
}
export const MEDIARESOURCE = [
    {
        src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsNjFUYnBNSkd6cmpoU0U5cG9KRWtZQzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        cover: 'https://img.alicdn.com/imgextra/i2/O1CN01mZMLGh1WIsTB2WOEB_!!6000000002766-0-tps-2516-1282.jpg'
    },
    {
        src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsMWppZ21TWGh4TDE/U2FmT3I2OU9yZTZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        cover: 'https://img.alicdn.com/imgextra/i2/O1CN01S9Q8mE1FJvunXlzc2_!!6000000000467-0-tps-2296-1164.jpg'
    },
    {
        src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsMERLOHRmWmdQR1Ywcjl5dlM2Nk1YSzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        cover: "https://img.alicdn.com/imgextra/i2/O1CN01MOLx6f1k1qMPncU8j_!!6000000004624-0-tps-2552-1158.jpg"
    },
    {
        src: "https://cloud.video.taobao.com/vod/play/REFkazc0bXZaVE82emRHbklyTEdsNFFUMXFoNnp2NXBPaEFUNFNDYUVRRzZQZWw1SnpKVVVCTlh4OVFON0V5UUVMUDduY1RJak82VE1sdXdHTjNOaHc9PQ",
        cover: "https://img.alicdn.com/imgextra/i1/O1CN01fkLmjc1n7HuqYQst1_!!6000000005042-0-tps-2300-1166.jpg",
    },
];

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
        "slug": "activity-preview-opss2024",
        "description": "Nacos开源之夏2024，贡献社区赢取12000奖金",
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
                checked: false,
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
                title: '故障节点自动摘除',
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
                des: '',
            },
        },
        {
            name: {
                title: '云原生网关、治理深度集成',
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
    ] },
    { title: "可用性", data: [
        {
            name: {
                title: 'SLA',
            },
            free: {
                checked: false,
                des: ''
            },
            develop: {
                checked: false,
                des: '无 SLA 保障'
            },
            speciality: {
                checked: false,
                des: '99.95%',
            },
            serverless: {
                checked: false,
                des: '99.95%'
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
                title: '全局风险自动识别管理',
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
                title: '注册中心推空保护',
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
                title: '无损上下线能力',
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
                checked: true,
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
                title: 'ACL 控制',
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
                title: 'KMS 存储加密，自定义轮转， 变更实时生效',
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
    { title: "性能", data: [
        {
            name: {
                title: 'TPS 性能提升',
            },
            free: {
                checked: false,
                des: '自行调优',
            },
            develop: {
                checked: false,
                des: '持平',
            },
            speciality: {
                checked: false,
                des: '40%',
            },
            serverless: {
                checked: false,
                des: '40%'
            },
        },
        {
            name: {
                title: 'QPS 送性能提升',
            },
            free: {
                checked: false,
                des: '自行调优',
            },
            develop:  {
                checked: false,
                des: '持平',
            },
            speciality:{
                checked: false,
                des: '55%',
            },
            serverless: {
                checked: false,
                des: '55%',
            },
        },
    ] },
    { title: "可观测性", data: [
        {
            name: {
                title: '基础监控告警',
                des: '（注册中心、配置中心、资源用量等）'
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
                title: '高级监控',
                des: '（服务推送轨迹、配置推送轨迹等）'
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
                checked: false,
                des: '免运维'
            },
        },
    ] },
]
