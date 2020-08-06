import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import { Area } from '../../searchBar';
import { israelAreas } from '../desktop/areaOptions';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  ListSubheader,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    hebrew: {
      display: 'flex',
      direction: 'rtl',
    },
  })
);
interface IProps {
  setArea: React.Dispatch<React.SetStateAction<Area | undefined>>;
  setAreasDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const MobileArea: React.FC<IProps> = ({ setArea, setAreasDialogOpen }) => {
  const classes = useStyles();
  const groupByZone = (list: Area[], keyGetter: (key: Area) => string) => {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  };
  const handleClose = () => {
    setAreasDialogOpen(false);
  };
  const printLists = (area: Area) => {
    const labelId = `checkbox-list-label-${area.id}`;

    return (
      <ListItem
        key={area.id}
        role={undefined}
        dense
        button
        onClick={() => {
          setArea(area);
          setAreasDialogOpen(false);
        }}
        style={{ display: 'flex' }}
      >
        <ListItemText className={classes.hebrew} id={labelId} primary={area.name} />
      </ListItem>
    );
  };
  const zones = groupByZone(israelAreas, (area) => area.area);
  return (
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
          <Typography color='inherit' variant='h6' className={classes.title}>
            Areas Picker
          </Typography>
          <Button color='inherit' onClick={handleClose}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        <List className={classes.root}>
          <ListSubheader className={classes.hebrew}>
            דרום
          </ListSubheader>
          {zones.get('דרום').map(printLists)}
          <ListSubheader className={classes.hebrew}>
            מרכז
          </ListSubheader>
          {zones.get('מרכז').map(printLists)}
          <ListSubheader className={classes.hebrew}>
            השפלה
          </ListSubheader>
          {zones.get('השפלה').map(printLists)}
          <ListSubheader className={classes.hebrew}>
            אזור ירושלים
          </ListSubheader>
          {zones.get('אזור ירושלים').map(printLists)}
          <ListSubheader className={classes.hebrew}>
            השרון
          </ListSubheader>
          {zones.get('השרון').map(printLists)}
          <ListSubheader className={classes.hebrew}>
            חדרה זכרון והעמקים
          </ListSubheader>
          {zones.get('חדרה זכרון והעמקים').map(printLists)}
          <ListSubheader className={classes.hebrew}>
            צפון
          </ListSubheader>
          {zones.get('צפון').map(printLists)}
        </List>
      </div>
    </div>
  );
};
export default MobileArea;
