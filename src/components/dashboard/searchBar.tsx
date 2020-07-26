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
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
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
          <Grid item xs={8}>
            <Autocomplete
              multiple
              id="size-small-outlined-multi"
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              size="small"
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
                  {option.name}
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
          <Grid item xs={4}>
            <TextField variant="outlined" />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
export default SearchBar;
