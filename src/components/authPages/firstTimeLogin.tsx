import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { firebase } from '../../firebase';
import React from 'react';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { AppState } from '../@types/types';
function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      Yakir Ben Hillel 2020
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  googleButton: {
    height: '40px',
    borderWidth: '0',
    backgroundColor: 'white',
    color: '#737373',
    borderRadius: '5px',
    whiteSpace: 'nowrap',
    boxShadow: ' 1px 1px 0px 1px rgba(0,0,0,0.05)',
    transitionProperty: 'background-color,box-shadow',
    transitionTimingFunction: 'ease-in-out',
    transitionDuration: '150ms',
    marginBottom: theme.spacing(1),
    fontSize: '14px',
    fontWeight: 'bold',
  },
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  userAvatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
interface IProps {
  user: firebase.User;
}
const FirstTimeLogin: React.FC<IProps> = ({ user }) => {
  const [displayName, setDisplayName] = React.useState(user.displayName);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (displayName === '' || phoneNumber === '')
      setErrorMessage('Please fill the required fields.');
  };
  const classes = useStyles();
  const history = useHistory();
  React.useEffect(() => {
    if (user === undefined) history.replace('/');
  });

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component='h1' variant='h5'>
          fill the information
        </Typography>
        {user.photoURL ? (
          <Avatar className={classes.userAvatar} src={user.photoURL} />
        ) : (
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
        )}

        <form onSubmit={onSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='displayName'
            disabled
            value={user.email}
          />
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='displayName'
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
            label='Display Name'
            name='displayName'
            autoComplete='DisplayName'
          />
          <TextField
            variant='outlined'
            margin='normal'
            placeholder='05 -'
            fullWidth
            itemType='number'
            name='phone Number'
            label='phone Number'
            type='Phone Number'
            id='phone'
            value={phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
            }
            autoComplete='Phone Number'
          />
          {errorMessage && (
            <Typography color='secondary'>{errorMessage}</Typography>
          )}
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};
const MapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

export default connect(MapStateToProps)(FirstTimeLogin);
