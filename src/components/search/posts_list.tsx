import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Post } from '../search';
interface IProps {
  posts: Post[] | undefined;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 900,
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
  })
);

const PostsList: React.FC<IProps> = ({ posts }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {posts?.map((post) => (
          <div key={post.pid}>
            <Paper className={classes.paper}>
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
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        {post.gameName}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {post.platform}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {post.uid}
                      </Typography>
                    </Grid>
                    {/* <Grid item>
                  <Typography variant="body2" style={{ cursor: 'pointer' }}>
                    Remove
                  </Typography>
                </Grid> */}
                  </Grid>
                  <Grid item direction="column" spacing={2}>
                    <Typography variant="subtitle1">{`$${post.price}.00`}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated Today
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </div>
        ))}
      </Paper>
    </div>
  );
};
export default PostsList;
