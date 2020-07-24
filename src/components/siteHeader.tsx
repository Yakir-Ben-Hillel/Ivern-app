import React from 'react';
import '../scss/style.scss';
const SiteHeader: React.FC = () => (
  <header className='site-header'>
    <div className='container'>
      <div className='site-header-inner'>
        <div className='brand header-brand'>
          <h1 className='m-0'>
            <a href='#'>
              <header className='site-header'>
                <div className='container'>
                  <div className='site-header-inner'>
                    <div className='brand header-brand'>
                      <h1 className='m-0'>
                        <a href='#'>
                          <svg
                            className='header-logo-image asset-light'
                            width='32'
                            height='32'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <defs>
                              <linearGradient
                                x1='50%'
                                y1='0%'
                                x2='77.135%'
                                y2='77.109%'
                                id='a'
                              >
                                <stop stop-color='#FE7E1F' offset='0%' />
                                <stop stop-color='#FFCF7B' offset='100%' />
                              </linearGradient>
                              <linearGradient
                                x1='50%'
                                y1='0%'
                                x2='77.135%'
                                y2='77.109%'
                                id='b'
                              >
                                <stop
                                  stop-color='#FFF'
                                  stop-opacity='.48'
                                  offset='0%'
                                />
                                <stop
                                  stop-color='#FFF'
                                  stop-opacity='0'
                                  offset='100%'
                                />
                              </linearGradient>
                            </defs>
                            <g fill='none' fill-rule='evenodd'>
                              <path
                                d='M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16C31.99 7.168 24.832.01 16 0z'
                                fill='url(#a)'
                              />
                              <path
                                d='M29.012 25.313A11.98 11.98 0 0 1 25 26c-6.627 0-12-5.373-12-12 0-6.235 4.756-11.36 10.838-11.944C28.705 4.8 31.993 10.016 32 16c0 3.474-1.107 6.69-2.988 9.313z'
                                fill='url(#b)'
                              />
                            </g>
                          </svg>

                          <img
                            className='header-logo-image asset-dark'
                            src='images/logo-dark.svg'
                            alt='Logo'
                          />
                        </a>
                      </h1>
                    </div>
                  </div>
                </div>
              </header>

              <img
                className='header-logo-image asset-dark'
                src='images/logo-dark.svg'
                alt='Logo'
              />
            </a>
          </h1>
        </div>
      </div>
    </div>
  </header>
);
export default SiteHeader;
