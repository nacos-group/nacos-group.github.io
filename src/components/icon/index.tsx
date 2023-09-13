import React from 'react';
import classnames from 'classnames';
import './index.scss';

type Props = {
  type: string;
};

const Icon = (props: Props) => {
  const { type } = props;
  return (
    <i
      className={classnames({
        'docsite-icon': true,
        [`docsite-icon-${type}`]: true,
      })}
    />
  );
};
export default Icon;