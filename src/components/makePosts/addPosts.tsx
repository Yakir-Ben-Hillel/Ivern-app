import '../../scss/style.scss';
import React from 'react';
import {
  Container,
  makeStyles,
  Theme,
  createStyles,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import AddPostCard from './utils/addPostCard';
import { firebase } from '../../firebase';
import PostAppBar from './utils/postBar';
import axios from 'axios';
import { Game, Area, Post } from '../../@types/types';
import AddPostFields from './utils/addPostFields';
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
      width: theme.spacing(12),
      height: theme.spacing(12),
      margin: 'auto',
    },
    button: {
      margin: theme.spacing(2),
      marginTop: theme.spacing(3),
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

const AddPosts: React.FC = () => {
  const [game, setGame] = React.useState<Game | null>(null);
  const [postsList, setPostsList] = React.useState<Post[]>([]);
  const [area, setArea] = React.useState<Area>();
  const [platform, setPlatform] = React.useState<
    'playstation' | 'xbox' | 'switch'
  >('playstation');
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<string>('');
  const [imageURL, setImageURL] = React.useState<string | undefined>();
  const [sellable, setSellable] = React.useState<boolean>(true);
  const [swappable, setSwappable] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Game[]>([]);
  const [priceError, setPriceError] = React.useState<boolean>(false);
  const [gameError, setGameError] = React.useState(false);
  const [areaError, setAreaError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState<boolean>(
    false
  );
  const gamesLoading = open && options.length === 0;
  const classes = useStyles();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!game) setGameError(true);
      if (!area) setAreaError(true);
      if (description === '') setDescriptionError(true);
      if (price === '') setPriceError(true);
      if (game && area && description !== '' && price !== '') {
        const idToken = await firebase.auth().currentUser?.getIdToken();
        const res = await axios.post(
          'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/add',
          {
            gameName: game.name,
            gid: game.id,
            artwork: game.artwork,
            cover: imageURL ? imageURL : game.cover,
            area: area.id,
            sell: sellable,
            exchange: swappable,
            description,
            platform,
            price,
          },
          {
            headers: {
              authorization: `Bearer ${idToken}`,
            },
          }
        );
        console.log(res);
        if (res.status === 200) {
          const post: Post = res.data.data;
          setPostsList([...postsList, post]);
          return postsList;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  React.useEffect(() => {
    let active = true;

    if (!gamesLoading) {
      return undefined;
    }

    (async () => {
      const games = await axios.get(
        'https://europe-west3-ivern-app.cloudfunctions.net/api/games'
      );
      if (active) {
        setOptions(games.data.games);
      }
    })();
    return () => {
      active = false;
    };
  }, [gamesLoading]);

  return (
    <div>
      <PostAppBar postsList={postsList} />
      <div className='is-boxed has-animations'>
        <div className='body-wrap boxed-container'>
          <div className={classes.root}>
            <Container maxWidth='lg'>
              <Card className={classes.paper}>
                <CardContent className={classes.card}>
                  <form onSubmit={onSubmit}>
                    <Grid container alignItems='center' spacing={3}>
                      <Grid item xs>
                        <AddPostFields
                          open={open}
                          gamesLoading={gamesLoading}
                          options={options}
                          platform={platform}
                          price={price}
                          description={description}
                          sellable={sellable}
                          setSellable={setSellable}
                          setSwappable={setSwappable}
                          swappable={swappable}
                          setArea={setArea}
                          setDescription={setDescription}
                          setGame={setGame}
                          setOpen={setOpen}
                          setPlatform={setPlatform}
                          setPrice={setPrice}
                          gameError={gameError}
                          areaError={areaError}
                          priceError={priceError}
                          descriptionError={descriptionError}
                        />
                      </Grid>
                      <Grid item xs>
                        <AddPostCard
                          imageURL={imageURL}
                          setImageURL={setImageURL}
                        />
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddPosts;
