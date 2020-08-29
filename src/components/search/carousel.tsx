import React from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
} from '@material-ui/core';
import Carousel from 'react-multi-carousel';
import { User, Post } from '../../@types/types';
import { Skeleton } from '@material-ui/lab';
import Svg from 'react-inlinesvg';
interface IProps {
  user: User | null;
  userPosts: Post[];
  loading: boolean;
}
const PostsCarousel: React.FC<IProps> = ({ user, userPosts, loading }) => {
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
      card: {
        margin: '5px',
        height: '220px',
        maxWidth: '200px',
      },
      skeleton: {
        margin: '5px',
        height: '180px',
        width: '162px',
      },
    })
  );
  const classes = useStyles();
  return (
    <div>
      {loading ? (
        <div>
          <Typography variant="h6">More from the Seller</Typography>
          <Grid container spacing={2}>
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <Card className={classes.skeleton}>
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height="60%"
                    style={{ marginBottom: '10px' }}
                  />
                  <Skeleton width="100%" />
                </Card>
              </div>
            ))}
          </Grid>
        </div>
      ) : (
        <div>
          <Typography variant="subtitle1">
            {userPosts.length > 0
              ? 'More from the Seller'
              : 'Seems like he is still playing his other games'}
          </Typography>
          {userPosts.length > 0 ? (
            <Carousel
              additionalTransfrom={0}
              arrows
              autoPlaySpeed={3000}
              ssr
              centerMode={false}
              className=""
              containerClass="container-with-dots"
              draggable
              keyBoardControl
              minimumTouchDrag={80}
              responsive={responsive}
              showDots={false}
              sliderClass=""
              slidesToSlide={1}
              swipeable
            >
              {userPosts.map((post, index) => (
                <div key={index}>
                  <Card className={classes.card}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        alt={post.gameName}
                        height="150px"
                        width="100%"
                        image={post.artwork ? post.artwork : post.cover}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="caption">
                          {post.gameName}
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
                width="320px"
                height="300px"
                alt="User has no other games"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default PostsCarousel;
