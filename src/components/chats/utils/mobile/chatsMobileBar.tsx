import {
  AppBar,
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { AccountCircle } from 'mdi-material-ui';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  HandleChatOpenAction,
  SetSelectedChatAction,
  SetMessagesAction,
  SetNewChatText,
  DeleteChatAction,
} from '../../../../@types/action-types';
import { AppState, Chat, Message, User } from '../../../../@types/types';
import {
  setMessages,
  handleChatOpen,
  setSelectedChat,
  setNewChatText,
  startDeleteChat,
} from '../../../../redux/actions/userChats';

interface Props {
  selectedChat: Chat | undefined;
  messages: Message[] | undefined;
  loadingMessages: boolean;
  clientUser: User;
  loadingUser: boolean;
  startDeleteChat: (cid: string) => Promise<DeleteChatAction>;
  setSelectedChat: (chat?: Chat) => SetSelectedChatAction;
  setNewChatText: (
    data: { text: string; imageURL: string } | undefined
  ) => SetNewChatText;
  handleChatOpen: (open: boolean) => HandleChatOpenAction;
  setMessages: (messages?: Message[]) => SetMessagesAction;
}
const ChatsMobileBar: React.FC<Props> = ({
  selectedChat,
  setNewChatText,
  loadingMessages,
  startDeleteChat,
  setSelectedChat,
  messages,
  setMessages,
  loadingUser,
  clientUser,
  handleChatOpen,
}) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuId = 'primary-account-menu';
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuSigned = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      dir='rtl'
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => history.push('/user')}>המשתמש שלי</MenuItem>
      <MenuItem onClick={() => history.push('/user/post')}>נהל פוסטים</MenuItem>
    </Menu>
  );

  return (
    <div>
      {selectedChat ? (
        <div>
          <AppBar position='fixed' color='inherit'>
            <Toolbar variant='dense'>
              <Grid container spacing={2}>
                <Avatar
                  style={{ margin: 'auto' }}
                  src={selectedChat.interlocutor.imageURL}
                />
                <Grid item xs>
                  <Typography variant='body2'>
                    {selectedChat.interlocutor.displayName}
                  </Typography>
                  <Typography variant='caption'>
                    {selectedChat.interlocutor.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
              <IconButton
                edge='end'
                onClick={async () => {
                  if ((!messages || messages.length === 0) && !loadingMessages)
                    await startDeleteChat(selectedChat.cid);
                  setSelectedChat(undefined);
                  setNewChatText(undefined);
                  setMessages(undefined);
                  handleChatOpen(false);
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      ) : (
        <div>
          <AppBar position='fixed' color='inherit' elevation={1}>
            <Toolbar
              variant='dense'
              style={{ justifyContent: 'space-between' }}
            >
              <IconButton edge='end' onClick={() => history.goBack()}>
                <ArrowBackIosIcon />
              </IconButton>
              <Typography variant='h6' color='inherit'>
                Chats
              </Typography>
              <IconButton
                aria-label='account of current user'
                aria-controls={menuId}
                aria-haspopup='true'
                onClick={handleProfileMenuOpen}
                color='primary'
              >
                {loadingUser ? (
                  <CircularProgress />
                ) : (
                  <div>
                    {clientUser.imageURL ? (
                      <Tooltip
                        title={
                          clientUser.displayName ? clientUser.displayName : ''
                        }
                      >
                        <Avatar
                          src={clientUser.imageURL}
                          alt={'google photo'}
                        />
                      </Tooltip>
                    ) : (
                      <AccountCircle />
                    )}
                  </div>
                )}
              </IconButton>
            </Toolbar>
          </AppBar>
          {renderMenuSigned}
        </div>
      )}
    </div>
  );
};
const MapDispatchToProps = {
  handleChatOpen,
  startDeleteChat,
  setNewChatText,
  setSelectedChat,
  setMessages,
};
const MapStateToProps = (state: AppState) => ({
  open: state.userChats.open,
  messages: state.userChats.selectedChatMessages,
  loadingMessages: state.userChats.loadingMessages,
  loadingUser: state.userInfo.loading,
  clientUser: state.userInfo.user,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatsMobileBar);
