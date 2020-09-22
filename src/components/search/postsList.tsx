import { Paper } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import isMobile from 'is-mobile';
import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import { Post, User } from '../../@types/types';
import PostAccordion from './postAccordion';
import PostSkeleton from './postSkeleton';
interface IProps {
  posts: Post[] | undefined;
  postsLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    pager: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
);
const PostsList: React.FC<IProps> = ({
  posts,
  postsLoading,
  page,
  setPage,
}) => {
  const [openedPost, setOpenedPost] = React.useState<Post | null>(null);
  const [postsToShow, setPostsToShow] = React.useState<Post[] | undefined>();
  const [userPosts, setUserPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    let active = true;
    if (!openedPost) {
      return undefined;
    }
    (async () => {
      setLoading(true);
      const user = await axios.get(
        `https://europe-west3-ivern-app.cloudfunctions.net/api/user/${openedPost.uid}`
      );
      const posts = await axios.get(
        `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/user/${user.data.uid}`
      );
      const postsToUse = posts.data.posts.filter(
        (post: Post) => post.gid !== openedPost.gid
      );
      if (active) {
        setUser(user.data);
        setUserPosts(postsToUse);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [openedPost]);
  React.useEffect(
    () => setPostsToShow(posts?.slice(0 + (page - 1) * 6, 6 + (page - 1) * 6)),
    [posts, page]
  );
  const classes = useStyles();
  return (
    <div>
      {postsLoading ? (
        <PostSkeleton />
      ) : (
        <div className={classes.root}>
          {postsToShow?.map((post, index) => (
            <div key={index}>
              <PostAccordion
                user={user}
                userPosts={userPosts}
                openedPost={openedPost}
                setOpenedPost={setOpenedPost}
                post={post}
                loading={loading}
              />
            </div>
          ))}
          <Paper className={classes.pager}>
            <Pagination
              page={page}
              onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                setPage(value);
                window.scrollTo({ top: 0, behavior: 'auto' });
              }}
              boundaryCount={1}
              count={posts ? Math.ceil(posts.length / 6) : undefined}
              size={isMobile() ? 'medium' : 'large'}
            />
          </Paper>
        </div>
      )}
    </div>
  );
};
export default PostsList;
