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
import { Post, User } from '../../@types/types';
interface IProps {
  user: User | null;
  userPosts: Post[];
  loading: boolean;
}

const PostsCarousel: React.FC<IProps> = ({ user, userPosts, loading }) => {
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
                    <CardActionArea>
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
                    {/* <CardActions>
        <Button size="small" color="primary">
          Send Message
        </Button>
      </CardActions> */}
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
export default PostsCarousel;
