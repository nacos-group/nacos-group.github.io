export default {
  'en-us': {
    barText: 'Blog',
    postsTitle: 'All posts',
    list: [
      {
        title: 'The first Dubbo meetup has been held in Beijing',
        author: 'Huxing Zhang',
        dateStr: 'May 12nd，2018',
        desc: 'The first Dubbo meetup has successfully been held in Beijing, over 400+ people were present. What a great event! ',
        link: '/blog/dubbo-meetup-beijing-may-12th-2018.md',
      }
    ]
  },
  'zh-cn': {
    barText: '博客',
    postsTitle: '所有文章',
    list: [
      {
        title: '基于DNS的服务发现 TODO 正己',
        author: '@beiwei30',
        dateStr: 'June 2nd, 2018',
        desc: '现代的分布式服务框架的基本概念与 RMI 是类似的，同样是使用 Java 的 Interface 作为服务契约，通过注册中心来完成服务的注册和发现，远程通讯的细节也是通过代理类来屏蔽。',
        link: '/blog/dubbo-101.md',
      },
      {
        title: 'Nacos - 阿里巴巴注册中心和配置中心开源计划 TODO 坤宇',
        author: '@cvictory',
        dateStr: 'June 1st, 2018',
        desc: '主要讲述如何配置dubbo，按照配置方式上分，可以分为：XML配置，properties方式配置，注解方式配置，API调用方式配置。',
        link: '/blog/dubbo-basic-usage-dubbo-provider-configuration.md',
      },
      {
        title: '注册中心实战 TODO 亦盏',
        author: 'Huxing Zhang',
        dateStr: 'May 28th, 2018',
        desc: 'dubbo-spring-boot-project致力于简化 Dubbo RPC 框架在Spring Boot应用场景的开发，同时也整合了Spring Boot特性。',
        link: '/blog/spring-boot-dubbo-start-stop-analysis.md',
      },
      {
        title: 'Nacos开源 TODO 慕义',
        author: '@hengyunabc',
        dateStr: 'May 20th, 2018',
        desc: '要提高代码执行效率，一个重要的原则就是尽量避免CPU把流水线清空，那么提高分支预测的成功率就非常重要。那么对于代码里，如果某个switch分支概率很高，是否可以考虑代码层面帮CPU把判断提前，来提高代码执行效率呢？',
        link: '/blog/optimization-branch-prediction.md',
      },
    ]
  },
};
