import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import PostSkeleton from './postSkeleton';
import 'react-multi-carousel/lib/styles.css';
import { Paper } from '@material-ui/core';
import axios from 'axios';
import Pagination from '@material-ui/lab/Pagination';
import { Post, User } from '../@types/types';
import PostAccordion from './postAccordion';
interface IProps {
  posts: Post[] | undefined;
  postsLoading: boolean;
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
const PostsList: React.FC<IProps> = ({ posts, postsLoading }) => {
  const [openedPost, setOpenedPost] = React.useState<Post | null>(null);
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
  const classes = useStyles();
  return (
    <div>
      {postsLoading ? (
        <PostSkeleton />
      ) : (
        <div className={classes.root}>
          {posts?.map((post) => (
            <PostAccordion
              user={user}
              userPosts={userPosts}
              openedPost={openedPost}
              setOpenedPost={setOpenedPost}
              post={post}
              loading={loading}
            />
          ))}
          <Paper className={classes.pager}>
            <Pagination
              count={posts ? Math.ceil(posts.length / 8) : undefined}
              size="large"
            />
          </Paper>
        </div>
      )}
    </div>
  );
};
export default PostsList;
