/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../../scss/style.scss';
import {
  Chip,
  TextField,
  Paper,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
  Typography,
  withStyles,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SearchIcon from '@material-ui/icons/Search';

import InputBase from '@material-ui/core/InputBase';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import { useHistory } from 'react-router-dom';

import axios from 'axios';
interface Game {
  cover: number;
  id: number;
  name: string;
  popularity: number;
  rating: number;
  slug: string;
  imageURL: string;
}
interface Area {
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
const Bar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [gameError, setGameError] = React.useState(false);
  const [areaError, setAreaError] = React.useState(false);
  const [options, setOptions] = React.useState<Game[]>([]);
  const [games, setGames] = React.useState<Game[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [platform, setPlatform] = React.useState('playstation');
  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
  const checkedIcon = <CheckBoxIcon fontSize='small' />;
  const handleChange = (event: any) => {
    setPlatform(event.target.value);
  };
  const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);
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
    setGameError(false);
  }, [games]);
  React.useEffect(() => {
    setAreaError(false);
  }, [areas]);

  return (
    <div className={classes.root}>
      <form
        id='search-form'
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
              <FormControl size='medium'>
                <Select
                  labelId='demo-customized-select-label'
                  id='demo-customized-select'
                  label='Platform'
                  value={platform}
                  onChange={handleChange}
                  defaultValue='playstation'
                  input={<BootstrapInput />}
                >
                  <MenuItem value={'playstation'}>
                    <SonyPlaystation fontSize='inherit' />
                    Playstation
                  </MenuItem>
                  <MenuItem value={'xbox'}>
                    <MicrosoftXbox fontSize='inherit' />
                    Xbox
                  </MenuItem>
                  <MenuItem value={'switch'}>
                    <NintendoSwitch fontSize='inherit' />
                    Switch
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={5} style={{ paddingBottom: '5px' }}>
              <Autocomplete
                multiple
                onChange={(event, games) => setGames(games)}
                id='size-small-outlined-multi'
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                size='medium'
                options={options}
                loading={loading}
                getOptionLabel={(option: Game) => option.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <img
                      src={'https://' + option.imageURL}
                      style={{
                        width: '45px',
                        marginRight: '7px',
                      }}
                    />
                    <Typography>{option.name}</Typography>
                  </React.Fragment>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='outlined'
                      label={option.name}
                      size='small'
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={gameError}
                    helperText={gameError ? 'Please choose some games.' : ''}
                    label='Search Games'
                    size='small'
                    variant='outlined'
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color='inherit' size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                multiple
                id='checkboxes-tags-demo'
                onChange={(event, areas) => setAreas(areas)}
                options={israelAreas}
                disableCloseOnSelect
                size='small'
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
                    variant='outlined'
                    label='Search Area'
                  />
                )}
              />
            </Grid>
            <IconButton type='submit'>
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
