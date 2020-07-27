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
  MenuItem,
  Select,
  InputLabel,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InputBase from '@material-ui/core/InputBase';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';

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

const SearchBar = () => {
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
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Game[]>([]);
  const [platform, setPlatform] = React.useState('playstation');
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const games = await axios.get(
        'http://localhost:5000/ivern-app/europe-west3/api/games'
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
    console.log(options);
  }, [options]);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <FormControl size="medium">
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                label="Platform"
                value={platform}
                onChange={handleChange}
                defaultValue="playstation"
                input={<BootstrapInput />}
              >
                <MenuItem value={'playstation'}>
                  <SonyPlaystation fontSize="inherit" />
                  Playstation
                </MenuItem>
                <MenuItem value={'xbox'}>
                  <MicrosoftXbox fontSize="inherit" />
                  Xbox
                </MenuItem>
                <MenuItem value={'switch'}>
                  <NintendoSwitch fontSize="inherit" />
                  Switch
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={5} style={{ paddingBottom: '5px' }}>
            <Autocomplete
              multiple
              id="size-small-outlined-multi"
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              size="medium"
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
                    variant="outlined"
                    label={option.name}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Games"
                  size="small"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
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
                <TextField {...params} variant="outlined" label="Search Area" />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
export default SearchBar;

const israelAreas = [
  { name: 'תל אביב', area: 'מרכז' },
  { name: 'ראשון לציון והסביבה', area: 'מרכז' },
  { name: 'חולון- בת ים', area: 'מרכז' },
  { name: 'רמת גן- גבעתיים', area: 'מרכז' },
  { name: 'פתח תקווה והסביבה', area: 'מרכז' },
  { name: 'ראש העין והסביבה', area: 'מרכז' },
  { name: 'בקעת אונו', area: 'מרכז' },
  { name: 'רמלה- לוד', area: 'מרכז' },
  { name: 'בני ברק- גבעת שמואל', area: 'מרכז' },
  { name: 'עמק איילון', area: 'מרכז' },
  { name: 'שוהם והסביבה', area: 'מרכז' },
  { name: 'מודיעין והסביבה', area: 'מרכז' },
  { name: 'ירושלים', area: 'אזור ירושלים' },
  { name: 'בית שמש והסביבה', area: 'אזור ירושלים' },
  { name: 'הרי יהודה- מבשרת והסביבה', area: 'אזור ירושלים' },
  { name: 'מעלה אדומים והסביבה', area: 'אזור ירושלים' },
  { name: 'יהודה שומרון ובקעת הירדן', area: 'יהודה ושומרון' },
  { name: 'ישובי דרום ההר', area: 'יהודה ושומרון' },
  { name: 'ישובי השומרון', area: 'יהודה ושומרון' },
  { name: 'גוש עציון', area: 'יהודה ושומרון' },
  { name: 'בקעת הירדן וצפון ים המלח', area: 'יהודה ושומרון' },
  { name: 'אריאל וישובי יהודה', area: 'יהודה ושומרון' },
  { name: 'שפלה מישור חוף דרומי', area: 'השפלה' },
  { name: 'רחובות- נס ציונה', area: 'השפלה' },
  { name: 'אשדוד- אשקלון והסביבה', area: 'השפלה' },
  { name: 'גדרה-יבנה והסביבה', area: 'השפלה' },
  { name: 'קרית גת והסביבה', area: 'השפלה' },
  { name: 'דרום', area: 'דרום' },
  { name: 'באר שבע והסביבה', area: 'דרום' },
  { name: 'אילת והערבה', area: 'דרום' },
  { name: 'ישובי הנגב', area: 'דרום' },
  { name: 'הנגב המערבי', area: 'דרום' },
  { name: 'דרום ים המלח', area: 'דרום' },
  { name: 'צפון', area: 'דרום' },
  { name: 'חיפה והסביבה', area: 'דרום' },
  { name: 'קריות והסביבה', area: 'דרום' },
  { name: 'עכו-נהריה והסביבה', area: 'דרום' },
  { name: 'גליל עליון', area: 'דרום' },
  { name: 'הכנרת והסביבה', area: 'דרום' },
  { name: 'כרמיאל והסביבה', area: 'דרום' },
  { name: 'נצרת-שפרעם והסביבה', area: 'דרום' },
  { name: 'ראש פינה החולה', area: 'דרום' },
  { name: 'גליל תחתון', area: 'דרום' },
  { name: 'זכרון וחוף הכרמל', area: 'חדרה זכרון והעמקים' },
  { name: 'חדרה והסביבה', area: 'חדרה זכרון והעמקים' },
  { name: 'קיסריה והסביבה', area: 'חדרה זכרון והעמקים' },
  { name: 'עמק בית שאן', area: 'חדרה זכרון והעמקים' },
  { name: 'עפולה והעמקים', area: 'חדרה זכרון והעמקים' },
  { name: 'רמת מנשה', area: 'חדרה זכרון והעמקים' },
  { name: 'השרון', area: 'השרון' },
  { name: 'נתניה והסביבה', area: 'השרון' },
  { name: 'רמת השרון-הרצליה', area: 'השרון' },
  { name: 'רעננה-כפר סבא', area: 'השרון' },
  { name: 'הוד השרון והסביבה', area: 'השרון' },
  { name: 'דרום השרון', area: 'השרון' },
  { name: 'צפון השרון', area: 'השרון' },
];
