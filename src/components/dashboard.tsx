/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../scss/style.scss';
import sr from './scrollReveal';
import SiteHeader from './dashboard/siteHeader';
import HeroSection from './dashboard/heroSection';
import Features from './dashboard/features';
import SearchBar from './dashboard/searchBar';
import Footer from './dashboard/footer';
export const Dashboard: React.FC = () => {
  React.useEffect(() => {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
    document.body.classList.add('is-loaded');
    sr.reveal('.feature', {
      duration: 600,
      distance: '20px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'right',
      viewFactor: 0.2,
    });
  });

  return (
    <div className='is-boxed has-animations'>
      <div className='body-wrap boxed-container'>
        <SiteHeader />
        <main>
          <HeroSection />
          <Features />
          <SearchBar />
        </main>
        <Footer />
      </div>
    </div>
  );
};
