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
import { AppState, Chat } from '../../../@types/types';

interface Props {
  chatsList: Chat[];
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | undefined>>;
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

const ChatsList: React.FC<Props> = ({ chatsList, setSelectedChat }) => {
  const classes = useStyles();
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (index !== chatsList.length) setSelectedChat(chatsList[index]);
    else setSelectedChat(undefined);
  };

  return (
    <div>
      <List className={classes.root}>
        {chatsList.map((chat, index) => (
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
                primary={chat.interlocutor.displayName}
                secondary={chat.messages[chat.messages.length - 1].text}
              />
            </ListItem>
            <Divider variant='inset' component='li' />
          </div>
        ))}
      </List>
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
  user: state.userInfo.user,
});
export default connect(MapStateToProps)(ChatsList);
