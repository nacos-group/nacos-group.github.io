import React from 'react';
import classnames from 'classnames';
import Bone from '../bone';
import './index.scss';

export default function Bar(props) {
  const { text, img } = props;
  const cls = classnames({
    bar: true,
  });
  return (
    <div className={cls}>
      <div className="bar-body">
        <img src={img} className="front-img" />
        <div className="bar-title">
          <span>{text}</span>
          <Bone type="light" />
        </div>
        <img src={img} className="back-img" />
      </div>
    </div>
  );
}
