import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Grid,
  ButtonBase,
  Typography,
  Tooltip,
  AccordionDetails,
  Avatar,
  Divider,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { israelAreas } from '../dashboard/searchBar/desktop/areaOptions';
import PostsCarousel from './carousel';
import { Skeleton } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import { Post, User } from '../../@types/types';
interface IProps {
  post: Post;
  openedPost: Post | null;
  user: User | null;
  userPosts: Post[];
  loading: boolean;
  setOpenedPost: React.Dispatch<React.SetStateAction<Post | null>>;
}
const PostAccordion: React.FC<IProps> = ({
  post,
  user,
  openedPost,
  setOpenedPost,
  userPosts,
  loading,
}) => {
  const useStyles = makeStyles((theme: Theme) =>
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
  const platformIcon = (platform: string) => {
    if (platform === 'playstation')
      return <SonyPlaystation fontSize="inherit" />;
    else if (platform === 'xbox') return <MicrosoftXbox fontSize="inherit" />;
    else if (platform === 'switch')
      return <NintendoSwitch fontSize="inherit" />;
    else return undefined;
  };
  const handleChange = (post: Post) => () => {
    if (!openedPost || openedPost.pid !== post.pid) {
      setOpenedPost(post);
    } else {
      setOpenedPost(null);
    }
  };
  const today = new Date(Date.now());
  const makeDate = () => {
    const postDate = new Date(post.createdAt._seconds * 1000);
    const postDateObj = {
      postDay: postDate.getDate(),
      postMonth: (postDate.getMonth() % 12) + 1,
      postYear: postDate.getFullYear(),
    };
    if (
      postDateObj.postDay === today.getDate() &&
      postDateObj.postMonth === (today.getMonth() % 12) + 1 &&
      postDateObj.postYear === today.getFullYear()
    )
      return 'Updated Today';
    else if (
      postDateObj.postDay === today.getDate() - 1 &&
      postDateObj.postMonth === (today.getMonth() % 12) + 1 &&
      postDateObj.postYear === today.getFullYear()
    )
      return 'Updated Yesterday';
    else
      return `last updated ${postDateObj.postDay}/${postDateObj.postMonth}/${postDateObj.postYear}`;
  };

  const classes = useStyles();
  return (
    <div key={post.pid} className={classes.paper}>
      <Accordion
        expanded={openedPost?.pid === post.pid}
        onChange={handleChange(post)}
      >
        <AccordionSummary>
          <Grid container spacing={2}>
            <Grid item>
              <ButtonBase className={classes.image}>
                <img className={classes.img} alt="complex" src={post.cover} />
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="row" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1">
                    {platformIcon(post.platform)}
                    {` ${post.gameName}`}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {post.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {israelAreas[parseInt(post.area) - 1].name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item direction="column" spacing={2}>
                <Typography variant="subtitle1">{`₪${post.price}.00`}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {makeDate()}
                </Typography>
                <Grid
                  item
                  xs
                  style={{
                    position: 'relative',
                    float: 'right',
                    top: '25px',
                  }}
                  spacing={1}
                >
                  {post.sell && (
                    <Tooltip title="sellable" arrow>
                      <AttachMoneyIcon fontSize="inherit" />
                    </Tooltip>
                  )}
                  {post.exchange && (
                    <Tooltip title="swappable" arrow>
                      <SwapHorizIcon fontSize="inherit" />
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: '66.66%' }}>
            <PostsCarousel
              user={user}
              userPosts={userPosts}
              loading={loading}
            />
          </div>
          <div className={classes.helper}>
            {loading ? (
              <div>
                <Skeleton variant="circle" width={96} height={96} />
                <Skeleton width="100%" />
                <Skeleton variant="text" />
              </div>
            ) : (
              <Grid className={classes.userInfo} container direction="column">
                <Grid item>
                  <Avatar className={classes.userAvatar} src={user?.imageURL} />
                </Grid>
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    <PersonIcon fontSize="small" />
                    {user?.displayName}
                  </Typography>
                </Grid>
                <Divider />
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    <PhoneIcon fontSize="small" />
                    {user?.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default PostAccordion;
