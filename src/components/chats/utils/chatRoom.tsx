import {
  CircularProgress,
  createStyles,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import MoodIcon from '@material-ui/icons/Mood';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import isMobile from 'is-mobile';
import React from 'react';
import { connect } from 'react-redux';
import {
  AddMessageAction,
  LoadingMessagesAction,
  SetMessagesAction,
} from '../../../@types/action-types';
import { AppState, Chat, Message, User } from '../../../@types/types';
import { firebase } from '../../../firebase';
import {
  addMessage,
  loadingMessages,
  setMessages,
  startAddMessage,
  startSetMessages,
} from '../../../redux/actions/userChats';
interface Props {
  user: User;
  selectedChat: Chat | undefined;
  messages: Message[] | undefined;
  loading: boolean;
  setMessages: (messages?: Message[]) => SetMessagesAction;
  startAddMessage: (
    receiver: string,
    text: string,
    cid: string,
    imageURL?: string
  ) => Promise<AddMessageAction>;
  addMessage: (message: Message) => AddMessageAction;
  startSetMessages: (cid: string) => Promise<SetMessagesAction>;
  loadingMessages: (loadingMessages: boolean) => LoadingMessagesAction;
  givenMessage?: { text: string; imageURL: string };
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
      wordBreak: 'break-word',
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
      wordBreak: 'break-word',
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
      marginRight: theme.spacing(1),
      position: 'absolute',
      alignItems: 'center',
      borderRadius: '10px',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    upload: {
      display: 'none',
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
export const makeTime = (seconds: number) => {
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
  givenMessage,
}) => {
  const [receivedMessage, setReceivedMessage] = React.useState<
    Message | undefined
  >();
  const [input, setInput] = React.useState(
    givenMessage ? givenMessage.text : ''
  );
  const [imageURL, setImageURL] = React.useState(
    givenMessage ? givenMessage.imageURL : undefined
  );
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = React.useState(false);
  // eslint-disable-next-line
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const classes = useStyles();
  const mobile = isMobile();
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
    if (text) {
      const char = text[0].toLocaleLowerCase();
      if (char >= 'a' && char <= 'z') return true;
      else return false;
    } else return false;
  };
  const onEmojiClick = (event: any, emojiObject: any) => {
    setChosenEmoji(emojiObject);
    setInput(input + emojiObject.emoji);
  };
  const imageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();
      const newFile = event.target.files[0];
      formData.append('image', newFile);
      const res = await axios.post(
        'https://europe-west3-ivern-app.cloudfunctions.net/api/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setImageURL(res.data.imageURL);
      buttonRef.current?.click();
    }
  };
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (input !== '' || imageURL)
      if (selectedChat)
        await startAddMessage(
          selectedChat.interlocutor.uid,
          input,
          selectedChat.cid,
          imageURL
        );
    setInput('');
    if (imageURL) setImageURL(undefined);
  };

  React.useEffect(() => {
    (async () => {
      if (!messages && selectedChat) {
        //First loading from database.
        await startSetMessages(selectedChat.cid);
        loadingMessages(false);
        inputRef.current?.scrollIntoView({ block: 'nearest' });
      } else {
        if (messages) {
          //messages are already at the client.
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
            ref={(r) => {
              if (r) {
                if (mobile) {
                  setPosition(r.scrollHeight < window.screen.availHeight * 0.85);
                } else setPosition(!messages?.length || r.scrollHeight < 370);
              }
            }}
            className={classes.messageList}
          >
            {messages?.map((message, index) => (
              <div key={index}>
                <ListItem className={classes.messageRow} key={index}>
                  <ListItemText
                    style={{
                      marginTop: index === 0 ? 50 : 0,
                      direction: isMessageInEnglish(message.text)
                        ? 'ltr'
                        : 'rtl',
                    }}
                    className={
                      message.sender === user.uid
                        ? classes.messageTextMe
                        : classes.messageTextYou
                    }
                    primary={
                      <React.Fragment>
                        {message.imageURL && (
                          <img
                            src={message.imageURL}
                            alt=''
                            width='100%'
                            height='100%'
                          />
                        )}
                        <Typography>{message.text}</Typography>
                      </React.Fragment>
                    }
                    secondaryTypographyProps={{
                      color:
                        message.sender !== user.uid ? 'inherit' : undefined,
                      variant: 'caption',
                    }}
                    secondary={makeTime(message.createdAt._seconds)}
                  />
                </ListItem>
              </div>
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
                bottom: position ? 0 : undefined,
              }}
            >
              <input
                accept='image/*'
                className={classes.upload}
                id='icon-button-file'
                onChange={imageUpload}
                type='file'
              />
              <label htmlFor='icon-button-file'>
                <IconButton
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                >
                  <PhotoCamera />
                </IconButton>
              </label>
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
                multiline
                autoFocus
                type='input'
                className={classes.input}
                placeholder='Type a message'
                inputProps={{ 'aria-label': 'type a message' }}
              />
              <Divider className={classes.divider} orientation='vertical' />
              <IconButton
                ref={buttonRef}
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
  givenMessage: state.userChats.newChatMessage,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatRoom);
