import React from 'react';
import { Grid, Card, CardContent } from '@material-ui/core';
import AddPostCard from './addPostCard';
import { firebase } from '../../../firebase';
import axios from 'axios';
import { Game, Area, Post } from '../../../@types/types';
import AddPostFields from './addPostFields';
import { useStyles } from '../postsManager';
interface IProps {
  selectedPost: Post | undefined;
  postsList: Post[];
  setPostsList: React.Dispatch<React.SetStateAction<Post[]>>;
  edit: boolean;
}

const PostControl: React.FC<IProps> = ({
  selectedPost,
  setPostsList,
  postsList,
  edit,
}) => {
  const [game, setGame] = React.useState<Game | null>(null);
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
  React.useEffect(() => {
    if (edit && selectedPost) {
      setDescription(selectedPost.description);
      setPrice(selectedPost.price.toString());
      setSellable(selectedPost.sell);
      setSwappable(selectedPost.exchange);
      // setArea(selectedPost)
      //setImageURL(selectedPost.cover);
    }
  }, [edit, selectedPost]);
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
        if (!edit) {
          const res = await axios.post(
            'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/add',
            {
              gameName: game.name,
              gid: game.id.toString(),
              artwork: game.artwork,
              cover: imageURL ? imageURL : `https://${game.cover}`,
              area: area.id.toString(),
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
          const post: Post = res.data.data;
          setPostsList([...postsList, post]);
          setSelectedPost(post);
          return postsList;
        } else {
          const res = await axios.post(
            `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/edit/${selectedPost?.pid}`,
            {
              exchange: swappable,
              sell: sellable,
              price: price,
              platform: platform,
              area: area,
              cover: imageURL,
            },
            {
              headers: {
                authorization: `Bearer ${idToken}`,
              },
            }
          );
          console.log(res.data);
          const updatedPosts: Post[] = postsList.map((post) => {
            if (post.pid === res.data.post.pid)
              return { ...post, ...res.data.data };
          });
          setPostsList(updatedPosts);
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
      <Card className={classes.paper}>
        <CardContent className={classes.card}>
          <form onSubmit={onSubmit}>
            <Grid container alignItems='center' spacing={3}>
              <Grid item xs>
                <AddPostFields
                  edit={edit}
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
                <AddPostCard imageURL={imageURL} setImageURL={setImageURL} />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default PostControl;
