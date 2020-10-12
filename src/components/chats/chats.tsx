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
  setChats,
  startAddNewExistingChat,
  setUnreadChats,
} from '../../redux/actions/userChats';
import { firebase } from '../../firebase';
import {
  HandleChatOpenAction,
  SetChatsAction,
  SetSelectedChatAction,
  SetUnreadMessagesAction,
  SetUnreadChatsAction,
  AddChatAction,
} from '../../@types/action-types';
interface IProps {
  isAuthenticated: boolean;
  user: User;
  open: boolean;
  unreadChats: number;
  chatsList: Chat[];
  selectedChat: Chat | undefined;
  setChats: (chats: Chat[]) => SetChatsAction;
  setUnreadMessages: (
    unreadMessages: number,
    cid: string
  ) => SetUnreadMessagesAction;
  startAddNewExistingChat: (cid: string) => Promise<AddChatAction>;
  setUnreadChats: (unreadChats: number) => SetUnreadChatsAction;
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
  setChats,
  setUnreadMessages,
  startAddNewExistingChat,
  setUnreadChats,
  handleChatOpen,
}) => {
  const database = firebase.firestore();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const id = 'simple-popper';
  const classes = useStyles();
  React.useEffect(() => {
    chatsList.forEach((chat) => {
      const img = new Image();
      img.src = chat.interlocutor.imageURL;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (user) {
      const unsubscribe = database
        .collection(`/chats`)
        .where('participants', 'array-contains', user.uid)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'modified') {
              const data = change.doc.data();
              if (data.lastMessage && user.uid === data.lastMessage.receiver) {
                const chat = chatsList.find((chat) => chat.cid === data.cid);
                //chat is the current data at the client.
                if (chat) {
                  const index = chatsList.findIndex(
                    (chat) => chat.cid === data.cid
                  );
                  chat.lastMessage = data.lastMessage;
                  const newChats = chatsList;
                  //Put the chat at the top of the chats list.
                  if (index !== 0) {
                    newChats.splice(index, 1);
                    newChats.unshift(chat);
                  }
                  if (selectedChat?.cid !== chat.cid) {
                    if (chat.unreadMessages === 0)
                      setUnreadChats(unreadChats + 1);
                    setUnreadMessages(chat.unreadMessages + 1, chat.cid);
                  }
                  setChats(newChats);
                } else {
                  //Got a message from  a new chat.
                  await startAddNewExistingChat(data.cid);
                }
              }
            }
          });
        });
      return () => unsubscribe();
    }
  }, [
    chatsList,
    database,
    selectedChat,
    setChats,
    setUnreadChats,
    setUnreadMessages,
    startAddNewExistingChat,
    unreadChats,
    user,
  ]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const myElement = document.getElementById(id);
    setAnchorEl(myElement);
    handleChatOpen(!open);
  };
  React.useEffect(() => {
    const myElement = document.getElementById(id);
    setAnchorEl(myElement);
  }, [open]);
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
  startAddNewExistingChat,
  setChats,
  setUnreadMessages,
  setUnreadChats,
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
