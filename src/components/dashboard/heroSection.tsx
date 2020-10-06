/* eslint-disable jsx-a11y/anchor-is-valid */
import mobile from 'is-mobile';
import React from 'react';
import Svg from 'react-inlinesvg';
import '../../scss/style.scss';

interface IProps {
  lights: boolean;
}
const HeroSection: React.FC = () => {
  let choice = true;
  const localLights = localStorage.getItem('lights');
  if (localLights === 'false') {
    choice = false;
    document.body.classList.add('lights-off');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lights, SwitchLights] = React.useState(choice);

  return (
    <section className='hero'>
      <div className='container'>
        <div className='hero-inner'>
          <div className='hero-copy'>
            <h1 className='hero-title mt-0'>Play. Swap. Sell</h1>
            <p className='hero-paragraph'>
              Sell your old games, Explore new games, And Swap you old games for
              some new ones your heart desires. Click on the button below to
              explore.
            </p>
            <div className='hero-cta'>
              <a className='button button-primary' href='/search'>
                Explore
              </a>
            </div>
          </div>
          <div className='hero-media'>
            <div className='header-illustration'>
              {!lights && (
                <Svg
                  className='header-illustration-image asset-dark'
                  src={require('./dist/images/header-illustration-dark.svg')}
                />
              )}
            </div>
            <div className='hero-media-illustration'>
              {lights ? (
                <Svg
                  src={require('./dist/images/hero-media-illustration-light.svg')}
                  className='hero-media-illustration-image asset-light'
                />
              ) : (
                <Svg
                  src={require('./dist/images/hero-media-illustration-dark.svg')}
                  className='hero-media-illustration-image asset-dark'
                />
              )}
            </div>
            <div className='hero-media-container'>
              {mobile() ? (
                <MobilePic lights={lights} />
              ) : (
                <DesktopPic lights={lights} />
              )}
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
        className='hero-media-image asset-light'
        src={require('./dist/images/box-pic-light.svg')}
      />
    );
  else
    return (
      <Svg
        className='hero-media-image asset-dark'
        src={require('./dist/images/3773314.svg')}
      />
    );
};
const DesktopPic: React.FC<IProps> = ({ lights }) => {
  if (lights)
    return (
      <img
        className='hero-media-image asset-light'
        height='380'
        width='538'
        src={require('./dist/images/box-pic-light.jpg')}
        alt='playing video games'
      />
    );
  else
    return (
      <img
        className='hero-media-image asset-dark'
        height='380'
        width='538'
        src={require('./dist/images/3773314.jpg')}
        alt='playing video games'
      />
    );
};

export default HeroSection;
