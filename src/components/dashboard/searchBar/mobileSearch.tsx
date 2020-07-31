/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  createStyles,
  Theme,
  makeStyles,
  Typography,
  AppBar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
  IconButton,
  ButtonGroup,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import { IGameOptions } from './gameOptions';
import GameOptions from './gameOptions';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      paddingRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

const MobileSearch: React.FC<IGameOptions> = ({
  options,
  setOptions,
  open,
  setOpen,
  games,
  setGames,
  gameError,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [gamesDialogOpen, setGamesDialogOpen] = React.useState(false);
  const [names, setNames] = React.useState<string>('');
  const [platform, setPlatform] = React.useState<string>('');
  const handleClose = () => {
    setOpen(false);
    setDialogOpen(false);
    setPlatform('');
  };
  React.useEffect(() => {
    const arr = games?.map((game) => {
      return game.name;
    });
    let gamesNames: string = '';
    arr?.forEach((game) => (gamesNames = gamesNames + game));
    console.log(gamesNames);
    setNames((names) => {
      if (games?.length === 0) return '';
      else if (names === '') return gamesNames;
      else return names + ', ' + gamesNames;
    });
  }, [games]);
  const GamesDialog: React.FC = () => (
    <Dialog
      open={gamesDialogOpen}
      fullWidth={true}
      onClose={() => {
        setOpen(false);
        setGamesDialogOpen(false);
      }}
    >
      <GameOptions
        open={open}
        setOpen={setOpen}
        options={options}
        setOptions={setOptions}
        setGames={setGames}
        gameError={gameError}
      />
    </Dialog>
  );
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <a
        className="button button-primary"
        onClick={() => {
          setDialogOpen(true);
          setOpen(true);
        }}
      >
        Explore
      </a>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen={true}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Search
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Search
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <DialogContentText>
            Choose the games you want to search for:
          </DialogContentText>
          <List>
            <ListItem button>
              <ListItemText primary="Platform" secondary={platform} />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                setGamesDialogOpen(true);
                setOpen(true);
              }}
            >
              <ListItemText primary="Video Games" secondary={names} />
            </ListItem>
          </List>
          <ButtonGroup
            className={classes.margin}
            size="medium"
            aria-label="medium outlined button group"
          >
            <Button
              onClick={() => setPlatform('playstation')}
              variant={platform === 'playstation' ? 'contained' : undefined}
            >
              <SonyPlaystation color="primary" />
              <Typography color="primary">Plays..</Typography>
            </Button>
            <Button
              onClick={() => setPlatform('xbox')}
              variant={platform === 'xbox' ? 'contained' : undefined}
            >
              <MicrosoftXbox color="primary" />
              <Typography color="primary">Xbox</Typography>
            </Button>
            <Button
              onClick={() => setPlatform('switch')}
              variant={platform === 'switch' ? 'contained' : undefined}
            >
              <NintendoSwitch color="primary" />
              <Typography color="primary">Switch</Typography>
            </Button>
          </ButtonGroup>
        </DialogContent>
        <DialogActions className={classes.margin}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
      <GamesDialog />
    </div>
  );
};
export default MobileSearch;
