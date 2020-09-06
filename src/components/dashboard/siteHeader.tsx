/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../scss/style.scss';
import Svg from 'react-inlinesvg';
const SiteHeader: React.FC = () => (
  <header>
    <div className="container">
      <div className="site-header-inner">
        <div className="brand header-brand">
          <h1 className="m-0">
            <header>
              <div className="container">
                <div className="site-header-inner">
                  <div className="brand header-brand">
                    <h1 className="m-0">
                      <Svg
                        className="header-logo-image asset-light"
                        src={require('./dist/images/logo-light.svg')}
                      />
                      <Svg
                        className="header-logo-image asset-dark"
                        src={require('./dist/images/logo-dark.svg')}
                        alt="Logo"
                      />
                    </h1>
                  </div>
                </div>
              </div>
            </header>
          </h1>
        </div>
      </div>
    </div>
  </header>
);
export default SiteHeader;
