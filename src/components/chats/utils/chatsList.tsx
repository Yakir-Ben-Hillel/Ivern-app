import {
  Avatar,
  createStyles,
  makeStyles,
  Theme,
  ListItemAvatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { SetSelectedChatAction } from '../../../@types/action-types';
import { AppState, Chat } from '../../../@types/types';
import { setSelectedChat } from '../../../redux/actions/userChats';
interface Props {
  chatsList: Chat[];
  selectedChat?: Chat;
  setSelectedChat: (chat?: Chat) => SetSelectedChatAction;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
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

const ChatsList: React.FC<Props> = ({
  chatsList,
  setSelectedChat,
  selectedChat,
}) => {
  const classes = useStyles();
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (index !== chatsList.length) setSelectedChat(chatsList[index]);
    else setSelectedChat(undefined);
  };
  const isMessageInEnglish = (text: string) => {
    const char = text[0].toLocaleLowerCase();
    if (char >= 'a' && char <= 'z') return true;
    else return false;
  };

  return (
    <div>
      <List className={classes.root}>
        {chatsList.length > 0 &&
          chatsList.map((chat, index) => (
            <div key={index}>
              <ListItem
                alignItems='flex-start'
                button
                onClick={(event) => handleListItemClick(event, index)}
                style={{ marginTop: index === 0 ? 40 : 0 }}
              >
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    src={chat.interlocutor.imageURL}
                    alt=''
                  />
                </ListItemAvatar>
                <ListItemText
                  secondaryTypographyProps={{
                    dir:
                      chat.lastMessage?.text &&
                      isMessageInEnglish(chat.lastMessage?.text)
                        ? 'ltr'
                        : 'rtl',
                  }}
                  primary={chat.interlocutor.displayName}
                  secondary={chat.lastMessage?.text}
                />
              </ListItem>
              <Divider variant='inset' component='li' />
            </div>
          ))}
      </List>
    </div>
  );
};
const MapDispatchToProps = {
  setSelectedChat,
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
  user: state.userInfo.user,
  chatsList: state.userChats.chats,
  selectedChat: state.userChats.selectedChat,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatsList);
