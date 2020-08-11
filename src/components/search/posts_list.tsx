import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import clsx from 'clsx';
import { Post } from '../search';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import { israelAreas } from '../dashboard/searchBar/desktop/areaOptions';
import {
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
interface IProps {
  posts: Post[] | undefined;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      // marginBottom: theme.spacing(1),
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
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    pager: {
      display: 'flex',
      justifyContent: 'center',
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '75%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
  })
);
const PostsList: React.FC<IProps> = ({ posts }) => {
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
    <div className={classes.root}>
      {posts?.map((post) => (
        <div key={post.pid} className={classes.paper}>
          <Accordion>
            <AccordionSummary>
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <img
                      className={classes.img}
                      alt='complex'
                      src={post.imageURL}
                    />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction='row' spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant='subtitle1'>
                        {platformIcon(post.platform)}
                        {` ${post.gameName}`}
                      </Typography>
                      <Typography variant='body2' gutterBottom>
                        {post.description}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {israelAreas[parseInt(post.area) - 1].name}
                      </Typography>
                    </Grid>
                    {/* <Grid item sm>
                      <Typography variant='body2' style={{ cursor: 'pointer' }}>
                        Remove
                      </Typography>
                    </Grid> */}
                  </Grid>
                  <Grid item direction='column' spacing={2}>
                    <Typography variant='subtitle1'>{`₪${post.price}.00`}</Typography>
                    <Typography variant='body2' color='textSecondary'>
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
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.column}>
                <Typography variant='caption'>{post.description}</Typography>
              </div>
              <div className={clsx(classes.column, classes.helper)}>
                <Typography variant='caption'>
                  Select your destination of choice
                  <br />
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
      <Paper className={classes.pager}>
        <Pagination
          count={posts ? Math.ceil(posts.length / 8) : undefined}
          size='large'
        />
      </Paper>
    </div>
  );
};
export default PostsList;
