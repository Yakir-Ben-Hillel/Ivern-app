import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button, Avatar, Tooltip } from '@material-ui/core';
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
  HeartOutline,
  History,
} from 'mdi-material-ui';
import { firebase } from '../firebase';
import { useHistory } from 'react-router';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  })
);

export default function PrimarySearchAppBar() {
  const signedInUser = firebase.auth().currentUser;
  React.useEffect(() => {
    if (signedInUser) {
      (async () => {
        const user = await axios.get(
          `https://europe-west3-ivern-app.cloudfunctions.net/api/user/${signedInUser.uid}`
        );
        setPhotoURL(user.data.imageURL);
      })();
    }
  }, [signedInUser]);
  const classes = useStyles();
  const history = useHistory();
  const [photoURL, setPhotoURL] = React.useState<string | null>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const menuId = 'primary-search-account-menu';
  const renderMenuSigned = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => history.push('/user')}>המשתמש שלי</MenuItem>
      <MenuItem onClick={() => history.push('/user/post')}>צור פוסט</MenuItem>
      <MenuItem
        onClick={async () => {
          await firebase.auth().signOut();
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }}
      >
        התנתק
      </MenuItem>
    </Menu>
  );
  const renderMenuUnsigned = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => history.push({ pathname: '/login' })}>
        התחבר
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='primary'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='primary'
        >
          {photoURL ? (
            <Tooltip
              title={signedInUser?.displayName ? signedInUser.displayName : ''}
            >
              <Avatar src={photoURL} alt={'google photo'} />
            </Tooltip>
          ) : (
            <div>{signedInUser ? <CircularProgress /> : <AccountCircle />}</div>
          )}
        </IconButton>
        <p>הפרופיל שלי</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position='static' color='transparent'>
        <Toolbar variant='dense'>
          <IconButton edge='start' color='primary' aria-label='open drawer'>
            <MenuIcon />
          </IconButton>
          <IconButton aria-label='saved' color='primary'>
            <HeartOutline />
          </IconButton>

          <IconButton
            aria-label='history'
            color='primary'
            className={classes.menuButton}
          >
            <History />
          </IconButton>

          <Typography
            className={classes.title}
            color='primary'
            variant='h6'
            noWrap
          >
            Ivern
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button
              color='primary'
              startIcon={<SonyPlaystation />}
              onClick={() =>
                console.log('I clicked on the playstation button!')
              }
            >
              Playstation
            </Button>
            <Button color='primary' startIcon={<MicrosoftXbox />}>
              Xbox
            </Button>
            <Button color='primary' startIcon={<NintendoSwitch />}>
              Switch
            </Button>

            <IconButton aria-label='show 17 new notifications' color='primary'>
              <Badge badgeContent={17} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='primary'
            >
              {photoURL ? (
                <Tooltip
                  title={
                    signedInUser?.displayName ? signedInUser.displayName : ''
                  }
                >
                  <Avatar src={photoURL} alt={'google photo'} />
                </Tooltip>
              ) : (
                <div>
                  {signedInUser ? <CircularProgress /> : <AccountCircle />}
                </div>
              )}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='playstation'
              aria-controls={mobileMenuId}
              color='primary'
            >
              <SonyPlaystation />
            </IconButton>

            <IconButton
              aria-label='xbox'
              aria-controls={mobileMenuId}
              color='primary'
            >
              <MicrosoftXbox />
            </IconButton>
            <IconButton
              aria-label='switch'
              aria-controls={mobileMenuId}
              color='primary'
            >
              <NintendoSwitch />
            </IconButton>

            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='primary'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {firebase.auth().currentUser ? renderMenuSigned : renderMenuUnsigned}
    </div>
  );
}
