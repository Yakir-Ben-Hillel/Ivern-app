import '../../scss/style.scss';
import React from 'react';
import {
  Container,
  makeStyles,
  Theme,
  createStyles,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  Avatar,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import PostAppBar from './postBar';
import axios from 'axios';
import { Game, Area } from '../../@types/types';
import GamesOptions from '../dashboard/searchBar/desktop/gameOptionsDesktop';
import AreaOptions from '../dashboard/searchBar/desktop/areaOptions';
import  Alert  from '@material-ui/lab/Alert';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
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
  })
);
const AddPosts: React.FC = () => {
  const [games, setGames] = React.useState<Game[]>([]);
  const [description, setDescription] = React.useState<string>('');
  const [price, setPrice] = React.useState<string>('');
  const [sellable, setSellable] = React.useState<boolean>(true);
  const [swappable, setSwappable] = React.useState<boolean>(true);
  const [area, setArea] = React.useState<Area>();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Game[]>([]);
  const [gameError, setGameError] = React.useState(false);
  const [areaError, setAreaError] = React.useState(false);
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
            <Container maxWidth='lg'>
              <Card className={classes.paper}>
                <CardContent className={classes.card}>
                  <Grid container alignItems='center' spacing={3}>
                    <Grid item xs>
                      <GamesOptions
                        options={options}
                        setOptions={setOptions}
                        open={open}
                        size={'medium'}
                        setOpen={setOpen}
                        setGames={setGames}
                        gameError={gameError}
                      />
                      <AreaOptions
                        setArea={setArea}
                        size={'medium'}
                        normalMargin={'normal'}
                        areaError={areaError}
                      />
                      <TextField
                        variant='outlined'
                        margin='normal'
                        value={description}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setDescription(event.target.value)}
                        fullWidth
                        id='description'
                        label='Description'
                        name='description'
                      />
                      <TextField
                        variant='outlined'
                        margin='normal'
                        value={price}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (
                            /^-?\d+$/.test(event.target.value) ||
                            event.target.value === ''
                          )
                            setPrice(event.target.value);
                        }}
                        fullWidth
                        id='price'
                        label='Price'
                        name='price'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={sellable}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => setSellable(event.target.checked)}
                            name='selling'
                          />
                        }
                        label='Selling'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={swappable}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => setSwappable(event.target.checked)}
                            name='swapping'
                          />
                        }
                        label='Swapping'
                      />
                    </Grid>
                    <Grid item xs>
                      <Card>
                        <CardActionArea style={{marginBottom:'10px'}}>
                          <CardContent className={classes.cardAction}>
                            <CloudUploadOutlinedIcon fontSize='large' />
                            <Typography variant='h6' color='textSecondary'>
                              Click to upload an image
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <Alert severity='info'>
                          The game cover will be used in case a picture isn't
                          provided.
                        </Alert>
                      </Card>
                    </Grid>
                  </Grid>
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
