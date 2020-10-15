import { Avatar, Button, ButtonBase, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  MicrosoftXbox,
  NintendoSwitch,
  SonyPlaystation,
} from 'mdi-material-ui';
import React from 'react';
import Svg from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { AppState, User } from '../@types/types';
import { firebase } from '../firebase';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'flex',
      marginLeft: theme.spacing(1),
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
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
interface IProps {
  user: User;
  loading: boolean;
}
const PrimarySearchAppBar: React.FC<IProps> = ({ user, loading }) => {
  const classes = useStyles();
  const history = useHistory();
  const [imageURL, setImageURL] = React.useState<string | null>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  React.useEffect(() => {
    if (user) {
      setImageURL(user.imageURL);
    }
  }, [user]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePlatformClick = (platform: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append('platform', platform);
    history.push({
      pathname: '/search',
      search: '?' + queryParams,
    });
    if (history.location.pathname === '/search') window.location.reload();
  };
  const menuId = 'primary-account-menu';
  const renderMenuSigned = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      dir='rtl'
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => history.push('/user')}>המשתמש שלי</MenuItem>
      <MenuItem onClick={() => history.push('/user/post')}>נהל פוסטים</MenuItem>
      <MenuItem
        onClick={async () => {
          await firebase.auth().signOut();
          window.location.reload();
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

  return (
    <div className={classes.grow}>
      <AppBar position='static' elevation={0} color='transparent'>
        <Toolbar variant='dense'>
          <ButtonBase onClick={() => history.push('/')}>
            <Svg
              className='header-logo-image asset-light'
              src={require('../components/dashboard/dist/images/logo-light.svg')}
            />
            <Typography className={classes.title} color='primary' variant='h5'>
              {'Ivern'}
            </Typography>
          </ButtonBase>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button
              color='primary'
              onClick={() => handlePlatformClick('playstation')}
              startIcon={<SonyPlaystation />}
            >
              Playstation
            </Button>
            <Button
              color='primary'
              onClick={() => handlePlatformClick('xbox')}
              startIcon={<MicrosoftXbox />}
            >
              Xbox
            </Button>
            <Button
              color='primary'
              onClick={() => handlePlatformClick('switch')}
              startIcon={<NintendoSwitch />}
            >
              Switch
            </Button>

            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='primary'
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <div>
                  {imageURL ? (
                    <Tooltip title={user.displayName ? user.displayName : ''}>
                      <Avatar src={imageURL} alt={'photo'} />
                    </Tooltip>
                  ) : (
                    <AccountCircle />
                  )}
                </div>
              )}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='playstation'
              onClick={() => handlePlatformClick('playstation')}
              aria-controls={mobileMenuId}
              color='primary'
            >
              <SonyPlaystation />
            </IconButton>

            <IconButton
              aria-label='xbox'
              aria-controls={mobileMenuId}
              onClick={() => handlePlatformClick('xbox')}
              color='primary'
            >
              <MicrosoftXbox />
            </IconButton>
            <IconButton
              aria-label='switch'
              aria-controls={mobileMenuId}
              onClick={() => handlePlatformClick('switch')}
              color='primary'
            >
              <NintendoSwitch />
            </IconButton>

            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='primary'
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <div>
                  {imageURL ? (
                    <Tooltip title={user.displayName ? user.displayName : ''}>
                      <Avatar src={imageURL} alt={'google photo'} />
                    </Tooltip>
                  ) : (
                    <AccountCircle />
                  )}
                </div>
              )}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {firebase.auth().currentUser ? renderMenuSigned : renderMenuUnsigned}
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
  loading: state.userInfo.loading,
});

export default connect(MapStateToProps)(PrimarySearchAppBar);
