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
      <Translate id="homepage.userDesc2">上提供信息来帮助 Seata 做的更好。</Translate>
    </span>
  ),
  list: [
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563438-a13d7097-fcfd-400f-b066-82564ff31647.jpeg',
    'https://img.alicdn.com/imgextra/i1/O1CN01GqMYP21Xjj7xttIj0_!!6000000002960-0-tps-700-383.jpg',
    'https://cdn.nlark.com/yuque/0/2022/png/1577777/1660182838738-ab94039e-9c22-413c-9715-db9add1eb83c.png',
    'https://cdn.nlark.com/yuque/0/2022/jpeg/1577777/1660182954580-7322d9df-c461-4991-ab95-fcdec773bd30.jpeg',
    'https://img.alicdn.com/tfs/TB1aB62OBr0gK0jSZFnXXbRRXXa-280-160.jpg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1562465794060-b0a5d9eb-bb52-47cd-a3fd-1b30d805e859.jpeg',
    'https://user-images.githubusercontent.com/975639/103077254-6dc24e80-460a-11eb-9ff4-81e42dff60c9.png',
    'https://img.alicdn.com/imgextra/i2/O1CN01Cno0oZ1qDe5LBjIhP_!!6000000005462-0-tps-349-217.jpg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563538-cd2549b5-5ad7-4e34-938e-aa1fda5b46bd.jpeg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563443-be4d11fe-8c60-4a0d-8df1-d8e0ddda5bc4.jpeg',
    'https://img.alicdn.com/tfs/TB1JK_GczMZ7e4jSZFOXXX7epXa-280-160.png',
    'https://img.alicdn.com/tfs/TB1ghT_atTfau8jSZFwXXX1mVXa-280-160.jpg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563550-5731d6df-a061-4da0-96bc-97bb57bf5149.jpeg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563482-2d17db65-bbbc-428e-999b-247fcf290592.jpeg',
    'https://img.alicdn.com/tfs/TB1Xd4IOUY1gK0jSZFMXXaWcVXa-280-160.png',
    'https://img.alicdn.com/tfs/TB1qhDSOrr1gK0jSZFDXXb9yVXa-280-160.png',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563550-c02c3ffc-75fc-41ae-898c-20b5e60d0e64.jpeg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563512-e640635e-a180-4c4d-b004-6ed91863782d.jpeg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1561540563467-2fc7ba94-f003-465e-ab62-df52aeb457d7.jpeg',
    'https://cdn.nlark.com/yuque/0/2019/jpeg/338441/1569745984623-8f755a9b-f42d-49d2-88a7-cb58b1833a23.jpeg',
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
                <img src={user} />
              </div>
            ))}
          </div>
        </section>
      )}
    </BrowserOnly>
  );
};

export default User;