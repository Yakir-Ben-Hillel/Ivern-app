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
  const [expandedPost, setExpandedPost] = React.useState<string>('');
  const [openedPostUID, setOpenedPostUID] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    let active = true;
    if (expandedPost === '') {
      return undefined;
    }

    (async () => {
      setLoading(true);
      const user = await axios.get(
        `https://europe-west3-ivern-app.cloudfunctions.net/api/user/${openedPostUID}`
      );
      if (active) {
        setUser(user.data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line
  }, [expandedPost]);
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
              post={post}
              loading={loading}
              expandedPost={expandedPost}
              setExpandedPost={setExpandedPost}
              setOpenedPostUID={setOpenedPostUID}
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
