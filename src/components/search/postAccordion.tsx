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
import { Post, User } from '../@types/types';
interface IProps {
  post: Post;
  user: User | null;
  loading: boolean;
  expandedPost: string;
  setExpandedPost: React.Dispatch<React.SetStateAction<string>>;
  setOpenedPostUID: React.Dispatch<React.SetStateAction<string>>;
}
const PostAccordion: React.FC<IProps> = ({
  post,
  user,
  loading,
  expandedPost,
  setExpandedPost,
  setOpenedPostUID,
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
    if (expandedPost === '' || expandedPost !== post.pid) {
      setExpandedPost(post.pid);
      setOpenedPostUID(post.uid);
    } else {
      setExpandedPost('');
    }
  };

  const classes = useStyles();
  return (
    <div key={post.pid} className={classes.paper}>
      <Accordion
        expanded={expandedPost === post.pid}
        onChange={handleChange(post)}
      >
        <AccordionSummary>
          <Grid container spacing={2}>
            <Grid item>
              <ButtonBase className={classes.image}>
                <img
                  className={classes.img}
                  alt="complex"
                  src={post.imageURL}
                />
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
                  Updated Today
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
            <PostsCarousel />
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
