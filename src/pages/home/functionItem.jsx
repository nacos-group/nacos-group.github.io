import React from 'react';
import { getLink } from '../../../utils';

const Item = (props) => {
  const { func, imgFirst } = props;
  if (imgFirst) {
    return (
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
    );
  }
  return (
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
  );
};

export default Item;
