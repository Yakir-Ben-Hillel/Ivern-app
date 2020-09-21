/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Typography,
  ListItem,
  Checkbox,
  ListItemIcon,
  makeStyles,
  AppBar,
  Paper,
  Toolbar,
  InputBase,
  IconButton,
  Button,
  Container,
} from '@material-ui/core';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { Game } from '../../../../@types/types';
interface IGameOptions {
  options: Game[];
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  open: boolean;
  setGamesDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
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
  searchRoot: {
    margin: '5px 0 2px 2px',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  progress: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    marginTop: theme.spacing(30),
  },
}));

const GamesOptionsMobile: React.FC<IGameOptions> = ({
  options,
  open,
  setOpen,
  setNames,
  setGamesDialogOpen,
  setGames,
}) => {
  const loading = open && options.length === 0;
  const classes = useStyles();
  const [checked, setChecked] = React.useState<number[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const [filteredOptions, setFilteredOptions] = React.useState<Game[]>(options);
  const listRef = React.createRef<FixedSizeList>();
  const handleClose = () => {
    setOpen(false);
    setGamesDialogOpen(false);
    setNames(
      checked.map((index) => {
        return options[index].name;
      })
    );
    setGames(
      checked.map((index) => {
        return options[index];
      })
    );
  };
  function renderRow(props: ListChildComponentProps) {
    const { index, style, data } = props;
    const game: Game = data[index];
    const gameIndex = options.indexOf(game);
    const handleCheck = () => {
      const currentIndex = checked.indexOf(gameIndex);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(gameIndex);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };
    return (
      <div>
        {game && (
          <ListItem
            alignItems='center'
            key={gameIndex}
            style={style}
            onClick={handleCheck}
            button
          >
            <ListItemIcon>
              <React.Fragment>
                <img
                  src={game.cover}
                  style={{
                    width: '35px',
                    height: '45px',
                    marginRight: '7px',
                  }}
                />
              </React.Fragment>
            </ListItemIcon>
            <Typography variant='inherit'>{game.name}</Typography>
            <Checkbox
              style={{
                position: 'absolute',
                right: 0,
                marginLeft:'3px'
              }}
              edge='end'
              onChange={handleCheck}
              checked={checked.includes(gameIndex) ? true : false}
            />
          </ListItem>
        )}
      </div>
    );
  }
  return (
    <div>
      {loading ? (
        <CircularProgress className={classes.progress} />
      ) : (
        <div>
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
                color='inherit'
                variant='h6'
                className={classes.title}
              >
                Game Picker
              </Typography>
              <Button color='inherit' onClick={handleClose}>
                Save
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth='xs'>
            <Paper component='form' className={classes.searchRoot}>
              <IconButton
                className={classes.iconButton}
                disabled={search === ''}
                aria-label='menu'
                onClick={() => {
                  setSearch('');
                  setFilteredOptions(options);
                  listRef.current?.scrollToItem(0);
                }}
              >
                <CloseIcon />
              </IconButton>
              <InputBase
                value={search}
                onChange={(event: any) => {
                  setSearch(event.target.value);
                  if (event.target.value === '') setFilteredOptions(options);
                  else
                    setFilteredOptions(
                      options.filter((game) =>
                        game.name.toLowerCase().includes(search.toLowerCase())
                      )
                    );
                    listRef.current?.scrollToItem(0);
                }}
                className={classes.input}
                placeholder='Search Games'
                inputProps={{ 'aria-label': 'search games' }}
              />
              <IconButton
                type='submit'
                className={classes.iconButton}
                aria-label='search'
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <FixedSizeList
            style={{overflowX:'hidden'}}
              ref={listRef}
              height={600}
              width='100%'
              itemData={filteredOptions}
              itemCount={options.length}
              itemSize={70}
              className={classes.root}
            >
              {renderRow}
            </FixedSizeList>
          </Container>
        </div>
      )}
    </div>
  );
};
export default GamesOptionsMobile;
