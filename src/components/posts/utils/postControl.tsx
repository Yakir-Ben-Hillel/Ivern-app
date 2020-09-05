import React from 'react';
import { Grid, Card, CardContent } from '@material-ui/core';
import AddPostCard from './addPostCard';
import axios from 'axios';
import { Game, Area, Post, AppState } from '../../../@types/types';
import AddPostFields from './addPostFields';
import {
  startAddPost,
  startUpdatePost,
} from '../../../redux/actions/userPosts';
import { useStyles } from '../postsManager';
import { connect } from 'react-redux';
import { AddPostAction, UpdatePostAction } from '../../../@types/action-types';
interface IProps {
  selectedPost: Post | undefined;
  postsList: Post[];
  startUpdatePost: (
    pid: string,
    updateData: {
      area: string;
      exchange: boolean;
      sell: boolean;
      cover: string | undefined;
      price: string;
      description: string;
      platform: 'playstation' | 'xbox' | 'switch';
    }
  ) => Promise<UpdatePostAction>;
  startAddPost: (reqPost: {
    gameName: string;
    gid: string;
    artwork: string | null;
    cover: string;
    area: string;
    sell: boolean;
    exchange: boolean;
    description: string;
    platform: 'playstation' | 'xbox' | 'switch';
    price: string;
  }) => Promise<AddPostAction>;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
}

const PostControl: React.FC<IProps> = ({
  startAddPost,
  startUpdatePost,
  selectedPost,
  setSelectedPost,
  setEdit,
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
  const [imageURL, setImageURL] = React.useState<string>('');
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
      setImageURL(selectedPost.cover);
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
      if (selectedPost) {
        if ((game || edit) && area && description !== '' && price !== '') {
          if (!edit && game) {
            const addPostData = {
              gameName: game.name,
              gid: game.id.toString(),
              artwork: game.artwork,
              cover: imageURL !== '' ? imageURL : `https://${game.cover}`,
              area: area.id.toString(),
              sell: sellable,
              exchange: swappable,
              description,
              platform,
              price,
            };
            await startAddPost(addPostData);
          } else {
            const updatePostData = {
              area: area.id.toString(),
              exchange: swappable,
              sell: sellable,
              cover: imageURL,
              price,
              description,
              platform,
            };
            const res = await startUpdatePost(selectedPost.pid, updatePostData);
            setSelectedPost(res.post);
            setEdit(false);
          }
        }
      }
      return postsList;
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
            <Grid container alignItems="center" spacing={3}>
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
const mapDispatchToProps = {
  startAddPost,
  startUpdatePost,
};
const mapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(PostControl);
