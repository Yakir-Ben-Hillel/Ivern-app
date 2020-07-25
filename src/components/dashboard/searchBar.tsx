/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../scss/style.scss';
const SearchBar = () => {
  return (
    <section className='cta section'>
      <div className='container-sm'>
        <div className='cta-inner section-inner'>
          <div className='cta-header text-center'>
            <h2 className='section-title mt-0'>Get it and Switch</h2>
            <p className='section-paragraph'>
              Lorem ipsum is common placeholder text used to demonstrate the
              graphic elements of a document or visual presentation.
            </p>
            <div className='cta-cta'>
              <a className='button button-primary' href='#'>
                Search bar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SearchBar;