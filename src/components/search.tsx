import React from 'react';
import PrimarySearchAppBar from './navbar';
import '../scss/style.scss';
import queryString from 'query-string';
import { Bar } from './dashboard/searchBar';
import SiteHeader from './dashboard/siteHeader';
import Footer from './dashboard/footer';
import axios, { AxiosResponse } from 'axios';
import PostsList from './search/postsLIst';
import { Post } from '../@types/types';

export const Search: React.FC = (props: any) => {
  const localLights = localStorage.getItem('lights');
  if (localLights === 'false') {
    document.body.classList.add('lights-off');
  }
  const [posts, setPosts] = React.useState<Post[]>();
  const [page, setPage] = React.useState<number>(1);
  const [postsLoading, setPostsLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
    document.body.classList.add('is-loaded');
  });
  React.useEffect(() => {
    let active = true;
    if (posts !== undefined) return undefined;
    (async () => {
      const params = queryString.parse(props.location.search);
      setPostsLoading(true);
      let res: AxiosResponse<any> | undefined;
      if (params.game && params.areas && params.platform) {
        res = await axios.get(
          'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/custom',
          {
            params: {
              games: params.game,
              areas: params.area,
              platform: params.platform,
            },
          }
        );
      } else if (params.platform) {
        res = await axios.get(
          `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/platform/${params.platform}`
        );
      } else {
        res = await axios.get(
          'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get'
        );
      }
      setPostsLoading(false);
      if (active) {
        setPosts(res?.data.posts);
      }
    })();
    return () => {
      active = false;
    };
  }, [posts, props.location.search]);
  return (
    <div>
      <div className='is-boxed has-animations'>
        <div className='body-wrap boxed-container'>
          <PrimarySearchAppBar />
          <SiteHeader />
          <div className='container-sm cta-inner'>
            <h1>Search</h1>
            <Bar />
          </div>
          <section className='cta section'>
            <PostsList
              posts={posts}
              postsLoading={postsLoading}
              page={page}
              setPage={setPage}
            />
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
};
