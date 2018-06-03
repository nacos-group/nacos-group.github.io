import React from 'react';
import classnames from 'classnames';
import './index.scss';

const Bone = (props) => {
  return (
    <div
      className={
        classnames({
          bone: true,
          [`bone-${props.type}`]: true,
        })
      }
    />
  );
};

export default Bone;
