import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { UpdateUserAction } from '../../@types/action-types';
import { AppState, User } from '../../@types/types';
import { startUpdateUser } from '../../redux/actions/userInfo';
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
  root: {
    display: 'flex',
    flexDirection: 'column',
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
  badge: {
    width: 22,
    height: 22,
    alignSelf: 'flex-end',
  },
  input: {
    display: 'none',
  },
  progress: {
    margin: theme.spacing(1),
  },
}));
interface IProps {
  user: User;
  startUpdateUser: (data: {
    displayName: string;
    phoneNumber: string;
    imageURL: string;
  }) => Promise<UpdateUserAction>;
}
const FirstTimeLogin: React.FC<IProps> = ({ user, startUpdateUser }) => {
  const [displayName, setDisplayName] = React.useState(user.displayName);
  const [imageURL, setImageURL] = React.useState(user.imageURL);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const isNumber = (n: string) => {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  };
  const imageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();
      const newFile = event.target.files[0];
      formData.append('image', newFile);
      setLoading(true);
      const res = await axios.post(
        'https://europe-west3-ivern-app.cloudfunctions.net/api/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setImageURL(res.data.imageURL);
      setLoading(false);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (displayName === '' || phoneNumber === '')
      setErrorMessage('Please fill the required fields.');
    else {
      if (phoneNumber[3] !== '-')
        setPhoneNumber(phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3));
      await startUpdateUser({
        displayName,
        phoneNumber,
        imageURL,
      });
      history.replace('/');
    }
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
        {imageURL ? (
          <div className={classes.root}>
            <input
              accept='image/*'
              className={classes.input}
              id='contained-button-file'
              type='file'
              onChange={imageUpload}
            />
            <label htmlFor='contained-button-file'>
              {loading ? (
                <CircularProgress size={80} className={classes.progress} />
              ) : (
                <Button disableRipple component='span'>
                  <Avatar className={classes.userAvatar} src={imageURL} />
                  <AddAPhotoIcon className={classes.badge} />
                </Button>
              )}
            </label>
          </div>
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
            name='Phone Number'
            label='Phone Number'
            type='Phone Number'
            id='phone'
            value={phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (
                (isNumber(e.target.value) || e.target.value === '') &&
                e.target.value.length <= 10
              )
                setPhoneNumber(e.target.value);
            }}
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
const mapDispatchToProps = {
  startUpdateUser,
};

const mapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(FirstTimeLogin);
