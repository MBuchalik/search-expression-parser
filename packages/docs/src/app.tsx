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
        className="absolute right-2 top-2"
        rel="noreferrer"
      >
        <img
          src={githubMark}
          alt="GitHub Logo"
          className="w-10 hover:opacity-80"
        ></img>
      </a>

      <div className="mx-auto w-[900px] p-8">
        <div className="mb-16">
          <HeroContent />
        </div>

        <hr className="block h-1 border-none bg-neutral-200" />

        <div className="mt-16">
          <Installation />
        </div>

        <div className="mt-8">
          <Usage />
        </div>

        <div className="mt-8">
          <Grammar />
        </div>
      </div>
    </React.Fragment>
  );
};
