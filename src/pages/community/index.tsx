import React from "react";
import { translate } from "@docusaurus/Translate";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { Bar, Footer, Slider } from "../../components";
import EventCard from "./eventCard";
import ContactItem, { ContactData } from "./contactItem";
import ContributorItem, { ContributorData } from "./contributorItem";
import EcoItem, { EcoData } from "./ecoItem";
import Layout from "@theme/Layout";

import "./index.scss";
import { getLink } from "../../utils";

const data = {
  barText: translate({ id: "community.barText", message: "社区" }),
  events: {
    title: translate({ id: "community.eventsTitle", message: "事件 & 新闻" }),
    list: [
      {
        img: "https://img.alicdn.com/tfs/TB1qqkLKxnaK1RjSZFBXXcW7VXa-1830-982.png",
        title: "双十一献礼 | Nacos Star破两万的回顾与展望",
        dateStr: "Nov 3, 2021",
        content:
          "Nacos Github Star数突破两万，从18年开始开源受到大家的普遍关注，借此机会向大家回顾一下Nacos的发展和后续的规划，帮助大家更了解Nacos。",
        link: "/blog/up-to-2w-star.html",
      },
      {
        img: "https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-develop/20210606/19a373eaefb44ec4d476a1dbbfce6489.jpg",
        title: "Nacos 2.0.1 + 1.4.2 发布,业界率先支持MCP-OVER-XDS协议!",
        dateStr: "May 10, 2021",
        content:
          "Nacos 2.0.1 + 1.4.2 发布,在业界内，率先支持MCP-OVER-XDS协议，更好的践行控制平面和数据平面解耦的架构，在Mesh领域中会得到更大规模应用。",
        link: "/blog/2.0.1-release.html",
      },
      {
        img: "https://img.alicdn.com/tfs/TB1i4ugBjDpK1RjSZFrXXa78VXa-1522-584.png",
        title: "虎牙直播在微服务改造方面的实践和总结",
        content:
          "文章整理自虎牙基础保障部中间件团队负责人张波（社区ID：zhangjimmy）在Dubbo Meetup 广州站沙龙上的分享，介绍虎牙在DNS、服务注册、CMDB和服务配置中心等方面的实践。",
        dateStr: "Feb 10，2019",
        link: "/blog/huya-practice.html",
      },
    ],
  },
  contacts: {
    title: translate({ id: "community.contactsTitle", message: "联系我们" }),
    desc: translate({
      id: "community.contactsDesc",
      message:
        "有问题需要反馈？可以优先通过钉钉群(1群已满，2群群号:30438813)联系我们，或者通过以下方式参与我们一起互动。",
    }),
    list: [
      {
        img: "https://img.alicdn.com/imgextra/i3/O1CN018jYPjh1EwZeZ0x4Ir_!!6000000000416-2-tps-160-160.png",
        imgHover:
          "https://img.alicdn.com/imgextra/i4/O1CN017jnUKf1MHMwlRqS5W_!!6000000001409-2-tps-160-160.png",
        title: translate({ id: 'community.contactsListTitle1', message: '邮件列表' }),
        link: "mailto:nacos_dev@linux.alibaba.com",
      },
      {
        img: "https://img.alicdn.com/imgextra/i1/O1CN010WA9R91tvZ1fQNaQt_!!6000000005964-2-tps-172-172.png",
        imgHover:
          "https://img.alicdn.com/imgextra/i1/O1CN01ZJTRpF21zhWvsfrOx_!!6000000007056-2-tps-172-172.png",
        title: translate({ id: 'community.contactsListTitle2', message: 'Gitter' }),
        link: "https://gitter.im/alibaba/nacos",
      },
      {
        img: "https://img.alicdn.com/imgextra/i3/O1CN01dMENDd1PMM6bEAWOM_!!6000000001826-2-tps-304-88.png",
        imgHover:
          "https://img.alicdn.com/imgextra/i3/O1CN01vhGiH71h5YfChGR07_!!6000000004226-2-tps-304-88.png",
        title: translate({ id: 'community.contactsListTitle3', message: 'segmentfault' }),
        link: "https://segmentfault.com/t/nacos",
      },
      {
        img: "https://img.alicdn.com/imgextra/i2/O1CN01u1oA5a1eWdEBcbsul_!!6000000003879-2-tps-164-172.png",
        imgHover:
          "https://img.alicdn.com/imgextra/i1/O1CN01eE6zkk1f96UzJlXtN_!!6000000003963-2-tps-164-172.png",
        title: translate({ id: 'community.contactsListTitle4', message: '@Nacos' }),
        link: "https://weibo.com/u/6574374908",
      },
    ],
  },
  contributorGuide: {
    title: translate({ id: "community.contributeTitle", message: "贡献指南" }),
    desc: translate({ id: "community.contributeDesc", message: "Nacos社区欢迎任何形式的贡献。" }),
    list: [
      {
        img: "https://img.alicdn.com/imgextra/i3/O1CN018jYPjh1EwZeZ0x4Ir_!!6000000000416-2-tps-160-160.png",
        title: translate({ id: 'community.contributeListTitle1', message: '邮件列表' }),
        content: (
          <span>
            <a href="mailto:nacos_dev@linux.alibaba.com" target="_blank">
              {translate({ id: 'community.contributeListContent1', message: '邮件列表' })}
            </a>
          </span>
        ),
      },
      {
        img: "https://img.alicdn.com/imgextra/i3/O1CN01HZvKBp1IWFLd5xG19_!!6000000000900-2-tps-160-160.png",
        title: translate({ id: 'community.contributeListTitle2', message: '报告缺陷' }),
        content: (
          <span>
            {translate({ id: 'community.contributeListContent2_1', message: '通过' })}
            <a href="https://github.com/alibaba/nacos/issues" target="_blank">Github issues </a>
            {translate({ id: 'community.contributeListContent2_2', message: '报告缺陷。' })}
          </span>
        ),
      },
      {
        img: "https://img.alicdn.com/imgextra/i4/O1CN01bYb6VG1JUhd9wqL83_!!6000000001032-2-tps-160-160.png",
        title: translate({ id: 'community.contributeListTitle3', message: '文档' }),
        content: (
          <span>
            {translate({ id: 'community.contributeListContent3_1', message: '优化 Nacos' })}&nbsp;
            <a href="http://nacos.io/zh-cn/docs/what-is-nacos.html" target="_blank">
              {translate({ id: 'community.contributeListContent3_2', message: '文档' })}
            </a>
          </span>
        ),
      },
      {
        img: "https://img.alicdn.com/imgextra/i3/O1CN01wewhuB23ZFtOpVoZ1_!!6000000007269-2-tps-160-160.png",
        title: translate({ id: 'community.contributeListTitle4', message: 'Pull Request' }),
        content: (
          <span>
            {translate({ id: 'community.contributeListContent2_1', message: '提交' })}
            <a href="https://github.com/alibaba/nacos/pulls" target="_blank">Pull requests </a>
            {translate({ id: 'community.contributeListContent2_2', message: '来修复问题。' })}
          </span>
        ),
      },
    ],
  },
  ecos: {
    title: translate({ id: "community.dubboTitle", message: "开源生态相关" }),
    list: [
      {
        title: "Dubbo and Dubbo Mesh",
        content: (
          <span>
            {translate({ id: 'community.ecosListContent1', message: 'Dubbo 及Nacos是阿里巴巴大规模微服务生产实践中的经典组合，对比传统的如ZooKeeper等注册中心与配置中心解决方案，在使用云原生及ServiceMesh范式构建微服务应用平台时，通过在Dubbo中使用Nacos，可以完全释放Dubbo在大规模微服务治理、流量管理、服务集成及共享上的所有威力。' })}
          </span>
        ),
        tags: [
          {
            text: "Dubbo",
            link: "http://dubbo.io/",
            bgColor: "#7A63FC",
          },
          {
            text: "Dubbo Mesh",
            link: "http://dubbo.io/",
            bgColor: "#00D0D9",
          },
        ],
      },
      {
        title: "Kubernetes and CNCF",
        content: (
          <span>
            {translate({ id: 'community.ecosListContent2', message: 'Nacos 支持Kubernetes 以及CNCF所需要的服务发现及动态配置管理的需求，Nacos可以完全无缝的替代Kubernetes的原生的DNS-basedService Discovery 解决方案，Nacos提供了更多的服务治理侧的特性，这包括服务的域名管理，服务健康及生命周期管理，流量管理及智能路由策略管理等，Nacos也增强了对ConfigMap的管理，这包括版本配置、灰度发布等。'})}
          </span>
        ),
        tags: [
          {
            text: "Kubernetes",
            link: "https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/",
            bgColor: "#7A63FC",
          },
          {
            text: "CNCF",
            link: "https://www.cncf.io/",
            bgColor: "#00D0D9",
          },
        ],
      },
      {
        title: "Spring Cloud",
        content: (
          <span>
            {translate({ id: 'community.ecosListContent3', message: 'Nacos 完全兼容和无缝支持 Spring Cloud的相关API及主要相关功能，你可以将Nacos作为SpringCloud ConfigServer的配置服务或者Eureka/Consul/ZooKeeper等的服务发现产品的更好替代者，Nacos在配置管理和服务管理上带来了很多面向生产及微服务治理所需要的特性增强。'})}
          </span>
        ),
        tags: [
          {
            text: "Spring Cloud",
            link: "http://projects.spring.io/spring-cloud/",
            bgColor: "#7A63FC",
          },
          {
            text: "Microservice",
            link: "http://microservices.io/",
            bgColor: "#00D0D9",
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
        <Layout title={"Nacos"} description="Nacos Community">
          <div className="community-page">
            <Bar
              img={getLink(
                "https://img.alicdn.com/imgextra/i1/O1CN01Uhz05Y1cdNpuG58yE_!!6000000003623-2-tps-160-160.png"
              )}
              text={data.barText}
            />
            <section className="events-section">
              <div className="events-body">
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
                {data.ecos.list.map((eco, i) => (
                  <EcoItem eco={eco} key={i} />
                ))}
              </div>
            </section>
            <section className="contact-section">
              <div className="contact-body">
                <h3>{data.contacts.title}</h3>
                <p>{data.contacts.desc}</p>
                <div className="contact-list">
                  {data.contacts.list.map((contact, i) => (
                    <ContactItem contact={contact} key={i} />
                  ))}
                </div>
              </div>
            </section>
            <section className="contributor-section">
              <div className="contributor-body">
                <h3>{data.contributorGuide.title}</h3>
                <p>{data.contributorGuide.desc}</p>
                <div className="contributor-list">
                  {data.contributorGuide.list.map((contributor, i) => (
                    <ContributorItem contributor={contributor} key={i} />
                  ))}
                </div>
              </div>
            </section>
            <Footer
              logo={getLink(
                "https://img.alicdn.com/imgextra/i3/O1CN01rPQVls1KsLgvPZ6tf_!!6000000001219-2-tps-204-40.png"
              )}
            />
          </div>
        </Layout>
      )}
    </BrowserOnly>
  );
}
