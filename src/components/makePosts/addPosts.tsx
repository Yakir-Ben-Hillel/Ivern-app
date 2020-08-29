import '../../scss/style.scss';
import React from 'react';
import {
  Container,
  makeStyles,
  Theme,
  createStyles,
  Grid,
  TextField,
} from '@material-ui/core';
import PostAppBar from './postBar';
import axios from 'axios';
import { Game, Area } from '../../@types/types';
import GamesOptions from '../dashboard/searchBar/desktop/gameOptionsDesktop';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      backgroundColor: theme.palette.background.default,
      flexGrow: 1,
    },
    form: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
);
const AddPosts: React.FC = () => {
  const [games, setGames] = React.useState<Game[]>([]);
  const [area, setArea] = React.useState<Area>();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Game[]>([]);
  const [gameError, setGameError] = React.useState(false);
  const loading = open && options.length === 0;
  const classes = useStyles();
  React.useEffect(() => {
    let active = true;

    if (!loading) {
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
  }, [loading]);

  return (
    <div>
      <PostAppBar />
      <div className='is-boxed has-animations'>
        <div className='body-wrap boxed-container'>
          <div className={classes.root}>
            <Container maxWidth='md'>
              <Grid container spacing={3}>
                <Grid className={classes.form} xs>
                  <GamesOptions
                    options={options}
                    setOptions={setOptions}
                    open={open}
                    setOpen={setOpen}
                    setGames={setGames}
                    gameError={gameError}
                  />
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddPosts;
