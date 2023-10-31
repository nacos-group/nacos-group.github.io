import React from "react";
import { translate } from "@docusaurus/Translate";
import { Button, ButtonType } from "../../components";

import BrowserOnly from "@docusaurus/BrowserOnly";
import { getLink } from "../../utils";

// import './index.scss';
// import '../../tailwind.css'

const topData = {
  brandName: "Nacos",
  title: "谁在使用Nacos Cloud",
  userList: [
    {
      title: "Soul",
      imgUrl: "https://img.alicdn.com/imgextra/i1/O1CN01INuvZ91MkDp3A3PgC_!!6000000001472-2-tps-160-130.png",
      description:
        "我们通过 MSE 云原生网关，将流量、安全、微服务网关三合一，大幅降低请求链路条数、降低架构复杂度、运维和故障排查成本，例如降低整个链路 RT 峰值从500ms下降至峰值50ms，服务发布期间502降为0，499平均降低10%等。",
    },
    {
      title: "来电科技",
      imgUrl: "https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png",
      description:
        "MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。",
    },
    {
      title: "极氪汽车",
      imgUrl: "https://img.alicdn.com/imgextra/i3/O1CN01tDMkkN1amsk54SPnX_!!6000000003373-0-tps-160-130.jpg",
      description:
        "MSE 云原生网关帮我们降低 50%资源成本，同时缩短了请求时间，降低运维复杂度；微服务治理中的全链路灰度方案实现“流量泳道”，做到快速拉起隔离的开发环境，在提升研发效率的同时节省了一笔不菲的成本开销。",
    },
    {
      title: "云快充",
      imgUrl: "https://img.alicdn.com/imgextra/i2/O1CN01Mzl4VB1Ws8pUrwH0z_!!6000000002843-0-tps-160-130.jpg",
      description:
        "于 MSE 全链路灰度，我们得到的收益是很明显的，因应用变更导致的生产事故降低了70%以上，云快充接入的电桩数量完成了20万到30万的增长过程中，平均需求迭代周期从7人日降低到4人日，极大地促进了业务的快速迭代。",
    },
    {
      title: "波司登",
      imgUrl: "https://img.alicdn.com/imgextra/i2/O1CN01i6SiyH1UNKxHduaQX_!!6000000002505-0-tps-160-130.jpg",
      description:
        "我们基于 ACK + MSE + ARMS + Prometheus 支撑了在线业务百万级并发大流量，并帮助业务迭代效率提升2倍，因应用变更导致的生产事故也降低了70%。",
    },
    {
      title: "斯凯奇",
      imgUrl: "https://img.alicdn.com/imgextra/i2/O1CN01UI125w1wj93QttPIH_!!6000000006343-2-tps-160-130.png",
      description:
        "相比自建 API 网关，MSE 云原生网关为我们提供了统一的微服务路由、流控、安全管理等能力，方便内外部多系统间的集成，在开发运维效率、性能、安全性上表现更加优异。",
    },
    {
      title: "费芮互动",
      imgUrl: "https://img.alicdn.com/imgextra/i1/O1CN01hVqd3K1brkZ3yNd2E_!!6000000003519-2-tps-160-130.png",
      description:
        "我们通过 MSE 云原生网关构建了零信任架构，无需重配 Nginx Ingress 规则即可平滑迁移，性能提升 90%，响应时间下降 50% ，并大幅提升业务入口的稳定及安全性，高效支撑每日 1 亿+粉丝交互， 4 万+线下门店、每月 3000 万+笔的移动支付需求。",
    },
    // {
    //   title: "星火保",
    //   imgUrl: "https://img.alicdn.com/imgextra/i4/O1CN01tis0HR1xz0NxdjpaH_!!6000000006513-2-tps-160-130.png",
    //   description:
    //     "在技术方向上，我们倾向云原生的技术架构演进方向，将基于 ECS 自建的 Zookeeper 集群替换为了 MSE-Nacos，实现微服务之间的服务发现和注册中心，尽量降低团队对基础设施运维的负担。",
    // },
    {
      title: "致景科技",
      imgUrl: "https://img.alicdn.com/imgextra/i1/O1CN01CofhSr1sqh6P9CuXl_!!6000000005818-2-tps-544-180.png",
      description:
        "我们未修改任何代码就接入了 MSE 的微服务治理所有能力。基于开发环境隔离能力，测试环境的构建时间由天计算降低到分钟级别，微服务的实施周期缩短了 30%，加速构建纺织服装纵向一体化的数智化综合服务平台。",
    },
    {
      title: "禾连健康",
      imgUrl: "https://img.alicdn.com/imgextra/i2/O1CN01NBuTFc1iK2gpy6k8f_!!6000000004393-2-tps-544-180.png",
      description:
        "相比于自建， MSE 注册配置中心帮助我们实现了性能提升达 50%，解决了业务高速发展中的扩展性问题，保障全国 200 多个城市、2000 多家医院体验业务的稳定性超 99.99%。",
    },
  ],
};

const Top = ({ language }: { language?: string }) => {
  return (
    <BrowserOnly>
      {() => (
        <section className="bg-blue-100">
          <div>
            <p className="pt-16 pb-16 text-center text-4xl text-[#4190FF] font-semibold">{topData.title}</p>
          </div>
          <div className="flex content-start flex-wrap pb-16">
            {topData.userList.map((item) => {
              return (
                <div className="box-border flex-[0_0_33%] h-48 mb-8">
                  <div className="flex w-11/12 m-4 h-full text-center justify-center items-center bg-white p-3 rounded-[6px]">
                    <div className="h-full flex items-center">
                      <div className="inline-block w-4/12 h-full ml-2">
                        <img src={item.imgUrl} className="w-20" />
                      </div>
                      <div className="inline-block w-8/12 h-full text-left">
                        <p className="text-lg font-medium">{item.title}</p>
                        <span className="inline-block text-xs pt-2 leading-5">{item.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </BrowserOnly>
  );
};

export default Top;
