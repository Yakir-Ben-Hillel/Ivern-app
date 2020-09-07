import React from 'react';
import {
  Paper,
  Grid,
  ButtonBase,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { israelAreas } from '../../dashboard/searchBar/desktop/areaOptions';
import { Post, User } from '../../../@types/types';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import { useStyles } from '../postAccordion';
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
  const platformIcon = (platform: string) => {
    if (platform === 'playstation')
      return <SonyPlaystation fontSize='inherit' />;
    else if (platform === 'xbox') return <MicrosoftXbox fontSize='inherit' />;
    else if (platform === 'switch')
      return <NintendoSwitch fontSize='inherit' />;
    else return undefined;
  };
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.paper}>
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
                {israelAreas[parseInt(post.area) - 1].name}
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
    </div>
  );
};
export default PostsListMobile;
