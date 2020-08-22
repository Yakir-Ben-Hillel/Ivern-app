import React from 'react';
import PrimarySearchAppBar from './navbar';
import '../scss/style.scss';
import queryString from 'query-string';
import { Bar } from './dashboard/searchBar';
import SiteHeader from './dashboard/siteHeader';
import Footer from './dashboard/footer';
import axios from 'axios';
import PostsList from './search/posts_list';
import { Post } from './@types/types';

export const Search: React.FC = (props: any) => {
  const localLights = localStorage.getItem('lights');
  if (localLights === 'false') {
    document.body.classList.add('lights-off');
  }
  const [posts, setPosts] = React.useState<Post[]>();
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
      const res = await axios.get(
        'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/custom',
        {
          params: {
            games: params.game,
            areas: params.area,
          },
        }
      );
      setPostsLoading(false);
      if (active) {
        setPosts(res.data.posts);
      }
    })();
    return () => {
      active = false;
    };
  },[posts, props.location.search]);
  return (
    <div>
      <PrimarySearchAppBar />
      <div className="is-boxed has-animations">
        <div className="body-wrap boxed-container">
          <SiteHeader />
          <div className="container-sm cta-inner">
            <h1>Search</h1>
            <Bar />
          </div>
          <section className="cta section">
            <PostsList posts={posts} postsLoading={postsLoading} />
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
};
