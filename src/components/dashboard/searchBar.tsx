/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../scss/style.scss';
import {
  TextField,
  Paper,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SearchIcon from '@material-ui/icons/Search';

import { useHistory } from 'react-router-dom';

import axios from 'axios';
import PlatformSelect from './searchBar/bootstrapInput';
import GamesOptions from './searchBar/gameOptions';
export interface Game {
  cover: number;
  id: number;
  name: string;
  popularity: number;
  rating: number;
  slug: string;
  imageURL: string;
}
export interface Area {
  name: string;
  area: string;
  id: number;
}
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
    <section className="cta section">
      <div className="container-sm">
        <div className="cta-inner section-inner">
          <div className="cta-header text-center">
            <h2 className="section-title mt-0">Get it and Switch</h2>
            <p className="section-paragraph">
              Lorem ipsum is common placeholder text used to demonstrate the
              graphic elements of a document or visual presentation.
            </p>
            <div className="cta-cta">
              <Bar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const Bar: React.FC = () => {
  const [gameError, setGameError] = React.useState(false);
  const [areaError, setAreaError] = React.useState(false);
  const [platform, setPlatform] = React.useState('playstation');
  const [options, setOptions] = React.useState<Game[]>([]);
  const [games, setGames] = React.useState<Game[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [open, setOpen] = React.useState(false);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const loading = open && options.length === 0;
  const classes = useStyles();
  const history = useHistory();
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
  }, [areas]);

  return (
    <div className={classes.root}>
      <form
        id="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (games.length > 0 && areas.length > 0) {
            const queryParams = new URLSearchParams();
            games.forEach((game) => queryParams.append('game', `${game.id}`));
            areas.forEach((area) => queryParams.append('area', `${area.id}`));
            history.push({
              pathname: '/search',
              search: '?' + queryParams,
            });
          } else {
            if (games.length === 0) setGameError(true);
            if (areas.length === 0) setAreaError(true);
          }
        }}
      >
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
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                onChange={(event, areas) => setAreas(areas)}
                options={israelAreas}
                disableCloseOnSelect
                size="small"
                groupBy={(option) => option.area}
                getOptionLabel={(option) => option.name}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    <Typography>{option.name}</Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={areaError}
                    helperText={areaError ? 'Please choose some areas.' : ''}
                    variant="outlined"
                    label="Search Area"
                  />
                )}
              />
            </Grid>
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </Grid>
        </Paper>
      </form>
    </div>
  );
};
export default SearchBar;

const israelAreas: Area[] = [
  { name: 'תל אביב', area: 'מרכז', id: 1 },
  { name: 'ראשון לציון והסביבה', area: 'מרכז', id: 2 },
  { name: 'חולון- בת ים', area: 'מרכז', id: 3 },
  { name: 'רמת גן- גבעתיים', area: 'מרכז', id: 4 },
  { name: 'פתח תקווה והסביבה', area: 'מרכז', id: 5 },
  { name: 'ראש העין והסביבה', area: 'מרכז', id: 6 },
  { name: 'בקעת אונו', area: 'מרכז', id: 7 },
  { name: 'רמלה- לוד', area: 'מרכז', id: 8 },
  { name: 'בני ברק- גבעת שמואל', area: 'מרכז', id: 9 },
  { name: 'עמק איילון', area: 'מרכז', id: 10 },
  { name: 'שוהם והסביבה', area: 'מרכז', id: 11 },
  { name: 'מודיעין והסביבה', area: 'מרכז', id: 12 },
  { name: 'ירושלים', area: 'אזור ירושלים', id: 13 },
  { name: 'בית שמש והסביבה', area: 'אזור ירושלים', id: 14 },
  { name: 'הרי יהודה- מבשרת והסביבה', area: 'אזור ירושלים', id: 15 },
  { name: 'מעלה אדומים והסביבה', area: 'אזור ירושלים', id: 16 },
  { name: 'יהודה שומרון ובקעת הירדן', area: 'יהודה ושומרון', id: 17 },
  { name: 'ישובי דרום ההר', area: 'יהודה ושומרון', id: 18 },
  { name: 'ישובי השומרון', area: 'יהודה ושומרון', id: 19 },
  { name: 'גוש עציון', area: 'יהודה ושומרון', id: 20 },
  { name: 'בקעת הירדן וצפון ים המלח', area: 'יהודה ושומרון', id: 21 },
  { name: 'אריאל וישובי יהודה', area: 'יהודה ושומרון', id: 22 },
  { name: 'שפלה מישור חוף דרומי', area: 'השפלה', id: 23 },
  { name: 'רחובות- נס ציונה', area: 'השפלה', id: 24 },
  { name: 'אשדוד- אשקלון והסביבה', area: 'השפלה', id: 25 },
  { name: 'גדרה-יבנה והסביבה', area: 'השפלה', id: 26 },
  { name: 'קרית גת והסביבה', area: 'השפלה', id: 27 },
  { name: 'דרום', area: 'דרום', id: 28 },
  { name: 'באר שבע והסביבה', area: 'דרום', id: 29 },
  { name: 'אילת והערבה', area: 'דרום', id: 30 },
  { name: 'ישובי הנגב', area: 'דרום', id: 31 },
  { name: 'הנגב המערבי', area: 'דרום', id: 32 },
  { name: 'דרום ים המלח', area: 'דרום', id: 33 },
  { name: 'צפון', area: 'דרום', id: 34 },
  { name: 'חיפה והסביבה', area: 'דרום', id: 35 },
  { name: 'קריות והסביבה', area: 'דרום', id: 36 },
  { name: 'עכו-נהריה והסביבה', area: 'דרום', id: 37 },
  { name: 'גליל עליון', area: 'דרום', id: 38 },
  { name: 'הכנרת והסביבה', area: 'דרום', id: 39 },
  { name: 'כרמיאל והסביבה', area: 'דרום', id: 40 },
  { name: 'נצרת-שפרעם והסביבה', area: 'דרום', id: 41 },
  { name: 'ראש פינה החולה', area: 'דרום', id: 42 },
  { name: 'גליל תחתון', area: 'דרום', id: 43 },
  { name: 'זכרון וחוף הכרמל', area: 'חדרה זכרון והעמקים', id: 44 },
  { name: 'חדרה והסביבה', area: 'חדרה זכרון והעמקים', id: 45 },
  { name: 'קיסריה והסביבה', area: 'חדרה זכרון והעמקים', id: 46 },
  { name: 'עמק בית שאן', area: 'חדרה זכרון והעמקים', id: 47 },
  { name: 'עפולה והעמקים', area: 'חדרה זכרון והעמקים', id: 48 },
  { name: 'רמת מנשה', area: 'חדרה זכרון והעמקים', id: 49 },
  { name: 'השרון', area: 'השרון', id: 50 },
  { name: 'נתניה והסביבה', area: 'השרון', id: 51 },
  { name: 'רמת השרון-הרצליה', area: 'השרון', id: 52 },
  { name: 'רעננה-כפר סבא', area: 'השרון', id: 53 },
  { name: 'הוד השרון והסביבה', area: 'השרון', id: 54 },
  { name: 'דרום השרון', area: 'השרון', id: 55 },
  { name: 'צפון השרון', area: 'השרון', id: 56 },
];
