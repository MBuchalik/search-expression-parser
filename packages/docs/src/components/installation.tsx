import classNames from 'classnames';
import React from 'react';

import { Snippet } from './common/snippet';

export const Installation: React.FC = () => {
  return (
    <div>
      <h2
        className={classNames('font-bold', 'text-[1.75rem]', 'tracking-wider')}
      >
        Installation
      </h2>

      <div className={classNames('my-4')}>
        To install search-expression-parser, simply run:
      </div>

      <div>
        <Snippet snippet="npm install search-expression-parser" />
      </div>
    </div>
  );
};
