import React from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { Bone } from '../../../components';

import BrowserOnly from '@docusaurus/BrowserOnly';
import './index.scss';

const data = {
  desc: (
    <span>
      <Translate id="homepage.userDesc1">请在</Translate>{' '}
      <a rel="noopener noreferrer" target="_blank" href="https://github.com/alibaba/nacos/issues/273">
      谁在使用Nacos
      </a>{' '}
      <Translate id="homepage.userDesc2">上提供信息来帮助 Nacos 做的更好。</Translate>
    </span>
  ),
  list: [
    'https://img.alicdn.com/imgextra/i1/O1CN01K5uyIV20KePaQtBXy_!!6000000006831-2-tps-280-160.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01GqMYP21Xjj7xttIj0_!!6000000002960-0-tps-700-383.jpg',
    'https://img.alicdn.com/imgextra/i2/O1CN01SBhHkj1taxCPSZ2kW_!!6000000005919-0-tps-665-500.jpg',
    'https://img.alicdn.com/imgextra/i1/O1CN01C5PCJR1KfyzrAISdq_!!6000000001192-0-tps-960-640.jpg',
    'https://img.alicdn.com/tfs/TB1aB62OBr0gK0jSZFnXXbRRXXa-280-160.jpg',
    'https://img.alicdn.com/imgextra/i2/O1CN01Wf09Sq1KuBH4BYwtQ_!!6000000001223-2-tps-212-89.png',
    'https://img.alicdn.com/imgextra/i3/O1CN01F1xNSS1Dc8MGh5R8y_!!6000000000236-2-tps-212-48.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01Cno0oZ1qDe5LBjIhP_!!6000000005462-0-tps-349-217.jpg',
    'https://img.alicdn.com/imgextra/i2/O1CN01FV8mYI23bXruklb4N_!!6000000007274-2-tps-280-160.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01YdQ8Yg1zC7Px0SzXW_!!6000000006677-2-tps-280-160.png',
    'https://img.alicdn.com/tfs/TB1JK_GczMZ7e4jSZFOXXX7epXa-280-160.png',
    'https://img.alicdn.com/tfs/TB1ghT_atTfau8jSZFwXXX1mVXa-280-160.jpg',
    'https://img.alicdn.com/imgextra/i4/O1CN010NYWmb29l3n6oAwnE_!!6000000008107-2-tps-280-160.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01CrgaPR1Jn1T7LVfFy_!!6000000001072-0-tps-554-318.jpg',
    'https://img.alicdn.com/tfs/TB1Xd4IOUY1gK0jSZFMXXaWcVXa-280-160.png',
    'https://img.alicdn.com/tfs/TB1qhDSOrr1gK0jSZFDXXb9yVXa-280-160.png',
    'https://img.alicdn.com/imgextra/i4/O1CN01GcDWkS1LjTdKVssP1_!!6000000001335-2-tps-280-160.png',
    'https://img.alicdn.com/imgextra/i3/O1CN01yE3Vwi1MBPnBsenRG_!!6000000001396-2-tps-280-160.png',
    'https://img.alicdn.com/imgextra/i3/O1CN019bHmh11kG2ZTgWvzP_!!6000000004655-2-tps-280-160.png',
    'https://img.alicdn.com/imgextra/i3/O1CN017aL1Rk1NxKqnXFeDM_!!6000000001636-2-tps-735-406.png',
    'https://img.alicdn.com/imgextra/i1/O1CN01CTgp0F1WFfW6nv8aV_!!6000000002759-2-tps-1660-712.png'
],
  titleBefore: translate({ id: "homepage.userTitleBefore", message: "谁在使用" }),
  titleAfter: translate({ id: "homepage.userTitleAfter", message: " Nacos" }),
};

const User = () => {
  return (
    <BrowserOnly>
      {() => (
        <section className="users-section">
          <h3>
            {data.titleBefore}
            <span>{data.titleAfter}</span>
          </h3>
          <Bone type="dark" />
          <p>{data.desc}</p>
          <div className="users">
            {data.list.map((user, i) => (
              <div className="user-item" key={i}>
                <img src={user} rel="noopener noreferrer"/>
              </div>
            ))}
          </div>
        </section>
      )}
    </BrowserOnly>
  );
};

export default User;