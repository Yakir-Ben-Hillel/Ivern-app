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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EventIcon from '@material-ui/icons/Event';
import { useStyles } from '../postsManager';
import { Post, AppState } from '../../../@types/types';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import { startDeletePost } from '../../../redux/actions/userPosts';
import { connect } from 'react-redux';
import { DeletePostAction } from '../../../@types/action-types';
interface IProps {
  selectedPost: Post;
  startDeletePost: (pid: string) => Promise<DeletePostAction>;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostView: React.FC<IProps> = ({
  selectedPost,
  setEdit,
  startDeletePost,
  setSelectedPost,
}) => {
  const platformIcon = (platform: string) => {
    if (platform === 'playstation')
      return <SonyPlaystation fontSize='inherit' />;
    else if (platform === 'xbox') return <MicrosoftXbox fontSize='inherit' />;
    else if (platform === 'switch')
      return <NintendoSwitch fontSize='inherit' />;
    else return undefined;
  };
  const deletePost = async () => {
    await startDeletePost(selectedPost.pid);
    setSelectedPost(undefined);
  };
  const makeDate = () => {
    const postDate = new Date(selectedPost.createdAt._seconds * 1000);
    return `${postDate.getDate()}/${
      (postDate.getMonth() % 12) + 1
    }/${postDate.getFullYear()}`;
  };
  const imageURL: string = selectedPost.cover.replace('logo_med', '1080p');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
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
                    src={selectedPost.cover.replace('logo_med', '1080p')}
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
                onClick={() => setDeleteDialogOpen(true)}
              >
                <DeleteIcon className={classes.leftIcon} />
                Delete
              </Button>
              <Button
                color='default'
                variant='contained'
                onClick={() => setEdit(true)}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby='delete-dialog-title'
        aria-describedby='delete-dialog-description'
      >
        <DialogTitle id='delete-dialog-title'>
          {'Are you sure you want to delete this post?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deleting the post is permanent and cannot be recovered, are you sure
            you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={deletePost} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const mapDispatchToProps = {
  startDeletePost,
};
const mapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
