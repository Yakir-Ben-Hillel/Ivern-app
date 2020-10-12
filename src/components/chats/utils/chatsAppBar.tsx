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
  SetMessagesAction,
  SetNewChatText,
  DeleteChatAction,
} from '../../../@types/action-types';
import { AppState, Chat, Message } from '../../../@types/types';
import {
  setMessages,
  handleChatOpen,
  setSelectedChat,
  setNewChatText,
  startDeleteChat,
} from '../../../redux/actions/userChats';

interface Props {
  selectedChat: Chat | undefined;
  messages: Message[] | undefined;
  startDeleteChat: (cid: string) => Promise<DeleteChatAction>;
  setSelectedChat: (chat?: Chat) => SetSelectedChatAction;
  setNewChatText: (
    data: { text: string; imageURL: string } | undefined
  ) => SetNewChatText;
  handleChatOpen: (open: boolean) => HandleChatOpenAction;
  setMessages: (messages?: Message[]) => SetMessagesAction;
}
const ChatsAppBar: React.FC<Props> = ({
  selectedChat,
  setNewChatText,
  startDeleteChat,
  setSelectedChat,
  messages,
  setMessages,
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
                  setNewChatText(undefined);
                  setMessages(undefined);
                }}
              >
                <MinimizeIcon fontSize='default' />
              </IconButton>
              <IconButton
                edge='end'
                onClick={async () => {
                  if (!messages || messages.length === 0)
                    await startDeleteChat(selectedChat.cid);
                  setSelectedChat(undefined);
                  setNewChatText(undefined);
                  setMessages(undefined);
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
  startDeleteChat,
  setNewChatText,
  setSelectedChat,
  setMessages,
};
const MapStateToProps = (state: AppState) => ({
  open: state.userChats.open,
  messages: state.userChats.selectedChatMessages,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatsAppBar);
