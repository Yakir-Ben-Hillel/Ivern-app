import {
  AppBar,
  Avatar,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import React from 'react';
import { connect } from 'react-redux';
import {
  HandleChatOpenAction,
  SetSelectedChatAction,
} from '../../../@types/action-types';
import { AppState, Chat } from '../../../@types/types';
import {
  handleChatOpen,
  setSelectedChat,
} from '../../../redux/actions/userChats';

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
                onClick={() => {
                  handleChatOpen(false);
                }}
              >
                <MinimizeIcon fontSize='default' />
              </IconButton>
              <IconButton
                edge='end'
                onClick={() => {
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
