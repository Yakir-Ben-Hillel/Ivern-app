/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Svg from 'react-inlinesvg';
import '../../scss/style.scss';

const Footer: React.FC = () => {
  return (
    <footer className='site-footer has-top-divider'>
      <div className='container'>
        <div className='site-footer-inner'>
          <div className='brand footer-brand'>
            <a href='/'>
              <Svg
                className='asset-light'
                src={require('./dist/images/logo-light.svg')}
              />
              <Svg
                className='asset-dark'
                src={require('./dist/images/logo-dark.svg')}
              />
            </a>
          </div>
          <ul className='footer-social-links list-reset'>
            <li>
              <a href='https://www.facebook.com/yakirbenhillel/'>
                <span className='screen-reader-text'>Facebook</span>
                <svg width='16' height='16' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z'
                    fill='#FFF'
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href='https://github.com/Yakir-Ben-Hillel'>
                <span className='screen-reader-text'>Github</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
                    fill='#FFF'
                  />
                </svg>
              </a>
            </li>
          </ul>
          <div className='footer-copyright'>
            &copy; 2020 Ivern, all rights reserved to Yakir Ben Hillel.
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
