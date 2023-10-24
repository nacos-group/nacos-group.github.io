import React from 'react';
import { translate } from '@docusaurus/Translate';
import { Button, ButtonType } from '../../components';

import BrowserOnly from '@docusaurus/BrowserOnly';
import { getLink } from '../../utils'

// import './index.scss';
// import '../../tailwind.css'

const topData = {
  brandName: 'Nacos',
  title: 'NACOS订阅计划',
};

const Top = ({ language }: { language?: string }) => {

  return (
    <BrowserOnly>
      {() => (
        <section
          className="bg-gradient-to-b from-white to-blue-400"
        >
          <div className='mb-8'>
            <p className='pt-16 text-center text-4xl' style={{color:'rgba(65,144,255,1)'}}>
              {topData.title}
            </p>
          </div>
          <div className="flex justify-center flex-wrap ">
            <div className="bg-gray-200 flex w-80 h-96 mr-4 mb-4">01</div>
            <div className="bg-gray-200 flex w-80 h-96 mr-4 mb-4">02</div>
            <div className="bg-gray-200 flex w-80 h-96 mr-4 mb-4">03</div>
            <div className="bg-gray-200 flex w-80 h-96 mr-4 mb-4">04</div>
          </div>
        </section>
      )}
    </BrowserOnly>
  );
};

export default Top;