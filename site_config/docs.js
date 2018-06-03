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
  'zh-cn': {
    sidemenu: [
      {
        title: '用户文档',
        children: [
          {
            title: '入门',
            children: [
              {
                title: '背景',
                link: '/docs/maturity.md',
              },
              {
                title: '需求',
                link: '/docs/preface/requirements.md',
              },
              {
                title: '架构',
                link: '/docs/preface/architecture.md'
              },
              {
                title: '用法',
                link: '/docs/preface/usage.md'
              }
            ],
          },
          {
            title: '快速启动',
            link: '/docs/quick-start.md'
          },
          {
            title: '依赖',
            link: '/docs/dependencies.md'
          },
          {
            title: '成熟度',
            link: '/docs/maturity.md'
          },
          {
            title: '配置',
            children: [
              {
                title: 'XML配置',
                link: '/docs/configuration/xml.md',
              },
              {
                title: '属性配置',
                link: '/docs/configuration/properties.md',
              },
              {
                title: 'API配置',
                link: '/docs/configuration/api.md'
              },
              {
                title: '注解配置',
                link: '/docs/configuration/annotation.md'
              }
            ],
          },
          {
            title: '示例',
            children: [
              {
                title: '启动时检查',
                link: '/docs/demos/preflight-check.md',
              },
              {
                title: '集群容错',
                link: '/docs/demos/fault-tolerent-strategy.md',
              },
              {
                title: '负载均衡',
                link: '/docs/demos/loadbalance.md'
              },
              {
                title: '线程模型',
                link: '/docs/demos/thread-model.md'
              },
              {
                title: '直连提供者',
                link: '/docs/demos/explicit-target.md',
              },
              {
                title: '只订阅',
                link: '/docs/demos/subscribe-only.md',
              },
              {
                title: '只注册',
                link: '/docs/demos/registry-only.md'
              },
              {
                title: '静态服务',
                link: '/docs/demos/static-service.md'
              },
              {
                title: '多协议',
                link: '/docs/demos/multi-protocols.md',
              },
              {
                title: '多注册中心',
                link: '/docs/demos/multi-registry.md',
              },
              {
                title: '服务分组',
                link: '/docs/demos/service-group.md'
              },
              {
                title: '多版本',
                link: '/docs/demos/multi-versions.md'
              },
              {
                title: '分组聚合',
                link: '/docs/demos/group-merger.md',
              },
              {
                title: '参数验证',
                link: '/docs/demos/parameter-validation.md',
              },
              {
                title: '结果缓存',
                link: '/docs/demos/result-cache.md'
              },
              {
                title: '泛化引用',
                link: '/docs/demos/generic-reference.md'
              },
              {
                title: '泛化实现',
                link: '/docs/demos/generic-service.md',
              },
              {
                title: '回声测试',
                link: '/docs/demos/echo-service.md',
              },
              {
                title: '上下文信息',
                link: '/docs/demos/context.md'
              },
              {
                title: '隐式参数',
                link: '/docs/demos/attachment.md'
              },
              {
                title: '异步调用',
                link: '/docs/demos/async-call.md',
              },
              {
                title: '本地调用',
                link: '/docs/demos/local-call.md',
              },
              {
                title: '参数回调',
                link: '/docs/demos/callback-parameter.md'
              },
              {
                title: '事件通知',
                link: '/docs/demos/events-notify.md'
              },
              {
                title: '本地存根',
                link: '/docs/demos/local-stub.md',
              },
              {
                title: '本地伪装',
                link: '/docs/demos/local-mock.md',
              },
              {
                title: '延迟暴露',
                link: '/docs/demos/delay-publish.md'
              },
              {
                title: '并发控制',
                link: '/docs/demos/concurrency-control.md'
              },
              {
                title: '连接控制',
                link: '/docs/demos/config-connections.md',
              },
              {
                title: '延迟连接',
                link: '/docs/demos/lazy-connect.md',
              },
              {
                title: '粘滞连接',
                link: '/docs/demos/stickiness.md'
              },
              {
                title: '令牌验证',
                link: '/docs/demos/token-authorization.md'
              },
              {
                title: '路由规则',
                link: '/docs/demos/routing-rule.md',
              },
              {
                title: '配置规则',
                link: '/docs/demos/config-rule.md',
              },
              {
                title: '服务降级',
                link: '/docs/demos/service-downgrade.md'
              },
              {
                title: '优雅停机',
                link: '/docs/demos/graceful-shutdown.md'
              },
              {
                title: '主机绑定',
                link: '/docs/demos/hostname-binding.md',
              },
              {
                title: '日志适配',
                link: '/docs/demos/logger-strategy.md',
              },
              {
                title: '访问日志',
                link: '/docs/demos/accesslog.md'
              },
              {
                title: '服务容器',
                link: '/docs/demos/service-container.md'
              },
              {
                title: 'Reference Config 缓存',
                link: '/docs/demos/reference-config-cache.md',
              },
              {
                title: '分布式事务',
                link: '/docs/demos/distributed-transaction.md',
              },
              {
                title: '线程栈自动dump',
                link: '/docs/demos/dump.md'
              },
              {
                title: 'Netty4',
                link: '/docs/demos/netty4.md'
              },
              {
                title: 'Kryo和FST序列化',
                link: '/docs/demos/serialization.md',
              },
            ],
          },
        ],
      },
      {
        title: '管理员文档',
        children: [
          {
            title: '标题4',
            link: '/docs/demo5.md',
          },
          {
            title: '标题5',
            children: [
              {
                title: '子标题5-1',
                link: '/docs/demo6.md',
              },
              {
                title: '子标题5-2',
                link: '/docs/demo7.md',
              }
            ],
          }
        ],
      }
    ],
    barText: '文档',
  }
};
