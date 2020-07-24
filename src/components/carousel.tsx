import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

export class Gallery extends React.Component {
  state = {
    galleryItems: [1, 2, 3].map((i) => {
      if (i === 1)
        return (
          <img
            className='container'
            src='https://firebasestorage.googleapis.com/v0/b/ivern-app.appspot.com/o/father-and-son-sitting-on-sofa-in-lounge-playing-PYDZENC-1024x683.jpg?alt=media&token=d0d52494-82e8-4138-9452-9cd08f9342f2'
            alt='father and son playing video games'
          />
        );
      else return <h2 key={i}>number</h2>;
    }),
  };

  responsive = {
    0: { items: 1 },
  };

  onSlideChange(e: any) {
    console.debug('Item`s position during a change: ', e.item);
    console.debug('Slide`s position during a change: ', e.slide);
  }

  onSlideChanged(e: any) {
    console.debug('Item`s position after changes: ', e.item);
    console.debug('Slide`s position after changes: ', e.slide);
  }

  render() {
    return (
        <AliceCarousel
          items={this.state.galleryItems}
          responsive={this.responsive}
          autoPlayInterval={2000}
          autoPlayDirection='rtl'
          autoPlay={true}
          fadeOutAnimation={true}
          mouseTrackingEnabled={true}
          playButtonEnabled={false}
          disableAutoPlayOnAction={true}
          buttonsDisabled={true}
          onSlideChange={this.onSlideChange}
          onSlideChanged={this.onSlideChanged}
        />
    );
  }
}
