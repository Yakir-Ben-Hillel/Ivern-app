import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import isMobile from 'is-mobile';
import {
  MicrosoftXbox,
  NintendoSwitch,
  SonyPlaystation,
} from 'mdi-material-ui';
import React from 'react';
import Svg from 'react-inlinesvg';
import Carousel from 'react-multi-carousel';
import { connect } from 'react-redux';
import {
  AddChatAction,
  HandleChatOpenAction,
  SetSelectedChatAction,
  SetNewChatText,
} from '../../@types/action-types';
import { AppState, Chat, Post, User } from '../../@types/types';
import {
  setSelectedChat,
  setNewChatText,
  startAddNewChat,
  handleChatOpen,
} from '../../redux/actions/userChats';
interface IProps {
  user: User | null;
  clientUser: User;
  userPosts: Post[];
  loading: boolean;
  chats: Chat[];
  startAddNewChat: (interlocutorUID: string) => Promise<AddChatAction>;
  handleChatOpen: (open: boolean) => HandleChatOpenAction;
  setSelectedChat: (chat: Chat) => SetSelectedChatAction;
  setNewChatText: (
    data: { text: string; imageURL: string } | undefined
  ) => SetNewChatText;
}

const PostsCarousel: React.FC<IProps> = ({
  user,
  clientUser,
  userPosts,
  loading,
  chats,
  setSelectedChat,
  setNewChatText,
  startAddNewChat,
  handleChatOpen,
}) => {
  const platformIcon = (platform: string) => {
    if (platform === 'playstation')
      return <SonyPlaystation fontSize='inherit' />;
    else if (platform === 'xbox') return <MicrosoftXbox fontSize='inherit' />;
    else if (platform === 'switch')
      return <NintendoSwitch fontSize='inherit' />;
    else return undefined;
  };

  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 3,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      cardDesktop: {
        margin: '5px',
        height: '220px',
        maxWidth: '200px',
      },
      skeletonDesktop: {
        margin: '5px',
        height: '180px',
        width: '162px',
      },
      cardMobile: {
        margin: 'auto',
        maxWidth: theme.spacing(30),
      },
      caption: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(7),
      },
    })
  );
  const handleChatMake = async (post: Post) => {
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
        const text = `Hi is ${post.gameName} still available?`;
        setNewChatText({ text, imageURL: post.cover });
        handleChatOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const classes = useStyles();
  const mobile = isMobile();
  const skeletonMapping = [0, 1, 2];
  return (
    <div>
      {loading ? (
        <div>
          <Grid container alignContent='center' spacing={2}>
            {!mobile &&
              skeletonMapping.map((index) => (
                <div key={index}>
                  <Card className={classes.skeletonDesktop}>
                    <Skeleton
                      variant='rect'
                      width='100%'
                      height='60%'
                      style={{ marginBottom: '10px', margin: 'auto' }}
                    />
                    <Skeleton width='100%' />
                  </Card>
                </div>
              ))}
          </Grid>
        </div>
      ) : (
        <div>
          {mobile ? (
            <Typography className={classes.caption} variant='body2'>
              {'More from the Seller'}
            </Typography>
          ) : (
            <Typography variant='h6'>
              {userPosts.length > 0
                ? 'More from the Seller'
                : 'No other posts to show'}
            </Typography>
          )}
          {userPosts.length > 0 ? (
            <Carousel
              arrows
              autoPlay={mobile}
              autoPlaySpeed={2500}
              infinite={userPosts.length > 1}
              ssr
              centerMode={false}
              containerClass='container-with-dots'
              draggable
              keyBoardControl
              minimumTouchDrag={80}
              responsive={responsive}
              showDots={false}
              slidesToSlide={1}
              swipeable
            >
              {userPosts.map((post, index) => (
                <div key={index}>
                  <Card
                    className={
                      mobile ? classes.cardMobile : classes.cardDesktop
                    }
                  >
                    <CardActionArea
                      onClick={() => {
                        if (user?.uid !== clientUser.uid) handleChatMake(post);
                      }}
                    >
                      <CardMedia
                        component='img'
                        alt={post.gameName}
                        height='150px'
                        width='100%'
                        image={post.artwork ? post.artwork : post.cover}
                      />
                      <CardContent>
                        <Typography gutterBottom variant='caption'>
                          {platformIcon(post.platform)}
                          {` ${post.gameName}`}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </div>
              ))}
            </Carousel>
          ) : (
            <div>
              <Svg
                style={{ margin: 'auto' }}
                src={require('../dashboard/dist/images/gaming-animated.svg')}
                width='320px'
                height='300px'
                alt='User has no other games'
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const MapDispatchToProps = {
  startAddNewChat,
  handleChatOpen,
  setSelectedChat,
  setNewChatText,
};
const MapStateToProps = (state: AppState) => ({
  chats: state.userChats.chats,
  clientUser: state.userInfo.user,
});

export default connect(MapStateToProps, MapDispatchToProps)(PostsCarousel);
