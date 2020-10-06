import {
  createStyles,
  Fab,
  makeStyles,
  Theme,
  Popper,
  Paper,
  Badge,
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, Chat, User } from '../../@types/types';
import ChatsAppBar from './utils/chatsAppBar';
import ChatsList from './utils/chatsList';
import ChatRoom from './utils/chatRoom';
import {
  handleChatOpen,
  setSelectedChat,
  setUnreadMessages,
} from '../../redux/actions/userChats';
import { firebase } from '../../firebase';

import {
  HandleChatOpenAction,
  SetSelectedChatAction,
  SetUnreadMessagesAction,
} from '../../@types/action-types';
interface IProps {
  isAuthenticated: boolean;
  user: User;
  open: boolean;
  unreadChats: number;
  chatsList: Chat[];
  selectedChat: Chat | undefined;
  setUnreadMessages: (
    unreadMessages: number,
    cid: string
  ) => SetUnreadMessagesAction;
  setSelectedChat: (chat?: Chat) => SetSelectedChatAction;
  handleChatOpen: (open: boolean) => HandleChatOpenAction;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(6),
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    typography: {
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(1),
      width: 350,
      overflow: 'auto',
      position: 'relative',
      maxWidth: 560,
      height: 455,
    },
  })
);

const ChatButton: React.FC<IProps> = ({
  isAuthenticated,
  user,
  selectedChat,
  unreadChats,
  chatsList,
  open,
  setUnreadMessages,
  handleChatOpen,
}) => {
  const database = firebase.firestore();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const id = 'simple-popper';
  const classes = useStyles();
  React.useEffect(() => {
    const unsubscribe = database.collection(`/chats`).onSnapshot((snapshot) => {
      const data = snapshot.docChanges()[0].doc.data();
      if (snapshot.docChanges()[0].type === 'modified') {
        if (data.lastMessage && user.uid === data.lastMessage.receiver) {
          const chat = chatsList.find((chat) => chat.cid === data.cid);
          if (chat) {
            setUnreadMessages(chat.unreadMessages + 1, chat.cid);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [chatsList, database, setUnreadMessages, user]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const myElement = document.getElementById(id);
    setAnchorEl(myElement);
    handleChatOpen(!open);
  };
  return (
    <div>
      {isAuthenticated && (
        <div>
          <Fab
            className={classes.fab}
            variant='extended'
            size='medium'
            id={id}
            onClick={handleClick}
          >
            <Badge
              badgeContent={unreadChats}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color='secondary'
            >
              <PeopleIcon className={classes.icon} />
            </Badge>
            Chat
          </Fab>
          <Popper open={open} anchorEl={anchorEl} placement='left-end'>
            <Paper className={classes.paper}>
              <ChatsAppBar selectedChat={selectedChat} />
              {selectedChat ? <ChatRoom /> : <ChatsList />}
            </Paper>
          </Popper>
        </div>
      )}
    </div>
  );
};
const MapDispatchToProps = {
  handleChatOpen,
  setSelectedChat,
  setUnreadMessages,
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
  user: state.userInfo.user,
  open: state.userChats.open,
  chatsList: state.userChats.chats,
  selectedChat: state.userChats.selectedChat,
  unreadChats: state.userChats.unreadChats,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatButton);
