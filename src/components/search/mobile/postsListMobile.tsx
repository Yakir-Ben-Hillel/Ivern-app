import {
  ButtonBase,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {
  MicrosoftXbox,
  NintendoSwitch,
  SonyPlaystation,
} from 'mdi-material-ui';
import React from 'react';
import { Post, User } from '../../../@types/types';
import { useStyles } from '../postAccordion';
import PostDialog from './postDialog';
interface IProps {
  post: Post;
  openedPost: Post | null;
  user: User | null;
  userPosts: Post[];
  loading: boolean;
  setOpenedPost: React.Dispatch<React.SetStateAction<Post | null>>;
}
const PostsListMobile: React.FC<IProps> = ({
  post,
  openedPost,
  user,
  userPosts,
  loading,
  setOpenedPost,
}) => {
  const platformIcon = (
    platform: 'playstation' | 'xbox' | 'switch' | undefined
  ) => {
    if (platform === 'playstation')
      return <SonyPlaystation fontSize='inherit' />;
    else if (platform === 'xbox') return <MicrosoftXbox fontSize='inherit' />;
    else if (platform === 'switch')
      return <NintendoSwitch fontSize='inherit' />;
    else return undefined;
  };
  const handleClickOpen = () => {
    setOpenedPost(post);
    setDialogOpen(true);
  };
  const handleClickClose = () => {
    setDialogOpen(false);
    setOpenedPost(null);
  };
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const classes = useStyles();
  return (
    <div>
      <Paper onClick={handleClickOpen} className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt='complex' src={post.cover} />
            </ButtonBase>
          </Grid>
          <Grid item xs container>
            <Grid item xs>
              <Typography gutterBottom variant='subtitle1'>
                {platformIcon(post.platform)}
                {` ${post.gameName}`}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {post.cityName}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>{`₪${post.price}.00`}</Typography>
            <Grid
              item
              xs
              style={{
                position: 'relative',
                float: 'right',
                top: '25px',
              }}
            >
              {post.sell && (
                <Tooltip title='sellable' arrow>
                  <AttachMoneyIcon fontSize='inherit' />
                </Tooltip>
              )}
              {post.exchange && (
                <Tooltip title='swappable' arrow>
                  <SwapHorizIcon fontSize='inherit' />
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <PostDialog
        platformIcon={platformIcon}
        post={post}
        user={user}
        userPosts={userPosts}
        openedPost={openedPost}
        dialogOpen={dialogOpen}
        setOpenedPost={setOpenedPost}
        loading={loading}
        handleClickClose={handleClickClose}
      />
    </div>
  );
};
export default PostsListMobile;
