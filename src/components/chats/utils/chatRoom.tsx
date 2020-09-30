import {
  makeStyles,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, User, Chat } from '../../../@types/types';

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
  })
);

const ChatRoom: React.FC<Props> = ({ user, selectedChat }) => {
  const { messages } = selectedChat;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List className={classes.messageList}>
        {messages.map((message, index) => (
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
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
});
export default connect(MapStateToProps)(ChatRoom);
