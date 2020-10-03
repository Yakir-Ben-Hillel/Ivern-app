import {
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, User, Chat } from '../../../@types/types';
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import MoodIcon from '@material-ui/icons/Mood';
interface Props {
  user: User;
  selectedChat: Chat;
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
      alignItems: 'center',
      borderRadius: '10px',
      marginBottom: '8px',
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

const ChatRoom: React.FC<Props> = ({ user, selectedChat }) => {
  const [input, setInput] = React.useState('');
  const classes = useStyles();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const onEmojiClick = (event: any, emojiObject: any) => {
    setChosenEmoji(emojiObject);
    setInput(input + emojiObject.emoji);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInput('');
  };
  React.useEffect(() => {
    inputRef.current?.scrollIntoView({ block: 'nearest' });
  }, []);
  return (
    <div className={classes.root}>
      <List className={classes.messageList}>
        {selectedChat.messages?.map((message, index) => (
          <ListItem className={classes.messageRow} key={index}>
            <ListItemText
              style={{ marginTop: index === 0 ? 50 : 0 }}
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
              secondary='13:55'
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
        <Paper className={classes.inputRoot}>
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
            aria-label='directions'
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </form>
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
});
export default connect(MapStateToProps)(ChatRoom);
