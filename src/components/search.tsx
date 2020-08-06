import React from 'react';
import PrimarySearchAppBar from './navbar';
import '../scss/style.scss';
import queryString from 'query-string';
import { Bar } from './dashboard/searchBar';
import SiteHeader from './dashboard/siteHeader';
import Footer from './dashboard/footer';
import axios from 'axios';

export const Search: React.FC = (props: any) => {
  const [posts, setPosts] = React.useState();

  React.useEffect(() => {
    let active = true;
    if (posts !== undefined) return undefined;
    (async () => {
      const params = queryString.parse(props.location.search);
      const res = await axios.get(
        'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/custom',
        {
          params: {
            games: params.game,
            areas: params.area,
          },
        }
      );
      if (active) {
        setPosts(res.data.posts);
      }
    })();
    return () => {
      active = false;
    };
  });
  return (
    <div>
      <PrimarySearchAppBar />
      <div className='is-boxed has-animations'>
        <div className='body-wrap boxed-container'>
          <SiteHeader />
          <section className='cta section'>
            <div className='container-sm cta-inner'>
              <h1>Search</h1>
              <Bar />
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
};
