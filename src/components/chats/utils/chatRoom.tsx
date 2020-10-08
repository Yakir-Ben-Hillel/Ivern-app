import {
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  InputBase,
  Paper,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, User, Chat, Message } from '../../../@types/types';
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import MoodIcon from '@material-ui/icons/Mood';
import {
  startAddMessage,
  startSetMessages,
  setMessages,
  addMessage,
  loadingMessages,
} from '../../../redux/actions/userChats';
import {
  AddMessageAction,
  LoadingMessagesAction,
  SetMessagesAction,
} from '../../../@types/action-types';
import { firebase } from '../../../firebase';
interface Props {
  user: User;
  selectedChat: Chat | undefined;
  messages: Message[] | undefined;
  loading: boolean;
  setMessages: (messages?: Message[]) => SetMessagesAction;
  startAddMessage: (
    receiver: string,
    text: string,
    cid: string
  ) => Promise<AddMessageAction>;
  addMessage: (message: Message) => AddMessageAction;
  startSetMessages: (cid: string) => Promise<SetMessagesAction>;
  loadingMessages: (loadingMessages: boolean) => LoadingMessagesAction;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      height: 455,
      backgroundColor: theme.palette.background.paper,
    },
    messageList: {
      gridArea: 'messageList',
      display: 'flex',
      flexDirection: 'column',
    },
    messageRow: {
      marginBottom: '2px',
    },
    messageTextMe: {
      display: 'grid',
      marginLeft: '120px',
      padding: '9px 14px',
      fontSize: '1.6rem',
      marginBottom: '5px',
      background: '#0048AA',
      color: '#eee',
      border: '1px solid #0048AA',
      borderRadius: ' 14px 14px 0 14px',
    },
    messageTextYou: {
      display: 'grid',
      justifyItems: 'end',
      marginRight: '120px',
      padding: '9px 14px',
      fontSize: '1.6rem',
      marginBottom: '5px',
      background: '#eee',
      color: '#111',
      border: '1px solid #ddd',
      borderRadius: ' 14px 14px 14px 0',
    },
    avatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    typography: {
      padding: theme.spacing(2),
    },
    inputRoot: {
      padding: '2px 4px',
      display: 'flex',
      position: 'absolute',
      alignItems: 'center',
      borderRadius: '10px',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  })
);

const ChatRoom: React.FC<Props> = ({
  user,
  selectedChat,
  messages,
  loading,
  setMessages,
  addMessage,
  loadingMessages,
  startAddMessage,
  startSetMessages,
}) => {
  const [receivedMessage, setReceivedMessage] = React.useState<
    Message | undefined
  >();
  const [input, setInput] = React.useState('');
  const classes = useStyles();
  const database = firebase.firestore();
  React.useEffect(() => {
    const unsubscribe = database
      .collection(`/chats/${selectedChat?.cid}/messages`)
      .onSnapshot((snapshot) => {
        if (snapshot.docChanges().length === 1) {
          const data = snapshot.docChanges()[0].doc.data();
          const message: Message = {
            sender: data.sender,
            receiver: data.receiver,
            text: data.text,
            createdAt: data.createdAt,
          };
          if (message.sender === selectedChat?.interlocutor.uid)
            addMessage(message);
          setReceivedMessage(message);
        }
      });
    return () => unsubscribe();
  }, [addMessage, database, selectedChat]);
  const isMessageInEnglish = (text: string) => {
    const char = text[0].toLocaleLowerCase();
    if (char >= 'a' && char <= 'z') return true;
    else return false;
  };
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const onEmojiClick = (event: any, emojiObject: any) => {
    setChosenEmoji(emojiObject);
    setInput(input + emojiObject.emoji);
  };
  const makeTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const nowDate = new Date();
    let minutes: number;
    let hours: number;
    if (isNaN(date.getMinutes())) {
      minutes = nowDate.getMinutes();
      hours = nowDate.getHours();
    } else {
      minutes = date.getMinutes();
      hours = date.getHours();
    }
    const displayHours = hours === 0 ? '0' + hours : hours;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes}`;
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input !== '')
      if (selectedChat)
        await startAddMessage(
          selectedChat.interlocutor.uid,
          input,
          selectedChat.cid
        );
    setInput('');
  };
  React.useEffect(() => {
    (async () => {
      if (!messages && selectedChat) {
        await startSetMessages(selectedChat.cid);
        loadingMessages(false);
        inputRef.current?.scrollIntoView({ block: 'nearest' });
      } else {
        if (messages) {
          setMessages(messages);
          inputRef.current?.scrollIntoView({ block: 'nearest' });
        }
      }
    })();
  }, [
    loadingMessages,
    messages,
    receivedMessage,
    selectedChat,
    setMessages,
    startSetMessages,
  ]);
  return (
    <div className={classes.root}>
      {loading ? (
        <CircularProgress
          style={{ position: 'absolute', left: '40%', bottom: '45%' }}
          size={50}
        />
      ) : (
        <div>
          <List
            className={classes.messageList}
            style={{
              bottom:
                selectedChat?.messages?.length &&
                selectedChat?.messages?.length < 4
                  ? 0
                  : undefined,
            }}
          >
            {messages?.map((message, index) => (
              <ListItem className={classes.messageRow} key={index}>
                <ListItemText
                  style={{
                    marginTop: index === 0 ? 50 : 0,
                    direction: isMessageInEnglish(message.text) ? 'ltr' : 'rtl',
                  }}
                  className={
                    message.sender === user.uid
                      ? classes.messageTextMe
                      : classes.messageTextYou
                  }
                  primary={message.text}
                  secondaryTypographyProps={{
                    color: message.sender !== user.uid ? 'inherit' : undefined,
                    variant: 'caption',
                  }}
                  secondary={makeTime(message.createdAt._seconds)}
                />
              </ListItem>
            ))}
          </List>
          {emojiOpen && (
            <div style={{ marginLeft: '15px' }}>
              <Picker disableSearchBar onEmojiClick={onEmojiClick} />
            </div>
          )}
          <form onSubmit={onSubmit}>
            <Paper
              className={classes.inputRoot}
              style={{
                bottom:
                  !messages?.length ||
                  (messages?.length && messages?.length < 4)
                    ? 0
                    : undefined,
              }}
            >
              <IconButton
                onClick={() => setEmojiOpen(!emojiOpen)}
                className={classes.iconButton}
              >
                <MoodIcon />
              </IconButton>
              <InputBase
                ref={inputRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(event.target.value)
                }
                value={input}
                className={classes.input}
                placeholder='Type a message'
                inputProps={{ 'aria-label': 'type a message' }}
              />
              <Divider className={classes.divider} orientation='vertical' />
              <IconButton
                type='submit'
                color='primary'
                className={classes.iconButton}
                aria-label='send'
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </form>
        </div>
      )}
    </div>
  );
};
const MapDispatchToProps = {
  addMessage,
  setMessages,
  startSetMessages,
  startAddMessage,
  loadingMessages,
};
const MapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
  loading: state.userChats.loadingMessages,
  selectedChat: state.userChats.selectedChat,
  messages: state.userChats.selectedChatMessages,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatRoom);
