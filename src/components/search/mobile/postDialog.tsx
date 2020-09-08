import React from 'react';
import {
  Dialog,
  DialogTitle,
  Grid,
  Avatar,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Divider,
} from '@material-ui/core';
import { Post, User } from '../../../@types/types';
import PostsCarousel from '../carousel';
import { Skeleton } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import DescriptionIcon from '@material-ui/icons/Description';

interface IProps {
  post: Post;
  openedPost: Post | null;
  user: User | null;
  userPosts: Post[];
  loading: boolean;
  dialogOpen: boolean;
  setOpenedPost: React.Dispatch<React.SetStateAction<Post | null>>;
  handleClickClose: () => void;
  platformIcon: (
    platform: 'playstation' | 'xbox' | 'switch' | undefined
  ) => void;
}
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      backgroundColor: theme.palette.background.default,
      flexGrow: 1,
    },
    avatar: {
      width: theme.spacing(18),
      height: theme.spacing(18),
      margin: 'auto',
      marginTop: '-85px',
      marginBottom: '5px',
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
const PostDialog: React.FC<IProps> = ({
  post,
  openedPost,
  dialogOpen,
  setOpenedPost,
  loading,
  user,
  userPosts,
  handleClickClose,
  platformIcon,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Dialog
        onClose={handleClickClose}
        aria-labelledby='simple-dialog-title'
        open={dialogOpen}
      >
        <DialogTitle id='simple-dialog-title'>Set backup account</DialogTitle>
        <Grid container alignItems='center'>
          <Grid item xs={12}>
            <div>
              {openedPost?.artwork ? (
                <img
                  style={{ objectFit: 'cover', margin: 0 }}
                  width='100%'
                  height='200px'
                  src={openedPost?.artwork}
                  alt=''
                />
              ) : (
                <img
                  style={{ objectFit: 'cover', margin: 0 }}
                  width='100%'
                  height='200px'
                  src={openedPost?.cover.replace('logo_med', '1080p')}
                  alt=''
                />
              )}
              <Avatar
                className={classes.avatar}
                src={openedPost?.cover}
                alt=''
              />
            </div>
            <Typography variant='h6'>
              {platformIcon(openedPost?.platform)}
              {openedPost?.gameName}
            </Typography>
          </Grid>
          <Typography color='textSecondary'>
            <DescriptionIcon fontSize='inherit' />
            {openedPost?.description}
          </Typography>
          <Typography>{`${openedPost?.price}₪`}</Typography>

          <Grid container direction='column'>
            <Grid item xs>
              <div className={classes.helper}>
                {loading ? (
                  <div>
                    <Skeleton variant='circle' width={96} height={96} />
                    <Skeleton width='100%' />
                    <Skeleton variant='text' />
                  </div>
                ) : (
                  <Grid
                    className={classes.userInfo}
                    container
                    direction='column'
                  >
                    <Grid item>
                      <Avatar
                        className={classes.userAvatar}
                        src={user?.imageURL}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant='caption' color='textSecondary'>
                        <PersonIcon fontSize='small' />
                        {user?.displayName}
                      </Typography>
                    </Grid>
                    <Divider />
                    <Grid item>
                      <Typography variant='caption' color='textSecondary'>
                        <PhoneIcon fontSize='small' />
                        {user?.phoneNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </div>
            </Grid>
            <Grid item xs>
              <PostsCarousel
                user={user}
                userPosts={userPosts}
                loading={loading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default PostDialog;
