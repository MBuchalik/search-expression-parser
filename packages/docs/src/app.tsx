import classNames from 'classnames';
import React from 'react';

import { Grammar } from './components/grammar';
import { HeroContent } from './components/hero-content';
import { Installation } from './components/installation';
import { Usage } from './components/usage';

export const App: React.FC = () => {
  return (
    <div className={classNames('w-[900px]', 'mx-auto', 'p-8')}>
      <div className={classNames('mb-16')}>
        <HeroContent />
      </div>

      <hr
        className={classNames('border-none', 'block', 'h-1', 'bg-neutral-200')}
      />

      <div className={classNames('mt-16')}>
        <Installation />
      </div>

      <div className={classNames('mt-8')}>
        <Usage />
      </div>

      <div className={classNames('mt-8')}>
        <Grammar />
      </div>
    </div>
  );
};
