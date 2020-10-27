import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  ButtonBase,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import MessageIcon from '@material-ui/icons/Message';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { Skeleton } from '@material-ui/lab';
import {
  MicrosoftXbox,
  NintendoSwitch,
  SonyPlaystation,
} from 'mdi-material-ui';
import React from 'react';
import { AppState, Chat, Post, User } from '../../../@types/types';
import {
  startAddNewChat,
  handleChatOpen,
  setSelectedChat,
} from '../../../redux/actions/userChats';
import PostsCarousel from '../carousel';
import { useStyles } from '../postAccordion';
import { connect } from 'react-redux';
import {
  AddChatAction,
  HandleChatOpenAction,
  SetSelectedChatAction,
} from '../../../@types/action-types';
interface IProps {
  post: Post;
  openedPost: Post | null;
  user: User | null;
  clientUser: User | undefined;
  userPosts: Post[];
  chats: Chat[];
  loading: boolean;
  setOpenedPost: React.Dispatch<React.SetStateAction<Post | null>>;
  startAddNewChat: (interlocutorUID: string) => Promise<AddChatAction>;
  handleChatOpen: (open: boolean) => HandleChatOpenAction;
  setSelectedChat: (chat: Chat) => SetSelectedChatAction;
}

const PostsListDesktop: React.FC<IProps> = ({
  post,
  openedPost,
  user,
  clientUser,
  chats,
  setSelectedChat,
  startAddNewChat,
  handleChatOpen,
  userPosts,
  loading,
  setOpenedPost,
}) => {
  const handleChange = (post: Post) => () => {
    if (!openedPost || openedPost.pid !== post.pid) {
      setOpenedPost(post);
    } else {
      setOpenedPost(null);
    }
  };
  const handleChatMake = async () => {
    try {
      if (user) {
        const chat = chats.find((chat) => {
          return chat.interlocutor.uid === user.uid;
        });
        if (chat) {
          setSelectedChat(chat);
        } else {
          const ChatRes = await startAddNewChat(user.uid);
          setSelectedChat(ChatRes.chat);
        }
        handleChatOpen(true);
      }
    } catch (error) {
      console.error(error);
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
    <Accordion
      expanded={openedPost?.pid === post.pid}
      onChange={handleChange(post)}
    >
      <AccordionSummary>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt='complex' src={post.cover} />
            </ButtonBase>
          </Grid>
          <Grid item xs container>
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
                  {post.cityName}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant='subtitle1'>{`₪${post.price}.00`}</Typography>
              <Typography variant='body2' color='textSecondary'>
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
        <div style={{ width: '66.66%' }}>
          <PostsCarousel user={user} userPosts={userPosts} loading={loading} />
        </div>
        <div className={classes.helper}>
          {loading ? (
            <div>
              <Skeleton variant='circle' width={96} height={96} />
              <Skeleton width='100%' />
              <Skeleton variant='text' />
            </div>
          ) : (
            <Grid className={classes.userInfo} container direction='column'>
              <Grid item>
                <Avatar className={classes.userAvatar} src={user?.imageURL} />
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
              {user && clientUser && clientUser.uid !== user.uid && (
                <Grid item>
                  <Button
                    color='inherit'
                    className={classes.button}
                    endIcon={<MessageIcon />}
                    size='small'
                    onClick={handleChatMake}
                  >
                    Message
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
const MapDispatchToProps = {
  startAddNewChat,
  handleChatOpen,
  setSelectedChat,
};
const MapStateToProps = (state: AppState) => ({
  clientUser: state.userInfo.user,
  chats: state.userChats.chats,
});

export default connect(MapStateToProps, MapDispatchToProps)(PostsListDesktop);
