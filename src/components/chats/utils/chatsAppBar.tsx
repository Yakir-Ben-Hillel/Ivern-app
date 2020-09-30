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
import { Chat } from '../../../@types/types';
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';
import { PopupState } from 'material-ui-popup-state/core';
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
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
  popupState: PopupState;
}
const ChatsAppBar: React.FC<Props> = ({
  selectedChat,
  setSelectedChat,
  popupState,
}) => {
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
              <IconButton edge='end' onClick={() => popupState.close()}>
                <MinimizeIcon fontSize='default' />
              </IconButton>
              <IconButton
                edge='end'
                onClick={() => {
                  setSelectedChat(undefined);
                  popupState.close();
                }}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        <AppBar position='fixed'>
          <Toolbar>
            <Typography variant='h6' noWrap color='inherit'>
              CHATS
            </Typography>
          </Toolbar>
        </AppBar>
      )}
    </div>
  );
};
export default ChatsAppBar;
