import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import { Area } from '../searchBar';
import { israelAreas } from './areaOptions';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
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
  })
);
interface IProps {
  areas: Area[];
  setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
  setAreasDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const MobileArea: React.FC<IProps> = ({
  areas,
  setAreas,
  setAreasDialogOpen,
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState<number[]>([]);
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
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handleClose = () => {
    setAreasDialogOpen(false);
    setAreas(
      checked.map((index) => {
        return areas[index];
      })
    );
  };
  const zones = groupByZone(israelAreas, (area) => area.area);
  return (
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
          <Typography color="inherit" variant="h6" className={classes.title}>
            Areas Picker
          </Typography>
          <Button color="inherit" onClick={handleClose}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        <List className={classes.root}>
          {zones.get('מרכז').map((area: Area) => {
            const labelId = `checkbox-list-label-${area.id}`;

            return (
              <ListItem
                key={area.id}
                role={undefined}
                dense
                button
                onClick={handleToggle(area.id)}
                style={{ display: 'flex' }}
              >
                <ListItemIcon aria-label="comments">
                  <Checkbox
                    edge="end"
                    checked={checked.indexOf(area.id) !== -1}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemSecondaryAction>
                  <ListItemText id={labelId} primary={area.name} />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
};
export default MobileArea;
