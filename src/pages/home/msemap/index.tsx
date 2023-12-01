import React from 'react';
import { translate } from '@docusaurus/Translate';
import './index.scss';
import { Bone } from '../../../components';
import BrowserOnly from '@docusaurus/BrowserOnly';

const data = {
  title: translate({ id: 'homepage.msemapTitle', message: '微服务全景图' }),
};

const MseMap = () => {
  return (
    <BrowserOnly>
      {() => (
        <section className="msemap-section">
          <h3>{data.title}</h3>
          <Bone type="dark" />
          <div id="mse-arc-container"></div>
        </section>
      )}
    </BrowserOnly>
  );
};

export default MseMap;