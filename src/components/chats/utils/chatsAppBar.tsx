import React from 'react';
import {
  AppBar,
  createStyles,
  makeStyles,
  Theme,
  Avatar,
  Grid,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import { AppState, Chat } from '../../../@types/types';
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';
import {
  HandleChatOpenAction,
  SetSelectedChatAction,
} from '../../../@types/action-types';
import {
  handleChatOpen,
  setSelectedChat,
} from '../../../redux/actions/userChats';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    toolbar: theme.mixins.toolbar,
    cover: {
      marginRight: theme.spacing(1),
    },
  })
);
interface Props {
  selectedChat: Chat | undefined;
  setSelectedChat: (chat?: Chat) => SetSelectedChatAction;
  handleChatOpen: (open: boolean) => HandleChatOpenAction;
}
const ChatsAppBar: React.FC<Props> = ({
  selectedChat,
  setSelectedChat,
  handleChatOpen,
}) => {
  // eslint-disable-next-line
  const classes = useStyles();
  return (
    <div>
      {selectedChat ? (
        <div>
          <AppBar position='fixed' color='inherit'>
            <Toolbar variant='dense'>
              <Grid container spacing={2}>
                <Avatar
                  style={{ margin: 'auto' }}
                  src={selectedChat.interlocutor.imageURL}
                />
                <Grid item xs>
                  <Typography variant='body2'>
                    {selectedChat.interlocutor.displayName}
                  </Typography>
                  <Typography variant='caption'>
                    {selectedChat.interlocutor.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
              <IconButton
                edge='end'
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  handleChatOpen(false);
                }}
              >
                <MinimizeIcon fontSize='default' />
              </IconButton>
              <IconButton
                edge='end'
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  setSelectedChat(undefined);
                  handleChatOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        <AppBar position='fixed'>
          <Toolbar variant='dense'>
            <Typography variant='h6' color='inherit'>
              CHATS
            </Typography>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};
const MapDispatchToProps = {
  handleChatOpen,
  setSelectedChat,
};
const MapStateToProps = (state: AppState) => ({
  open: state.userChats.open,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatsAppBar);
