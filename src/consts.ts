// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
export const SITE_TITLE = 'Astro Blog';
export const SITE_DESCRIPTION = 'Welcome to my website!';

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

    }
}

export const BLOG_CATEGORY = [
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
    {
        type: 'all',
        title: '全部文章',
        href: '/blog/all'
    },
]

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
        "slug": "nacos-gvr7dx_awbbpb_sozg59av10r22awa",
        "description": "云原生开源沙龙北京站开启报名",
        "imageUrl": "https://img.alicdn.com/imgextra/i4/O1CN01bGnAVW1pFeLFnlaQL_!!6000000005331-2-tps-508-370.png"
    },
    {
        "collection": "blog",
        "slug": "announcement-2023-award",
        "description": "Nacos 荣获三个开源奖项",
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