/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../scss/style.scss';
import {
  Paper,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import PlatformSelect from './searchBar/desktop/bootstrapInput';
import GamesOptions from './searchBar/desktop/gameOptionsDesktop';
import AreaOptions from './searchBar/desktop/areaOptions';
import MobileSearch from './searchBar/mobile/mobileSearch';
import { Area, Game } from '../../@types/types';
import isMobile from 'is-mobile';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

const SearchBar: React.FC = () => {
  return (
    <section className='cta section'>
      <div className='container-sm'>
        <div className='cta-inner section-inner'>
          <div className='cta-header text-center'>
            <h2 className='section-title mt-0'>Get it and Switch</h2>
            <p className='section-paragraph'>
              Lorem ipsum is common placeholder text used to demonstrate the
              graphic elements of a document or visual presentation.
            </p>
            <div className='cta-cta'>
              <Bar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export const Bar: React.FC = () => {
  const [gameError, setGameError] = React.useState(false);
  const [areaError, setAreaError] = React.useState(false);
  const [platform, setPlatform] = React.useState('playstation');
  const [options, setOptions] = React.useState<Game[]>([]);
  const [games, setGames] = React.useState<Game[]>([]);
  const [area, setArea] = React.useState<Area>();
  const [open, setOpen] = React.useState(false);
  const loading = open && options.length === 0;
  const classes = useStyles();
  const history = useHistory();
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (games.length > 0 && area) {
      const queryParams = new URLSearchParams();
      games.forEach((game) => queryParams.append('game', `${game.id}`));
      queryParams.append('area', `${area.id}`);
      history.push({
        pathname: '/search',
        search: '?' + queryParams,
      });
    } else {
      if (games.length === 0) setGameError(true);
      if (area) setAreaError(true);
    }
  };
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

  React.useEffect(() => {
    setAreaError(false);
  }, [area]);

  return (
    <div className={classes.root}>
      {!isMobile() ? (
        <form id='search-form' onSubmit={onSubmit}>
          <Paper className={classes.paper}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <PlatformSelect platform={platform} setPlatform={setPlatform} />
              </Grid>
              <Grid item sm={5} style={{ paddingBottom: '5px' }}>
                <GamesOptions
                  options={options}
                  setOptions={setOptions}
                  open={open}
                  setOpen={setOpen}
                  setGames={setGames}
                  gameError={gameError}
                />
              </Grid>
              <Grid item xs={4}>
                <AreaOptions setArea={setArea} areaError={areaError} />
              </Grid>
              <IconButton type='submit'>
                <SearchIcon />
              </IconButton>
            </Grid>
          </Paper>
        </form>
      ) : (
        <MobileSearch
          options={options}
          setOptions={setOptions}
          open={open}
          area={area}
          setArea={setArea}
          setOpen={setOpen}
          games={games}
          setGames={setGames}
          gameError={gameError}
        />
      )}
    </div>
  );
};
export default SearchBar;
