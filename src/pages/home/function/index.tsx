import React from 'react';
import { translate } from '@docusaurus/Translate';
import { Bone, Icon } from '../../../components';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { getLink } from '../../../utils';
import './index.scss';

const data = {
  list: [
    {
      icon: '/img/dynamic_configuration.png',
      title: translate({ id: 'homepage.functionListTitle1', message: '动态配置服务' }),
      content: [
        translate({
          id: 'homepage.functionListContent1',
          message:
            '动态配置服务让您能够以中心化、外部化和动态化的方式管理所有环境的配置。动态配置消除了配置变更时重新部署应用和服务的需要。配置中心化管理让实现无状态服务更简单，也让按需弹性扩展服务更容易。',
        }),
      ],
    },
    {
      icon: '/img/service_discovery.png',
      title: translate({ id: 'homepage.functionListTitle2', message: '服务发现及管理' }),
      content: [
        translate({
          id: 'homepage.functionListContent2',
          message: '动态服务发现对以服务为中心的（例如微服务和云原生）应用架构方式非常关键。Nacos支持DNS-Based和RPC-Based（Dubbo、gRPC）模式的服务发现。Nacos也提供实时健康检查，以防止将请求发往不健康的主机或服务实例。借助Nacos，您可以更容易地为您的服务实现断路器。',
        }),
      ],
    },
    {
      icon: '/img/dynamic_DNS.png',
      title: translate({ id: 'homepage.functionListTitle3', message: '动态DNS服务' }),
      content: translate({
        id: 'homepage.functionListContent3',
        message:
          '通过支持权重路由，动态DNS服务能让您轻松实现中间层负载均衡、更灵活的路由策略、流量控制以及简单数据中心内网的简单DNS解析服务。动态DNS服务还能让您更容易地实现以DNS协议为基础的服务发现，以消除耦合到厂商私有服务发现API上的风险。',
      }),
    },
  ],
  title: translate({ id: 'homepage.functionTitle', message: '功能' }),
};

const Function = () => {
  return (
    <BrowserOnly>
      {() => (
        <section className="function-section">
            <h3>{data.title}</h3>
            <Bone type="dark" />
            <div>
            {data.list.map((func, i) => (
                <Item func={func} key={i} />
              ))}
            </div>
              
        </section>
      )}
    </BrowserOnly>
  );
};

const Item = (props) => {
  const { func, imgFirst } = props;
  if(imgFirst){
    return (
      <BrowserOnly>
        {() => (
          <div className="func-item">
            <div className="col img">
              <img src={getLink(func.img)} />
            </div>
            <div className="col">
              <div className="vertical-middle">
                <h4>{func.title}</h4>
                <p>{func.content}</p>
              </div>
            </div>
          </div>
        )}
      </BrowserOnly>
    );
  }
  return (
    <BrowserOnly>
      {() => (
        <div className="func-item">
          <div className="col">
            <div className="vertical-middle">
              <h4>{func.title}</h4>
              <p>{func.content}</p>
            </div>
          </div>
          <div className="col img">
            <img src={getLink(func.img)} />
          </div>
        </div>
      )}
    </BrowserOnly>
  );
};

export default Function;