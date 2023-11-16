import React from 'react';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import './index.scss';
import { getLink } from '../../utils';

const data = {
  vision: {
    title: translate({ id: 'homepage.footerVersionTitle', message: '愿景' }),
    content: translate({ id: 'homepage.footerVersionContent', message: 'Nacos 通过提供简单易用的动态服务发现、服务配置、服务共享与管理等服务基础设施，帮助用户在云原生时代，在私有云、混合云或者公有云等所有云环境中，更好的构建、交付、管理自己的微服务平台，更快的复用和组合业务服务，更快的交付商业创新的价值，从而为用户赢得市场。' }),
  },
  documentation: {
    title: translate({ id: 'homepage.footerDocTitle', message: '文档' }),
    list: [
      {
        text: translate({ id: 'homepage.footerDocListText1', message: '概览' }),
        link: '/docs/what-is-nacos',
        target: '',
      },
      {
        text: translate({ id: 'homepage.footerDocListText2', message: '快速开始' }),
        link: '/docs/quick-start',
        target: '',
      },
      {
        text: translate({ id: 'homepage.footerDocListText3', message: '开发者指南' }),
        link: '/docs/contributing',
        target: '',
      },
    ],
  },
  resources: {
    title: translate({ id: 'homepage.footerResourcesTitle', message: '资源' }),
    list: [
      {
        text: translate({ id: 'homepage.footerResourcesListText1', message: '社区' }),
        link: '/community',
        target: '',
      },
      {
        text: translate({ id: 'homepage.footerResourcesListText2', message: '云服务 MSE' }),
        link: '//cn.aliyun.com/product/aliware/mse?spm=nacos-website.topbar.0.0.0',
        target: "_blank",
      },
      {
        text: translate({ id: 'homepage.footerResourcesListText3', message: '云服务 EDAS' }),
        link: '//www.aliyun.com/product/edas?source_type=nacos_pc_20181219',
        target: "_blank",
      },
    ],
  },
  copyright: `Copyright © ${new Date().getFullYear()} Nacos`,
};

type Props = {
  logo: string;
};

const Footer = (props: Props) => {
  const { logo } = props;
  const { i18n } = useDocusaurusContext();
  const curLang = i18n.currentLocale;

  return (
    <footer className="footer-container">
        <div className="footer-body">
          <img src={props.logo} />
          <div className="cols-container">
            <div className="col col-12">
              <h3>{data.vision.title}</h3>
              <p>{data.vision.content}</p>
            </div>
            <div className="col col-6">
              <dl>
                <dt>{data.documentation.title}</dt>
                {
                  data.documentation.list.map((d, i) => (
                    <dd key={i}><a href={`/${curLang}${d.link}`} target={d.target || "_self"}>
                    {d.text}
                  </a></dd>
                  ))
                }
              </dl>
            </div>
            <div className="col col-6">
            <dl>
            <dt>{data.resources.title}</dt>
            {
              data.resources.list.map((d, i) => (
                <dd key={i}><a href={`/${curLang}${d.link}`} target={d.target || "_self"}>
                {d.text}
              </a></dd>
              ))
            }
            </dl>
            </div>
          </div>
          <div className="copyright"><span>{data.copyright}</span></div>
        </div>
      </footer>
  );
};

export default Footer;
