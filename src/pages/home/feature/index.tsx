import React from 'react';
import { translate } from '@docusaurus/Translate';
import { Bone, Icon } from '../../../components';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { getLink } from '../../../utils';
import './index.scss';

const data = {
  list: [
    {
      icon: 'img/feature_easy_to_use.png',
      title: translate({ id: 'homepage.featureListTitle1', message: '易于使用' }),
      content: [
        translate({
          id: 'homepage.featureListContent1',
          message:
            '动态配置管理、服务发现和动态的一站式解决方案;20多种开箱即用的以服务为中心的架构特性;基本符合生产要求的轻量级易用控制台。',
        }),
      ],
    },
    {
      icon: 'img/feature_adaptable.png',
      title: translate({ id: 'homepage.featureListTitle2', message: '更适应云架构' }),
      content: [
        translate({
          id: 'homepage.featureListContent2',
          message: '无缝支持Kubernetes和Spring Cloud;在主流公共云上更容易部署和运行（例如阿里云和AWS）;多租户和多环境支持。',
        }),
      ],
    },
    {
      icon: 'img/feature_production_grade.png',
      title: translate({ id: 'homepage.featureListTitle3', message: '生产等级' }),
      content: translate({
        id: 'homepage.featureListContent3',
        message:
          '脱胎于历经阿里巴巴10年生产验证的内部产品;支持具有数百万服务的大规模场景;具备企业级SLA的开源产品。',
      }),
    },
    {
      icon: 'img/feature_rich.png',
      title: translate({ id: 'homepage.featureListTitle4', message: '丰富的应用场景' }),
      content: translate({
        id: 'homepage.featureListContent4',
        message: '支持限流、大促销预案和异地多活;直接支持或稍作扩展即可支持大量有用的互联网应用场景;流量调度和服务治理。',
      }),
    },
  ],
  title: translate({ id: 'homepage.featureTitle', message: '特色功能' }),
};

const Feature = () => {
  return (
    <BrowserOnly>
      {() => (
        <section className="feature-section">
          <div className="feature-section-body">
            <h3>{data.title}</h3>
            <Bone type="light" />
            <ul className='feature-list'>
              {data.list.map((feature, i) => (
                <Item feature={feature} key={i} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </BrowserOnly>
  );
};

const Item = (props) => {
  const { feature } = props;
  return (
    <BrowserOnly>
      {() => (
        <li className="feature-list-item">
        <img src={getLink(feature.icon)} />
        <div>
          <h4>{feature.title}</h4>
          <ul>
          {/* {feature.content.map((c, i) => <li key={i}>{c}</li>)} */}
          {feature.content}
          </ul>
        </div>
      </li>
      )}
    </BrowserOnly>
  );
};

export default Feature;