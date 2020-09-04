import React from 'react';
import {
  Grid,
  Card,
  Typography,
  CardContent,
  Button,
  CardActions,
  Avatar,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EventIcon from '@material-ui/icons/Event';
import { useStyles } from '../postsManager';
import { Post } from '../../../@types/types';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
interface IProps {
  selectedPost: Post;
}

const PostView: React.FC<IProps> = ({ selectedPost }) => {
  const platformIcon = (platform: string) => {
    if (platform === 'playstation')
      return <SonyPlaystation fontSize='inherit' />;
    else if (platform === 'xbox') return <MicrosoftXbox fontSize='inherit' />;
    else if (platform === 'switch')
      return <NintendoSwitch fontSize='inherit' />;
    else return undefined;
  };
  const makeDate = () => {
    const postDate = new Date(selectedPost.createdAt._seconds * 1000);
    return `${postDate.getDate()}/${
      (postDate.getMonth() % 12) + 1
    }/${postDate.getFullYear()}`;
  };
  const imageURL: string = selectedPost.cover.replace('logo_med', '1080p');

  const classes = useStyles();
  return (
    <div>
      <Card className={classes.paper}>
        <CardContent
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <Grid container alignItems='center' spacing={3}>
            <Grid item xs>
              <div>
                {selectedPost.artwork ? (
                  <img
                    style={{ objectFit: 'cover', margin: 0 }}
                    width='100%'
                    height='400px'
                    src={selectedPost.artwork}
                    alt=''
                  />
                ) : (
                  <img
                    style={{ objectFit: 'cover', margin: 0 }}
                    width='100%'
                    height='400px'
                    src={selectedPost.cover}
                    alt=''
                  />
                )}
                <Avatar className={classes.avatar} src={imageURL} alt='' />
              </div>
              <Typography variant='h5' component='h2'>
                {platformIcon(selectedPost.platform)}
                {selectedPost.gameName}
              </Typography>
              <Typography color='textSecondary'>
                <DescriptionIcon fontSize='inherit' />
                {'Description: '}
                {selectedPost.description}
              </Typography>
              <Typography color='textSecondary'>
                <LocalOfferIcon fontSize='inherit' />
                {'Price: '}
                {selectedPost.price}
              </Typography>
              <Button
                color='default'
                variant='contained'
                className={classes.button}
              >
                <DeleteIcon className={classes.leftIcon} />
                Delete
              </Button>
              <Button
                color='default'
                variant='contained'
                className={classes.button}
              >
                <EditIcon className={classes.leftIcon} />
                Edit
              </Button>
              <CardActions>
                <Typography variant='caption'>
                  <EventIcon fontSize='inherit' />
                  {'Created At: '}
                  {makeDate()}
                </Typography>
              </CardActions>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default PostView;
