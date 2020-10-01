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
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import ChatsAppBar from './utils/chatsAppBar';
import ChatsList from './utils/chatsList';
import ChatRoom from './utils/chatRoom';
interface IProps {
  isAuthenticated: boolean;
  user: User;
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

const ChatButton: React.FC<IProps> = ({ isAuthenticated, user }) => {
  const receiverUid = 'T0AsGd126yUC6Yl3lKpn5vonsqF3';

  const [chatsList, setChatsList] = React.useState<Chat[]>([]);
  React.useEffect(() => {
    if (isAuthenticated) {
      const chats: Chat[] = [
        {
          interlocutor: user,
          messages: [
            {
              sender: user.uid,
              receiver: receiverUid,
              text: 'האם גוד אוף וור זמין',
              createdAt: { _seconds: 1000, _nanoseconds: 1000 },
            },
            {
              sender: receiverUid,
              receiver: user.uid,
              text: 'כן,עולה 60 שקל',
              createdAt: { _seconds: 1000, _nanoseconds: 1000 },
            },
            {
              sender: user.uid,
              receiver: receiverUid,
              text: '?מאיפה אתה',
              createdAt: { _seconds: 1000, _nanoseconds: 1000 },
            },
            {
              sender: receiverUid,
              receiver: user.uid,
              text: 'רחובות',
              createdAt: { _seconds: 1000, _nanoseconds: 1000 },
            },
          ],

          createdAt: { _seconds: 1000, _nanoseconds: 1000 },
        },
      ];

      setChatsList(chats);
    }
  }, [isAuthenticated, user]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | undefined>();
  const classes = useStyles();
  return (
    <div>
      {isAuthenticated && (
        <PopupState variant='popper'>
          {(popupState) => (
            <div>
              <Fab
                className={classes.fab}
                variant='extended'
                size='medium'
                {...bindToggle(popupState)}
              >
                <PeopleIcon className={classes.icon} />
                Chat
              </Fab>

              <Popper placement='left-end' {...bindPopper(popupState)}>
                <Paper className={classes.paper}>
                  <ChatsAppBar
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    popupState={popupState}
                  />
                  {selectedChat ? (
                    <ChatRoom selectedChat={selectedChat} />
                  ) : (
                    <ChatsList
                      chatsList={chatsList}
                      setSelectedChat={setSelectedChat}
                    />
                  )}
                </Paper>
              </Popper>
            </div>
          )}
        </PopupState>
      )}
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
  user: state.userInfo.user,
});
export default connect(MapStateToProps)(ChatButton);
