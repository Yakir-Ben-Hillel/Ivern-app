/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../scss/style.scss';
import Svg from 'react-inlinesvg';
import mobile from 'is-mobile';

interface IProps {
  lights: boolean;
}
const HeroSection: React.FC = () => {
  const [lights, SwitchLights] = React.useState(true);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1 className="hero-title mt-0">Play. Swap. Sell</h1>
            <p className="hero-paragraph">
              Explore new games while switching or selling the games you already
              finished! Click on the button below to start exploring.
            </p>
            <div className="hero-cta">
              <a className="button button-primary" href="#">
                Explore
              </a>
              <div className="lights-toggle">
                <input
                  onChange={() => {
                    if (lights) {
                      document.body.classList.add('lights-off');
                      SwitchLights(false);
                    } else {
                      document.body.classList.remove('lights-off');
                      SwitchLights(true);
                    }
                  }}
                  id="lights-toggle"
                  type="checkbox"
                  name="lights-toggle"
                  className="switch"
                  checked={lights}
                />
                <label htmlFor="lights-toggle" className="text-xs">
                  <span>
                    Turn me{' '}
                    <span className="label-text">
                      {lights ? 'dark' : 'light'}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <div className="header-illustration">
              {/* <Svg
              src={require('./dist/images/header-illustration-light.svg')}
              className="header-illustration-image asset-light"
            /> */}
              {!lights && (
                <Svg
                  className="header-illustration-image asset-dark"
                  src={require('./dist/images/header-illustration-dark.svg')}
                />
              )}
            </div>
            <div className="hero-media-illustration">
              {lights ? (
                <Svg
                  src={require('./dist/images/hero-media-illustration-light.svg')}
                  className="hero-media-illustration-image asset-light"
                />
              ) : (
                <Svg
                  src={require('./dist/images/hero-media-illustration-dark.svg')}
                  className="hero-media-illustration-image asset-dark"
                />
              )}
            </div>
            <div className="hero-media-container">
              {mobile() ? <MobilePic lights={lights} /> : <DesktopPic lights={lights} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const MobilePic: React.FC<IProps> = ({ lights }) => {
  if (lights)
    return (
      <Svg
        className="hero-media-image asset-light"
        src={require('./dist/images/box-pic-light.svg')}
      />
    );
  else
    return (
      <Svg
        className="hero-media-image asset-dark"
        src={require('./dist/images/3773314.svg')}
      />
    );
};
const DesktopPic: React.FC<IProps> = ({ lights }) => {
  if (lights)
    return (
      <img
        className="hero-media-image asset-light"
        height="380"
        width="538"
        src={require('./dist/images/box-pic-light.jpg')}
        alt="playing video games"
      />
    );
  else
    return (
      <img
        className="hero-media-image asset-dark"
        height="380"
        width="538"
        src={require('./dist/images/3773314.jpg')}
        alt="playing video games"
      />
    );
};

export default HeroSection;
