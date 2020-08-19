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
} from '@material-ui/core';
import Carousel from 'react-multi-carousel';

const PostsCarousel: React.FC = () => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      card: {
        margin: '5px',
        height: '220px',
        maxWidth: '200px',
      },
    })
  );
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
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h6">More from the Seller</Typography>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        ssr
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        responsive={responsive}
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="150px"
              width="100%"
              image="https://images.igdb.com/igdb/image/upload/t_1080p/ar6zu.jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="caption">
                The Last Of Us: Part II
              </Typography>
            </CardContent>
          </CardActionArea>
          {/* <CardActions>
        <Button size="small" color="primary">
          Send Message
        </Button>
      </CardActions> */}
        </Card>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="150px"
              width="100%"
              image="https://images.igdb.com/igdb/image/upload/t_1080p/rwznddfodf1x5mmj8zva.jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="caption">
                The Witcher 3: Wild Hunt
              </Typography>
            </CardContent>
          </CardActionArea>
          {/* <CardActions>
        <Button size="small" color="primary">
          Send Message
        </Button>
      </CardActions> */}
        </Card>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="150px"
              width="100%"
              image="https://images.igdb.com/igdb/image/upload/t_1080p/vpr6s4gboxxmnhkdmqdg.jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography display="block" align="center" variant="caption">
                God of War
              </Typography>
            </CardContent>
          </CardActionArea>
          {/* <CardActions>
        <Button size="small" color="primary">
          Send Message
        </Button>
      </CardActions> */}
        </Card>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="150px"
              width="100%"
              image="https://images.igdb.com/igdb/image/upload/t_1080p/ar6i6.jpg"
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="caption">
                The Elder Scrolls V: Skyrim Special Edition
              </Typography>
            </CardContent>
          </CardActionArea>
          {/* <CardActions>
        <Button size="small" color="primary">
          Send Message
        </Button>
      </CardActions> */}
        </Card>
      </Carousel>
    </div>
  );
};
export default PostsCarousel;
