import '../../scss/style.scss';
import React from 'react';
import axios from 'axios';
import PrimarySearchBar from '../navbar';
import {
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  Avatar,
  Typography,
  Container,
  Button,
  TextField,
} from '@material-ui/core';
import { User, AppState } from '../../@types/types';
import { isNumber } from 'util';
import { useHistory } from 'react-router';
import { Skeleton } from '@material-ui/lab';
import { UpdateUserAction } from '../../@types/action-types';
import { startUpdateUser } from '../../redux/actions/userInfo';
import { connect } from 'react-redux';
interface IProps {
  user: User;
  startUpdateUser: (data: {
    displayName: string;
    phoneNumber: string;
    imageURL: string;
  }) => Promise<UpdateUserAction>;
}

const UserInfo: React.FC<IProps> = ({ user, startUpdateUser }) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      avatar: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        margin: 'auto',
      },
      input: {
        display: 'none',
      },
      progress: {
        margin: theme.spacing(1),
      },
      skeleton: {
        margin: theme.spacing(1.5),
      },
    })
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const [displayName, setDisplayName] = React.useState(user.displayName);
  const [imageURL, setImageURL] = React.useState(user.imageURL);
  const [phoneNumber, setPhoneNumber] = React.useState(user.phoneNumber);
  const [errorMessage, setErrorMessage] = React.useState('');
  const classes = useStyles();
  const history = useHistory();
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (displayName === '' || phoneNumber === '')
      setErrorMessage('Please fill the required fields.');
    else {
      if (phoneNumber[3] !== '-')
        setPhoneNumber(phoneNumber?.slice(0, 3) + '-' + phoneNumber?.slice(3));
      await startUpdateUser({
        displayName,
        phoneNumber,
        imageURL,
      });
      history.goBack();
    }
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
  return (
    <div>
      <PrimarySearchBar />
      <div className="is-boxed has-animations">
        <div className="body-wrap boxed-container">
          <div className={classes.root}>
            <Container maxWidth="md">
              <Grid container spacing={3}>
                <Grid item xs>
                  <Card className={classes.paper}>
                    <CardContent>
                      {loading ? (
                        <div>
                          <Skeleton
                            className={classes.avatar}
                            variant="circle"
                          />
                          <Skeleton
                            variant="text"
                            width="20%"
                            style={{ margin: 'auto' }}
                          />
                        </div>
                      ) : (
                        <div>
                          <Avatar className={classes.avatar} src={imageURL} />
                          <Typography variant="h6">
                            {user?.displayName}
                          </Typography>
                          <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            type="file"
                            onChange={imageUpload}
                          />
                          <label htmlFor="contained-button-file">
                            <Button color="primary" component="span">
                              Upload Image
                            </Button>
                          </label>
                        </div>
                      )}
                      {loading ? (
                        <div>
                          <Grid item xs>
                            {[0, 1, 2, 3].map((index) => (
                              <div key={index}>
                                <Skeleton
                                  className={classes.skeleton}
                                  variant="rect"
                                  width={700}
                                  height={50}
                                />
                              </div>
                            ))}
                          </Grid>
                        </div>
                      ) : (
                        <form onSubmit={onSubmit}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="displayName"
                            disabled
                            value={user?.email}
                            label="Email"
                            name="email"
                          />
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="displayName"
                            value={displayName}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setDisplayName(e.target.value)}
                            label="Display Name"
                            name="displayName"
                            autoComplete="DisplayName"
                          />
                          <TextField
                            variant="outlined"
                            margin="normal"
                            placeholder="05 -"
                            fullWidth
                            itemType="number"
                            name="Phone Number"
                            label="Phone Number"
                            type="Phone Number"
                            id="phone"
                            value={phoneNumber}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              if (
                                (isNumber(e.target.value) ||
                                  e.target.value === '') &&
                                e.target.value.length <= 10
                              )
                                setPhoneNumber(e.target.value);
                            }}
                            autoComplete="Phone Number"
                          />
                          {errorMessage && (
                            <Typography color="secondary">
                              {errorMessage}
                            </Typography>
                          )}
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                          >
                            Save
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapDispatchToProps = {
  startUpdateUser,
};

const mapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
});
export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
