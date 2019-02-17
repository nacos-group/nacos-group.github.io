export default {
    'en-us': {
        sidemenu: [

            {
                title: 'Committer Guide',
                children: [
                    {
                        title: 'How to contribute',
                        link: '/en-us/docs/contributing-dev.html', // 开发者文档均以_dev结尾作为文件名，md文件放在docs目录下
                    },
                    {
                        title: 'Developers',
                        link: '/en-us/docs/nacos-dev.html',
                    },
                ],
            }
        ],
        barText: 'Developers',
    },
    'zh-cn':
        {
            sidemenu: [
                {
                    title: '提交者向导',
                    children: [
                        {
                            title: '参与贡献',
                            link: '/zh-cn/docs/contributing-dev.html',
                        },
                        {
                            title: '开发人员',
                            link: '/zh-cn/docs/nacos-dev.html',
                        }
                    ],
                }
            ],
            barText:
                '开发者',
        }
}
;
