import {
  createStyles,
  Fab,
  makeStyles,
  Theme,
  Popper,
  Paper,
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, Chat, User } from '../../@types/types';
import ChatsAppBar from './utils/chatsAppBar';
import ChatsList from './utils/chatsList';
import ChatRoom from './utils/chatRoom';
import { handleChatOpen, setSelectedChat } from '../../redux/actions/userChats';
import {
  HandleChatOpenAction,
  SetSelectedChatAction,
} from '../../@types/action-types';
interface IProps {
  isAuthenticated: boolean;
  user: User;
  open: boolean;
  chatsList: Chat[];
  selectedChat: Chat | undefined;
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
  chatsList,
  open,
  handleChatOpen,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const id = 'simple-popper';
  const classes = useStyles();

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
            <PeopleIcon className={classes.icon} />
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
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
  user: state.userInfo.user,
  open: state.userChats.open,
  chatsList: state.userChats.chats,
  selectedChat: state.userChats.selectedChat,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatButton);
