import React from 'react';
import { translate } from '@docusaurus/Translate';
import { Button, ButtonType } from '../../components';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { getLink } from '../../utils'

// import './index.scss';
// import '../../tailwind.css'

const topData = {
  brandName: 'Nacos',
  title: '谁在使用Nacos',
  userList: [
    {
      title: 'Soul',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01INuvZ91MkDp3A3PgC_!!6000000001472-2-tps-160-130.png',
      description:'我们通过 MSE 云原生网关，将流量、安全、微服务网关三合一，大幅降低请求链路条数、降低架构复杂度、运维和故障排查成本，例如降低整个链路 RT 峰值从500ms下降至峰值50ms，服务发布期间502降为0，499平均降低10%等。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
    {
      title: '来电科技',
      imgUrl: 'https://img.alicdn.com/imgextra/i1/O1CN01tHBkdK1Jr8xSoM5k3_!!6000000001081-2-tps-160-130.png',
      description:'MSE 微服务治理以无侵入的方式提供了全链路灰度、离群实例摘除、微服务治理流量可观测等核心能力，以更经济的方式、更高效的路径帮助来电科技在云上快速构建起完整微服务治理体系，有效提升线上稳定性，保证服务 99.95% 的可用性。'
    },
  ]
};

const Top = ({ language }: { language?: string }) => {

  return (
    <BrowserOnly>
      {() => (
        <section
          className='bg-blue-100'
        >
          <div >
            <p className='pt-16 text-center text-4xl' style={{color:'rgba(65,144,255,1)'}}>
              {topData.title}
            </p>
          </div>
          <div className="flex content-start flex-wrap ">
            {
              topData.userList.map((item) => {
                return <div className="box-border flex-[0_0_33%] h-48 mb-8">
                <div className="flex w-11/12 m-4 h-full text-center justify-center items-center bg-white">
                  <div className="h-full flex items-center">
                    <div className="inline-block w-3/12 h-full ml-2">
                      <img src={item.imgUrl} className="w-20 h-20" />
                    </div>
                    <div className="inline-block  w-8/12 h-full text-left">
                      <p className="text-lg font-medium mt-4">{item.title}</p>
                      <span className='inline-block text-xs pt-4 leading-5'>{item.description}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              })
            }
          </div>

        </section>
      )}
    </BrowserOnly>
  );
};

export default Top;