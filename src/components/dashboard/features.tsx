import React from 'react';
import '../../scss/style.scss';
import Svg from 'react-inlinesvg';
import isMobile from 'is-mobile';

const Features: React.FC = () => {
  return (
    <section className='features section'>
      <div className='container'>
        <div className='features-inner section-inner has-bottom-divider'>
          <div className='features-header text-center'>
            <div className='container-sm'>
              <h2 className='section-title mt-0'>Ivern</h2>
              <p className='section-paragraph'>
                Bro ipsum dolor sit amet wacky bowl switch, dope doodle hot
                dogging back country doin 420.
              </p>
              {!isMobile() && (
                <div className='features-image'>
                  <Svg
                    className='features-illustration asset-dark'
                    src={require('./dist/images/features-illustration-dark.svg')}
                  />
                  <Svg
                    className='features-illustration asset-dark'
                    src={require('./dist/images/features-illustration-top-dark.svg')}
                  />

                  <Svg
                    className='features-illustration asset-light'
                    src={require('./dist/images/features-illustration-light.svg')}
                  />
                  <Svg
                    className='features-illustration asset-light'
                    src={require('./dist/images/features-illustration-top-light.svg')}
                  />
                </div>
              )}
            </div>
          </div>
          <div className='features-wrap'>
            <div className='feature is-revealing'>
              <div className='feature-inner'>
                <div className='feature-icon'>
                  <Svg
                    className='asset-light'
                    src={require('./dist/images/feature-01-light.svg')}
                  />
                  <Svg
                    className='asset-dark'
                    src={require('./dist/images/feature-01-dark.svg')}
                  />
                </div>
                <div className='feature-content'>
                  <h3 className='feature-title mt-0'>Discover</h3>
                  <p className='text-sm mb-0'>
                    Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua
                    dui.
                  </p>
                </div>
              </div>
            </div>
            <div className='feature is-revealing'>
              <div className='feature-inner'>
                <div className='feature-icon'>
                  <Svg
                    className='asset-light'
                    src={require('./dist/images/feature-02-light.svg')}
                  />
                  <Svg
                    className='asset-dark'
                    src={require('./dist/images/feature-02-dark.svg')}
                  />
                </div>
                <div className='feature-content'>
                  <h3 className='feature-title mt-0'>Discover</h3>
                  <p className='text-sm mb-0'>
                    Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua
                    dui.
                  </p>
                </div>
              </div>
            </div>
            <div className='feature is-revealing'>
              <div className='feature-inner'>
                <div className='feature-icon'>
                  <Svg
                    className='asset-light'
                    src={require('./dist/images/feature-03-light.svg')}
                  />
                  <Svg
                    className='asset-dark'
                    src={require('./dist/images/feature-03-dark.svg')}
                  />
                </div>
                <div className='feature-content'>
                  <h3 className='feature-title mt-0'>Discover</h3>
                  <p className='text-sm mb-0'>
                    Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua
                    dui.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
