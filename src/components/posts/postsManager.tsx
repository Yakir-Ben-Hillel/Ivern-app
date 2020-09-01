import '../../scss/style.scss';
import React from 'react';
import PostAppBar from './utils/postBar';
import { Container, makeStyles, Theme, createStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { AppState, Post, User } from '../../@types/types';
import AddPosts from './utils/addPosts';
import PostView from './utils/postView';
interface IProps {
  user: User;
  loading: boolean;
}
const drawerWidth = 190;
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      backgroundColor: theme.palette.background.default,
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
      marginTop: theme.spacing(12),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    card: {
      width: '100%',
    },
    cardAction: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 'auto',
      height: '300px',
      border: `3px dashed ${theme.palette.divider} `,
    },
    avatar: {
      width: theme.spacing(18),
      height: theme.spacing(18),
      margin: 'auto',
      marginTop: '-85px',
      marginBottom: '5px',
    },
    button: {
      margin: theme.spacing(1),
      marginTop: theme.spacing(2),
      float: 'right',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
  })
);

const PostManager: React.FC<IProps> = ({ user, loading }) => {
  const [postsList, setPostsList] = React.useState<Post[]>(user.posts);
  const [selectedPost, setSelectedPost] = React.useState<Post>();
  const classes = useStyles();
  return (
    <div>
      <PostAppBar postsList={postsList} setSelectedPost={setSelectedPost} />
      <div className='is-boxed has-animations'>
        <div className='body-wrap boxed-container'>
          <div className={classes.root}>
            <Container maxWidth='lg'>
              {selectedPost ? (
                <PostView selectedPost={selectedPost} />
              ) : (
                <AddPosts postsList={postsList} setPostsList={setPostsList} />
              )}
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  loading: state.auth.loading,
});

export default connect(MapStateToProps)(PostManager);
