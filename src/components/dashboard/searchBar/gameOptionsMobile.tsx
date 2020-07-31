/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  Checkbox,
  ListItemIcon,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@material-ui/core';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import CloseIcon from '@material-ui/icons/Close';
import { Game } from '../searchBar';
interface IGameOptions {
  options: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  open: boolean;
  setGamesDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  games: Game[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  inline: {
    display: 'inline',
  },
}));

const GamesOptionsMobile: React.FC<IGameOptions> = ({
  options,
  open,
  setOpen,
  games,
  setGamesDialogOpen,
  setGames,
}) => {
  const loading = open && options.length === 0;
  const classes = useStyles();
  const [checked, setChecked] = React.useState<number[]>([]);

  const handleClose = () => {
    setOpen(false);
    setGamesDialogOpen(false);
  };
  function renderRow(props: ListChildComponentProps) {
    const { index, style, data } = props;
    const game = data[index];
    const labelId = `checkbox-list-secondary-label-${game.id}`;
    return (
      <ListItem alignItems="flex-start" key={index} style={style} button>
        <ListItemIcon>
          <React.Fragment>
            <img
              src={'https://' + game.imageURL}
              style={{
                width: '45px',
                marginRight: '7px',
              }}
            />
          </React.Fragment>
        </ListItemIcon>
        <Typography>{game.name}</Typography>
        {/* <ListItemSecondaryAction> */}
        <Checkbox
          style={{ alignItems: 'right', marginLeft: '8px' }}
          edge="end"
          onChange={(event, checkedIndex) => {
            console.log(checkedIndex);
            const currentIndex = checked.indexOf(index);
            const newChecked = [...checked];

            if (currentIndex === -1) {
              newChecked.push(index);
            } else {
              newChecked.splice(currentIndex, 1);
            }

            setChecked(newChecked);
          }}
          checked={checked.indexOf(index) !== -1 ? true : false}
          inputProps={{ 'aria-labelledby': labelId }}
        />
        {/* </ListItemSecondaryAction> */}
      </ListItem>
    );
  }
  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
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

          <FixedSizeList
            height={600}
            width="100%"
            itemData={options}
            itemCount={options.length}
            itemSize={80}
            className={classes.root}
          >
            {renderRow}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
};
export default GamesOptionsMobile;
