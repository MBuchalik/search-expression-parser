import React from 'react';

import { Snippet } from './common/snippet';

export const Installation: React.FC = () => {
  return (
    <div>
      <h2 className="text-[1.75rem] font-bold tracking-wider">Installation</h2>

      <div className="my-4">
        To install search-expression-parser, simply run:
      </div>

      <div>
        <Snippet snippet="npm install search-expression-parser" />
      </div>
    </div>
  );
};
