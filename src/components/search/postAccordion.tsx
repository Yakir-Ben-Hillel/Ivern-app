import { createStyles, makeStyles, Theme } from '@material-ui/core';
import isMobile from 'is-mobile';
import React from 'react';
import { Post, User } from '../../@types/types';
import PostsListDesktop from './desktop/postsListDesktop';
import PostsListMobile from './mobile/postsListMobile';
interface IProps {
  post: Post;
  openedPost: Post | null;
  user: User | null;
  userPosts: Post[];
  loading: boolean;
  setOpenedPost: React.Dispatch<React.SetStateAction<Post | null>>;
}
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
      margin: 'auto',
      maxWidth: 800,
    },
    image: {
      width: 100,
      height: 100,
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 0, 0, 4),
      margin: 'auto',
    },
    userInfo: {
      alignContent: 'center',
    },
    userAvatar: {
      margin: 'auto',
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
  })
);
const PostAccordion: React.FC<IProps> = ({
  post,
  user,
  openedPost,
  setOpenedPost,
  userPosts,
  loading,
}) => {
  const classes = useStyles();
  return (
    <div key={post.pid} className={classes.paper}>
      {!isMobile() ? (
        <PostsListDesktop
          post={post}
          user={user}
          userPosts={userPosts}
          openedPost={openedPost}
          setOpenedPost={setOpenedPost}
          loading={loading}
        />
      ) : (
        <PostsListMobile
          post={post}
          user={user}
          userPosts={userPosts}
          openedPost={openedPost}
          setOpenedPost={setOpenedPost}
          loading={loading}
        />
      )}
    </div>
  );
};
export default PostAccordion;
