import { Typography } from '@material-ui/core';
import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';
import React from 'react';
import { Post } from '../@types/types';
import '../scss/style.scss';
import Footer from './dashboard/footer';
import { Bar } from './dashboard/searchBar';
import SiteHeader from './dashboard/siteHeader';
import PrimarySearchAppBar from './navbar';
import PostsList from './search/postsList';
import ChatButton from './chats/chats';
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
      if (params.game && params.area && params.platform) {
        res = await axios.get(
          'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/custom',
          {
            params: {
              games: params.game,
              area: params.area,
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
            <Typography variant='h4'>Search</Typography>
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
          <ChatButton />
          <Footer />
        </div>
      </div>
    </div>
  );
};
