/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  createStyles,
  Theme,
  makeStyles,
  Typography,
  ButtonGroup,
} from '@material-ui/core';
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
  })
);

const MobileSearch: React.FC<IGameOptions> = ({
  options,
  setOptions,
  open,
  setOpen,
  setGames,
  gameError,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [platform, setPlatform] = React.useState<string>('');
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <a
        className='button button-primary'
        onClick={() => {
          setDialogOpen(true);
          setOpen(true);
        }}
      >
        Explore
      </a>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setOpen(false);
          setDialogOpen(false);
          setPlatform('');
        }}
        aria-labelledby='form-dialog-title'
        fullScreen={true}
      >
        <DialogTitle id='form-dialog-title'>Search</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the games you want to search for:
          </DialogContentText>
          <ButtonGroup
            className={classes.margin}
            size='medium'
            aria-label='medium outlined button group'
          >
            <Button
              onClick={() => setPlatform('playstation')}
              variant={platform === 'playstation' ? 'contained' : undefined}
            >
              <SonyPlaystation color='primary' />
              <Typography color='primary'>Plays..</Typography>
            </Button>
            <Button
              onClick={() => setPlatform('xbox')}
              variant={platform === 'xbox' ? 'contained' : undefined}
            >
              <MicrosoftXbox color='primary' />
              <Typography color='primary'>Xbox</Typography>
            </Button>
            <Button
              onClick={() => setPlatform('switch')}
              variant={platform === 'switch' ? 'contained' : undefined}
            >
              <NintendoSwitch color='primary' />
              <Typography color='primary'>Switch</Typography>
            </Button>
          </ButtonGroup>
          <GameOptions
            open={open}
            setOpen={setOpen}
            options={options}
            setOptions={setOptions}
            setGames={setGames}
            gameError={gameError}
          />
        </DialogContent>
        <DialogActions className={classes.margin}>
          <Button
            onClick={() => {
              setOpen(false);
              setDialogOpen(false);
              setPlatform('');
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setDialogOpen(false);
              setPlatform('');
            }}
            color='primary'
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default MobileSearch;
