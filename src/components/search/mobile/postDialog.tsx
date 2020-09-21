import React from 'react';
import {
  Dialog,
  Grid,
  Avatar,
  Typography,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import { Post, User } from '../../../@types/types';
import PostsCarousel from '../carousel';
import { Skeleton } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import DescriptionIcon from '@material-ui/icons/Description';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
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
    hebrew: {
      direction: 'rtl',
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    avatar: {
      width: theme.spacing(18),
      height: theme.spacing(18),
      margin: 'auto',
      marginTop: '-85px',
      marginBottom: '5px',
    },
    helper: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    userAvatarHelper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(1),
    },
    infoSkeleton: {
      margin: 'auto',
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(2),
    },
    skeleton: {
      marginBottom: theme.spacing(2),
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: 'auto',
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
          <Grid container direction='column'>
            <Grid className={classes.hebrew} item xs>
              <Typography color='textSecondary'>
                <DescriptionIcon fontSize='inherit' />
                {openedPost?.description}
              </Typography>
              <Typography color='textSecondary'>
                <AccountBalanceWalletIcon fontSize='inherit' />
                {`${openedPost?.price}.00₪`}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction='column'>
            {loading ? (
              <div>
                <Grid className={classes.skeleton} container direction='row'>
                  <Grid className={classes.infoSkeleton} item xs>
                    <Skeleton variant='text' />
                    <Skeleton variant='text' />
                  </Grid>
                  <Grid item xs>
                    <Skeleton variant='circle' width={96} height={96} />
                  </Grid>
                </Grid>
              </div>
            ) : (
              <div className={classes.helper}>
                <Grid container>
                  <Grid className={classes.userInfo} item xs>
                    <Typography variant='caption' color='textSecondary'>
                      <PersonIcon fontSize='small' />
                      {user?.displayName}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      <PhoneIcon fontSize='small' />
                      {user?.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid className={classes.userAvatarHelper} item>
                    <Avatar
                      className={classes.userAvatar}
                      src={user?.imageURL}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            {(userPosts.length > 0 || loading) && (
              <Grid item xs>
                <PostsCarousel
                  user={user}
                  userPosts={userPosts}
                  loading={loading}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default PostDialog;
