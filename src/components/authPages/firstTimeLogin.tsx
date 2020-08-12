import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { firebase, googleAuthProvider } from '../../firebase';
import React from 'react';
import { useHistory } from 'react-router';
import MaskedInput from 'react-text-mask';
import axios from 'axios';
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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
interface IProps {
  user: firebase.auth.UserCredential;
}
const FirstTimeLogin: React.FC<IProps> = ({ user }) => {
  const [displayName, setDisplayName] = React.useState(user.user?.displayName);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const whichMessageToShow = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        setErrorMessage('The email address is invalid.');
        break;
      case 'auth/user-not-found':
        setErrorMessage('The user does not exist, please Sign Up to proceed.');
        break;
      case 'auth/wrong-password':
        setErrorMessage(
          'The password is invalid or the user signed in with Google.'
        );
        break;
    }
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .catch((error) => {
    //     whichMessageToShow(error.code);
    //   });
  };
  const classes = useStyles();
  const history = useHistory();
  React.useEffect(() => {
    if (user === undefined) history.replace('/');
  });

  const googleSignIn = async () => {
    try {
      const data = await firebase.auth().signInWithPopup(googleAuthProvider);
      const userInfo = {
        email: data.user?.email,
        displayName: data.user?.displayName,
        phoneNumber: data.user?.phoneNumber,
        imageURL: data.user?.photoURL,
        uid: data.user?.uid,
      };
      await axios.post(
        'https://europe-west3-ivern-app.cloudfunctions.net/api/signup/google',
        userInfo
      );
      history.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        {user.user?.photoURL ? (
          <Avatar className={classes.avatar} src={user.user?.photoURL} />
        ) : (
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
        )}

        <Typography component='h1' variant='h5'>
          Complete the Signup Process
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='displayName'
            disabled
            value={user.user?.email}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
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
          <MaskedInput
            mask={[
              '(',
              /[1-9]/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              /\d/,
              /\d/,
            ]}
          />
          <TextField
            variant='outlined'
            margin='normal'
            placeholder='05 -'
            required
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
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
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
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};
export default FirstTimeLogin;
