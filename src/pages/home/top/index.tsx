import React from 'react';
import { translate } from '@docusaurus/Translate';
import { Button, ButtonType } from '../../../components';
import { getLink } from '../../../utils';

import BrowserOnly from '@docusaurus/BrowserOnly';

import './index.scss';
// import '../../tailwind.css'

const topData = {
  brandName: 'Nacos',
  briefIntroduction: translate({
    id: 'homepage.briefIntroduction',
    message:
      '一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。',
  }),
  buttons: [
    {
      text: '前往 Github',
      link: 'https://github.com/alibaba/nacos',
      type: 'primary',
      target: '_blank',
    },
    {
      text: '手册',
      link: '/docs/v2/what-is-nacos.html',
      type: 'normal',
    },
  ],
  versionNote: {
    text: 'V2.2.3 版本说明',
    link: 'https://github.com/alibaba/nacos/releases/tag/2.2.3',
  },
  versionNote2: {
    text: 'V1.4.6',
    link: 'https://github.com/alibaba/nacos/releases/tag/1.4.6',
  },
  releaseDate: {
    text: '2023年5月25日发布',
  },
};

const Top = ({ language }: { language?: string }) => {
  const [state, setState] = React.useState({
    starCount: '',
    forkCount: '',
  });

  const { starCount, forkCount } = state;

  React.useEffect(() => {
    fetch('https://api.github.com/repos/alibaba/nacos')
      .then((res) => res.json())
      .then((data) => {
        setState({
          starCount: `${data.stargazers_count}`,
          forkCount: `${data.forks_count}`,
        });
      });
  }, []);
  return (
    <BrowserOnly>
      {() => (
        <section
        className="top-section"
        style={{
          background: `url(${getLink("img/black_dot.png")}) repeat`,
          backgroundSize: "14px 14px",
        }}
        >
          1111111111
        <div className="vertical-middle">
            <img className="product-logo" src={getLink("img/nacos.png")} />
            <template>
          <div className="w-32 h-32 bg-blue-500">
            testtesttest
      </div>
    </template>
          <p className="product-desc">
            {topData.briefIntroduction}
          </p>
          <div className="button-area">
            {topData.buttons.map((b) => (
              <Button type={b.type} key={b.type} link={b.link} target={b.target} language={language}>
                {b.text}
              </Button>
            ))}
          </div>
          <div className="github-buttons">
            <a
              href="https://github.com/alibaba/nacos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="star">
                <img src="https://img.alicdn.com/tfs/TB1FlB1JwHqK1RjSZFPXXcwapXa-32-32.png" />
                <span className="count">{starCount}</span>
              </div>
            </a>
            <a
              href="https://github.com/alibaba/nacos/fork"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="fork">
                <img src="https://img.alicdn.com/tfs/TB1zbxSJwDqK1RjSZSyXXaxEVXa-32-32.png" />
                <span className="count">{forkCount}</span>
              </div>
            </a>
          </div>
          <div className="version-note">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={getLink(topData.versionNote.link)}
            >
              {topData.versionNote.text}
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={getLink(topData.versionNote2.link)}
            >
              {topData.versionNote2.text}
            </a>
          </div>
          <div className="release-date">
            {topData.releaseDate.text}
          </div>
        </div>
        <div className="animation animation1" />
        <div className="animation animation2" />
        <div className="animation animation3" />
        <div className="animation animation4" />
        <div className="animation animation5" />
      </section>
      )}
    </BrowserOnly>
  );
};

export default Top;