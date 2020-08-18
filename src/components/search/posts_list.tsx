import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import clsx from "clsx";
import {
  SonyPlaystation,
  MicrosoftXbox,
  NintendoSwitch,
} from "mdi-material-ui";
import { israelAreas } from "../dashboard/searchBar/desktop/areaOptions";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Avatar,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";
import "react-alice-carousel/lib/alice-carousel.css";
import { Post, User } from "../@types/types";
interface IProps {
  posts: Post[] | undefined;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      margin: "auto",
      maxWidth: 800,
    },
    image: {
      width: 100,
      height: 100,
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    icon: {
      verticalAlign: "bottom",
      height: 20,
      width: 20,
    },
    pager: {
      display: "flex",
      justifyContent: "center",
    },
    details: {
      alignItems: "center",
    },
    column: {
      flexBasis: "75%",
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    userInfo: {
      alignContent: "center",
    },
    userAvatar: {
      margin: "auto",
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  })
);
const PostsList: React.FC<IProps> = ({ posts }) => {
  const [expandedPost, setExpandedPost] = React.useState<string>("");
  const [openedPostUID, setOpenedPostUID] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<User | null>(null);
  const handleChange = (post: Post) => () => {
    if (expandedPost === "" || expandedPost !== post.pid) {
      setExpandedPost(post.pid);
      setOpenedPostUID(post.uid);
    } else {
      setExpandedPost("");
    }
  };
  React.useEffect(() => {
    let active = true;
    if (expandedPost === "") {
      return undefined;
    }

    (async () => {
      setLoading(true);
      const user = await axios.get(
        `https://europe-west3-ivern-app.cloudfunctions.net/api/user/${openedPostUID}`
      );
      if (active) {
        setUser(user.data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line
  }, [expandedPost]);
  const platformIcon = (platform: string) => {
    if (platform === "playstation")
      return <SonyPlaystation fontSize="inherit" />;
    else if (platform === "xbox") return <MicrosoftXbox fontSize="inherit" />;
    else if (platform === "switch")
      return <NintendoSwitch fontSize="inherit" />;
    else return undefined;
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {posts?.map((post) => (
        <div key={post.pid} className={classes.paper}>
          <Accordion
            expanded={expandedPost === post.pid}
            onChange={handleChange(post)}
          >
            <AccordionSummary>
              <Grid container spacing={2}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <img
                      className={classes.img}
                      alt="complex"
                      src={post.imageURL}
                    />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="row" spacing={2}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subtitle1">
                        {platformIcon(post.platform)}
                        {` ${post.gameName}`}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {post.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {israelAreas[parseInt(post.area) - 1].name}
                      </Typography>
                    </Grid>
                    {/* <Grid item sm>
                      <Typography variant="body2" style={{ cursor: "pointer" }}>
                        Remove
                      </Typography>
                    </Grid> */}
                  </Grid>
                  <Grid item direction="column" spacing={2}>
                    <Typography variant="subtitle1">{`₪${post.price}.00`}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated Today
                    </Typography>
                    <Grid
                      item
                      xs
                      style={{
                        position: "relative",
                        float: "right",
                        top: "25px",
                      }}
                      spacing={1}
                    >
                      {post.sell && (
                        <Tooltip title="sellable" arrow>
                          <AttachMoneyIcon fontSize="inherit" />
                        </Tooltip>
                      )}
                      {post.exchange && (
                        <Tooltip title="swappable" arrow>
                          <SwapHorizIcon fontSize="inherit" />
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.column}>
                <Typography variant="caption">{post.description}</Typography>
                <Carousel width="500px" thumbWidth={0} autoPlay>
                  <div>
                    <img src="https://images.igdb.com/igdb/image/upload/t_1080p/oh8a5shtmdbqx73cv765.jpg" />
                  </div>
                  <div>
                    <img src="https://images.igdb.com/igdb/image/upload/t_1080p/rqr5dxxw97zikyhdn2tq.jpg" />
                    <p className="legend">{post.gameName}</p>
                  </div>
                </Carousel>
              </div>
              <div className={clsx(classes.column, classes.helper)}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid
                    className={classes.userInfo}
                    container
                    direction="column"
                  >
                    <Grid item>
                      <Avatar
                        className={classes.userAvatar}
                        src={user?.imageURL}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" color="textSecondary">
                        <PersonIcon fontSize="small" />
                        {user?.displayName}
                      </Typography>
                    </Grid>
                    <Divider />
                    <Grid item>
                      <Typography variant="caption" color="textSecondary">
                        <PhoneIcon fontSize="small" />
                        {user?.phoneNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
      <Paper className={classes.pager}>
        <Pagination
          count={posts ? Math.ceil(posts.length / 8) : undefined}
          size="large"
        />
      </Paper>
    </div>
  );
};
export default PostsList;
