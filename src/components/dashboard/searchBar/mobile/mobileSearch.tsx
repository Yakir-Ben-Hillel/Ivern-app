/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Dialog,
  DialogContentText,
  DialogContent,
  Button,
  createStyles,
  Theme,
  makeStyles,
  Typography,
  AppBar,
  List,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from 'mdi-material-ui';
import GameOptionsMobile from './gameOptionsMobile';
import MobileArea from './mobileArea';
import { Game, Area } from '../../../../@types/types';
interface IGameOptions {
  options: Game[];
  games: Game[];
  area: Area | undefined;
  setOptions: React.Dispatch<React.SetStateAction<Game[]>>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  setArea: React.Dispatch<React.SetStateAction<Area | undefined>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameError: boolean;
  open: boolean;
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
  area,
  setArea,
  setGames,
  gameError,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [gamesDialogOpen, setGamesDialogOpen] = React.useState(false);
  const [areasDialogOpen, setAreasDialogOpen] = React.useState(false);
  const [names, setNames] = React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [StringOfGamesNames, setStringOfGamesNames] = React.useState<string>();
  const [platform, setPlatform] = React.useState<string>('');
  const history = useHistory();
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    setDialogOpen(false);
    setPlatform('');
  };
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
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl === null) setAnchorEl(event.currentTarget);
  };
  React.useEffect(() => {
    let namesString: string = '';
    const promise = new Promise((resolve, reject) => {
      let counter = 1;
      const length = names.length;
      names.forEach((name) => {
        if (counter !== length) namesString = namesString + `${name}, `;
        else namesString = `${namesString + name}.`;
        counter++;
      });
      resolve();
    });
    promise.then(() => setStringOfGamesNames(namesString));
  }, [names]);

  const GamesDialog: React.FC = () => (
    <Dialog open={gamesDialogOpen} fullWidth={true} fullScreen>
      <GameOptionsMobile
        options={options}
        open={open}
        setNames={setNames}
        setOpen={setOpen}
        setGames={setGames}
        setGamesDialogOpen={setGamesDialogOpen}
      />
    </Dialog>
  );
  const AreasDialog: React.FC = () => (
    <Dialog open={areasDialogOpen} fullScreen>
      <MobileArea setArea={setArea} setAreasDialogOpen={setAreasDialogOpen} />
    </Dialog>
  );
  return (
    <div className={classes.root}>
      <a
        className='button button-primary'
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        Search Games
      </a>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        fullScreen={true}
      >
        <form id='search-form' onSubmit={onSubmit}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge='start'
                color='inherit'
                onClick={handleClose}
                aria-label='close'
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant='h6'
                color='inherit'
                className={classes.title}
              >
                Search Form
              </Typography>
              <Button type='submit' color='inherit' onClick={handleClose}>
                Search
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <DialogContentText>
              Choose the games you want to search for:
            </DialogContentText>
            <List component='nav'>
              <ListItem
                button
                aria-haspopup='true'
                aria-controls='lock-menu'
                onClick={handleClick}
              >
                <ListItemText primary='Platform' secondary={platform} />
                <Menu
                  id='lock-menu'
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem
                    button
                    key='playstation'
                    selected={platform === 'Playstation'}
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                      setPlatform('Playstation');
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <SonyPlaystation color='primary' />
                      <ListItemText primary='Playstation' />
                    </ListItemIcon>
                  </MenuItem>
                  <MenuItem
                    key='xbox'
                    selected={platform === 'Xbox'}
                    onClick={() => {
                      setPlatform('Xbox');
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <MicrosoftXbox color='primary' />
                      <ListItemText primary='Xbox' />
                    </ListItemIcon>
                  </MenuItem>
                  <MenuItem
                    key='switch'
                    selected={platform === 'Switch'}
                    onClick={() => {
                      setPlatform('Switch');
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <NintendoSwitch color='primary' />
                      <ListItemText primary='Switch' />
                    </ListItemIcon>
                  </MenuItem>
                </Menu>
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  setGamesDialogOpen(true);
                  setOpen(true);
                }}
              >
                <ListItemText
                  primary='Video Games'
                  secondary={StringOfGamesNames}
                />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => setAreasDialogOpen(true)}>
                <ListItemText primary='Areas' secondary={area?.name} />
              </ListItem>
            </List>
          </DialogContent>
        </form>
      </Dialog>
      <GamesDialog />
      <AreasDialog />
    </div>
  );
};
export default MobileSearch;
