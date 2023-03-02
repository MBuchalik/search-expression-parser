import classNames from 'classnames';
import React from 'react';

import { Grammar } from './components/grammar';
import { HeroContent } from './components/hero-content';
import { Installation } from './components/installation';
import { Usage } from './components/usage';
// The logo can be downloaded here: https://github.com/logos
import githubMark from './github-mark.svg';

export const App: React.FC = () => {
  return (
    <React.Fragment>
      <a
        href="https://github.com/MBuchalik/search-expression-parser"
        target="_blank"
        className={classNames('absolute top-2 right-2')}
        rel="noreferrer"
      >
        <img
          src={githubMark}
          alt="GitHub Logo"
          className={classNames('w-10 hover:opacity-80')}
        ></img>
      </a>

      <div className={classNames('mx-auto w-[900px] p-8')}>
        <div className={classNames('mb-16')}>
          <HeroContent />
        </div>

        <hr className={classNames('block h-1 border-none bg-neutral-200')} />

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
    </React.Fragment>
  );
};
