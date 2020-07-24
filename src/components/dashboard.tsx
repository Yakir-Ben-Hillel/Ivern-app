/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../scss/style.scss';
import sr from './scrollReveal';
import SiteHeader from './siteHeader';
import HeroSection from './heroSection';
import Svg from 'react-inlinesvg';
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
    <div className="is-boxed has-animations">
      <div className="body-wrap boxed-container">
        <SiteHeader />
        <main>
          <HeroSection />
          <section className="features section">
            <div className="container">
              <div className="features-inner section-inner has-bottom-divider">
                <div className="features-header text-center">
                  <div className="container-sm">
                    <h2 className="section-title mt-0">Ivern</h2>
                    <p className="section-paragraph">
                      Bro ipsum dolor sit amet wacky bowl switch, dope doodle
                      hot dogging back country doin 420.
                    </p>
                    <div className="features-image">
                      <Svg
                        className="features-illustration asset-dark"
                        src={require('./dist/images/features-illustration-dark.svg')}
                      />
                      <Svg
                        className="features-illustration asset-dark"
                        src={require('./dist/images/features-illustration-top-dark.svg')}
                      />

                      <Svg
                        className="features-illustration asset-light"
                        src={require('./dist/images/features-illustration-light.svg')}
                      />
                      <Svg
                        className="features-illustration asset-light"
                        src={require('./dist/images/features-illustration-top-light.svg')}
                      />
                    </div>
                  </div>
                </div>
                <div className="features-wrap">
                  <div className="feature is-revealing">
                    <div className="feature-inner">
                      <div className="feature-icon">
                        <Svg
                          className="asset-light"
                          src={require('./dist/images/feature-01-light.svg')}
                        />
                        <Svg
                          className="asset-dark"
                          src={require('./dist/images/feature-01-dark.svg')}
                        />
                      </div>
                      <div className="feature-content">
                        <h3 className="feature-title mt-0">Discover</h3>
                        <p className="text-sm mb-0">
                          Lorem ipsum dolor sit amet, consecte adipiscing elit,
                          sed do eiusmod tempor incididunt ut labore et dolore
                          magna aliqua dui.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="feature is-revealing">
                    <div className="feature-inner">
                      <div className="feature-icon">
                        <Svg
                          className="asset-light"
                          src={require('./dist/images/feature-02-light.svg')}
                        />
                        <Svg
                          className="asset-dark"
                          src={require('./dist/images/feature-02-dark.svg')}
                        />
                      </div>
                      <div className="feature-content">
                        <h3 className="feature-title mt-0">Discover</h3>
                        <p className="text-sm mb-0">
                          Lorem ipsum dolor sit amet, consecte adipiscing elit,
                          sed do eiusmod tempor incididunt ut labore et dolore
                          magna aliqua dui.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="feature is-revealing">
                    <div className="feature-inner">
                      <div className="feature-icon">
                        <Svg
                          className="asset-light"
                          src={require('./dist/images/feature-03-light.svg')}
                        />
                        <Svg
                          className="asset-dark"
                          src={require('./dist/images/feature-03-dark.svg')}
                        />
                      </div>
                      <div className="feature-content">
                        <h3 className="feature-title mt-0">Discover</h3>
                        <p className="text-sm mb-0">
                          Lorem ipsum dolor sit amet, consecte adipiscing elit,
                          sed do eiusmod tempor incididunt ut labore et dolore
                          magna aliqua dui.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta section">
            <div className="container-sm">
              <div className="cta-inner section-inner">
                <div className="cta-header text-center">
                  <h2 className="section-title mt-0">Get it and Switch</h2>
                  <p className="section-paragraph">
                    Lorem ipsum is common placeholder text used to demonstrate
                    the graphic elements of a document or visual presentation.
                  </p>
                  <div className="cta-cta">
                    <a className="button button-primary" href="#">
                      Search bar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer has-top-divider">
          <div className="container">
            <div className="site-footer-inner">
              <div className="brand footer-brand">
                <a href="#">
                  <Svg
                    className="asset-light"
                    src={require('./dist/images/logo-light.svg')}
                  />
                  <Svg
                    className="asset-dark"
                    src={require('./dist/images/logo-dark.svg')}
                  />
                </a>
              </div>
              <ul className="footer-links list-reset">
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Hire me</a>
                </li>
                <li>
                  <a href="#">FAQ's</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
              </ul>
              <ul className="footer-social-links list-reset">
                <li>
                  <a href="#">
                    <span className="screen-reader-text">Facebook</span>
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z"
                        fill="#FFF"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="screen-reader-text">Twitter</span>
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"
                        fill="#FFF"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span className="screen-reader-text">Google</span>
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z"
                        fill="#FFF"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
              <div className="footer-copyright">
                &copy; 2020 Ivern, all rights reserved to Yakir Ben Hillel.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
