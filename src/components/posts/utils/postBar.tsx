import {
  AppBar,
  createStyles,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Post } from '../../../@types/types';
const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    cover: {
      marginRight: theme.spacing(1),
    },
  })
);
interface Props {
  postsList: Post[];
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}
const PostAppBar: React.FC<Props> = ({
  postsList,
  setSelectedPost,
  setEdit,
  window,
}) => {
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const theme = useTheme();
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setEdit(false);
    setSelectedIndex(index);
    if (index !== postsList.length) setSelectedPost(postsList[index]);
    else setSelectedPost(undefined);
  };
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {postsList.map((post, index) => (
          <ListItem
            key={index}
            onClick={(event) => handleListItemClick(event, index)}
            selected={selectedIndex === index}
            button
          >
            <img
              className={classes.cover}
              width='40px'
              height='50px'
              src={post.cover}
              alt='game cover'
            />
            <ListItemText primary={post.gameName} />
          </ListItem>
        ))}
        <ListItem
          button
          selected={selectedIndex === postsList.length}
          onClick={(event) => handleListItemClick(event, postsList.length)}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary='New Post' />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap color='inherit'>
            Posts Manager
          </Typography>
        </Toolbar>
      </AppBar>{' '}
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};
export default PostAppBar;
