import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { firebase, googleAuthProvider } from "../../firebase";
import React from "react";
import { useHistory } from "react-router";
import GoogleSignInButton from "./buttons/googleSignIn";
import axios from "axios";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Yakir Ben Hillel 2020
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  googleButton: {
    height: "40px",
    borderWidth: "0",
    backgroundColor: "white",
    color: "#737373",
    borderRadius: "5px",
    whiteSpace: "nowrap",
    boxShadow: " 1px 1px 0px 1px rgba(0,0,0,0.05)",
    transitionProperty: "background-color,box-shadow",
    transitionTimingFunction: "ease-in-out",
    transitionDuration: "150ms",
    marginBottom: theme.spacing(1),
    fontSize: "14px",
    fontWeight: "bold",
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const Login: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const whichMessageToShow = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        setErrorMessage("The email address is invalid.");
        break;
      case "auth/user-not-found":
        setErrorMessage("The user does not exist, please Sign Up to proceed.");
        break;
      case "auth/wrong-password":
        setErrorMessage(
          "The password is invalid or the user signed in with Google."
        );
        break;
    }
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        whichMessageToShow(error.code);
      });
  };
  const classes = useStyles();
  const history = useHistory();
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
      const res = await axios.post(
        "https://europe-west3-ivern-app.cloudfunctions.net/api/signup/google",
        userInfo
      );
      if (res.data.isNew) history.replace("/login/confirm");
      else history.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {errorMessage && (
              <Typography color="secondary">{errorMessage}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
          <Button
            className={classes.googleButton}
            onClick={googleSignIn}
            fullWidth
          >
            <GoogleSignInButton />
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </div>
  );
};
export default Login;
