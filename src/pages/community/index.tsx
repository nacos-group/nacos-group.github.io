import React from 'react';
import { translate } from '@docusaurus/Translate';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Bar, Footer, Slider } from '../../components';
import EventCard from './eventCard';
import ContactItem, { ContactData } from './contactItem';
import ContributorItem, { ContributorData } from './contributorItem';
import EcoItem, { EcoData } from './ecoItem';
import Layout from '@theme/Layout';

import './index.scss';
import { getLink } from '../../utils';

const data = {
    barText: translate({ id: 'community.barText', message: '社区' }),
    events: {
      title: translate({ id: 'community.eventsTitle', message: '事件 & 新闻' }),
      list: [        
      {
        img: 'https://img.alicdn.com/tfs/TB1qqkLKxnaK1RjSZFBXXcW7VXa-1830-982.png',
        title: '双十一献礼 | Nacos Star破两万的回顾与展望',
        dateStr: 'Nov 3, 2021',
        content: 'Nacos Github Star数突破两万，从18年开始开源受到大家的普遍关注，借此机会向大家回顾一下Nacos的发展和后续的规划，帮助大家更了解Nacos。',
        link: '/blog/up-to-2w-star.html',
      },
      {
        img: 'https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-develop/20210606/19a373eaefb44ec4d476a1dbbfce6489.jpg',
        title: 'Nacos 2.0.1 + 1.4.2 发布,业界率先支持MCP-OVER-XDS协议!',
        dateStr: 'May 10, 2021',
        content: 'Nacos 2.0.1 + 1.4.2 发布,在业界内，率先支持MCP-OVER-XDS协议，更好的践行控制平面和数据平面解耦的架构，在Mesh领域中会得到更大规模应用。',
        link: '/blog/2.0.1-release.html',
      },
      {
        img: 'https://img.alicdn.com/tfs/TB1i4ugBjDpK1RjSZFrXXa78VXa-1522-584.png',
        title: '虎牙直播在微服务改造方面的实践和总结',
        content: '文章整理自虎牙基础保障部中间件团队负责人张波（社区ID：zhangjimmy）在Dubbo Meetup 广州站沙龙上的分享，介绍虎牙在DNS、服务注册、CMDB和服务配置中心等方面的实践。',
        dateStr: 'Feb 10，2019',
        link: '/blog/huya-practice.html',
      },
      ],
    },
    contacts: {
      title: translate({ id: 'community.contactsTitle', message: '联系我们' }),
      desc: translate({ id: 'community.contactsDesc', message: '有问题需要反馈？可以优先通过钉钉群(1群已满，2群群号:30438813)联系我们，或者通过以下方式参与我们一起互动。' }),
      list: [
        {
          img: 'img/mailinglist.png',
          imgHover: '/img/mailinglist_hover.png',
          title: '邮件列表',
          link: 'mailto:nacos_dev@linux.alibaba.com'
        },
        {
          img: 'img/alibaba.png',
          imgHover: '/img/alibaba_hover.png',
          title: 'Gitter',
          link: 'https://gitter.im/alibaba/nacos',
        },
        {
          img: 'img/segmentfault.png',
          imgHover: '/img/segmentfault_hover.png',
          title: 'segmentfault',
          link: 'https://segmentfault.com/t/nacos'
        },
        {
          img: 'img/weibo.png',
          imgHover: '/img/weibo_hover.png',
          title: '@Nacos',
          link: 'https://weibo.com/u/6574374908',
        },
      ],
    },
    contributorGuide: {
      title: translate({ id: 'community.contributeTitle', message: '贡献指南' }),
      desc: translate({ id: 'community.contributeDesc', message: 'Nacos社区欢迎任何形式的贡献。' }),
      list: [
        {
          img: 'img/mailinglist.png',
          title: '邮件列表',
          content: <span>发送 <a href="mailto:nacos_dev@linux.alibaba.com">邮件列表 </a>参与讨论。</span>,
        },
        {
          img: 'img/issue.png',
          title: '报告缺陷',
          content: <span>通过<a href="https://github.com/alibaba/nacos/issues"> Github issues </a>报告缺陷。</span>,
        },
        {
          img: 'img/documents.png',
          title: '文档',
          content: <span>优化Nacos <a href="http://nacos.io/zh-cn/docs/what-is-nacos.html"> 文档</a>。</span>,
        },
        {
          img: 'img/pullrequest.png',
          title: 'Pull Request',
          content: <span>提交 <a href="https://github.com/alibaba/nacos/pulls"> Pull requests </a>来修复问题。</span>,
        },
      ],
    },
    ecos: {
      title: translate({ id: 'community.dubboTitle', message: '开源生态相关' }),
      // desc: translate({ id: 'community.dubboDesc', message: 'Nacos社区欢迎任何形式的贡献。' }),
      list: [
        {
          title: 'Dubbo and Dubbo Mesh',
          content: <span>Dubbo 及 Nacos是阿里巴巴大规模微服务生产实践中的经典组合，对比传统的如ZooKeeper等注册中心与配置中心解决方案，在使用云原生及Service Mesh范式构建微服务应用平台时，通过在Dubbo中使用Nacos，可以完全释放Dubbo在大规模微服务治理、流量管理、服务集成及共享上的所有威力。</span>,
          tags: [
            {
              text: 'Dubbo',
              link: 'http://dubbo.io/',
              bgColor: '#7A63FC',
            },
            {
              text: 'Dubbo Mesh',
              link: 'http://dubbo.io/',
              bgColor: '#00D0D9',
            },
          ]
        },
        {
          title: 'Kubernetes and CNCF',
          content: <span>Nacos 支持Kubernetes 以及 CNCF所需要的服务发现及动态配置管理的需求，Nacos可以完全无缝的替代Kubernetes的原生的DNS-based Service Discovery 解决方案，Nacos 提供了更多的服务治理侧的特性，这包括服务的域名管理，服务健康及生命周期管理，流量管理及智能路由策略管理等，Nacos也增强了对ConfigMap的管理，这包括版本配置、灰度发布等。</span>,
          tags: [
            {
              text: 'Kubernetes',
              link: 'https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/',
              bgColor: '#7A63FC',
            },
            {
              text: 'CNCF',
              link: 'https://www.cncf.io/',
              bgColor: '#00D0D9',
            },
          ]
        },
        {
          title: 'Spring Cloud',
          content: <span>Nacos 完全兼容和无缝支持 Spring Cloud的相关API及主要相关功能，你可以将Nacos作为SpringCloud Config Server的配置服务或者Eureka/Consul/ZooKeeper等的服务发现产品的更好替代者，Nacos 在配置管理和服务管理上带来了很多面向生产及微服务治理所需要的特性增强。</span>,
          tags: [
            {
              text: 'Spring Cloud',
              link: 'http://projects.spring.io/spring-cloud/',
              bgColor: '#7A63FC',
            },
            {
              text: 'Microservice',
              link: 'http://microservices.io/',
              bgColor: '#00D0D9',
            },
          ],
        },
      ],
    },
  };
  
  export default function Community(): JSX.Element {
  return (
      <BrowserOnly>
        {() => (
        <Layout title={'Nacos'} description="Nacos Community">
          <div className="community-page">
            <Bar img={getLink('img/community.png')} text={data.barText} />
            <section className="events-section">
              <div className='events-body'>
                <h3>{data.events.title}</h3>
                <Slider>
                  {data.events.list.map((event, i) => (
                    <EventCard event={event} key={i} />
                  ))}
                </Slider>
              </div>
            </section>
            <section className="eco-section">
              <h3>{data.ecos.title}</h3>
              <div className="eco-lists">
              {
                data.ecos.list.map((eco, i) => (
                  <EcoItem eco={eco} key={i} />
                ))
              }
              </div>
            </section>
            <section className="contact-section">
              <div className="contact-body">
                <h3>{data.contacts.title}</h3>
                <p>{data.contacts.desc}</p>
                <div className="contact-list">
                {
                  data.contacts.list.map((contact, i) => (
                    <ContactItem contact={contact} key={i} />
                  ))
                }
                </div>
              </div>
            </section>
            <section className="contributor-section">
              <div className="contributor-body">
                <h3>{data.contributorGuide.title}</h3>
                <p>{data.contributorGuide.desc}</p>
                <div className="contributor-list">
                {
                  data.contributorGuide.list.map((contributor, i) => (
                    <ContributorItem contributor={contributor} key={i} />
                  ))
                }
                </div>
              </div>
            </section>
            <Footer logo={getLink('img/nacos_gray.png')}/>
          </div>
        </Layout>
        )}
      </BrowserOnly>
    );
  }