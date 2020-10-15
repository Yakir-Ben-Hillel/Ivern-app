import { Container } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import {
  AddChatAction,
  SetChatsAction,
  SetSelectedChatAction,
  SetUnreadChatsAction,
  SetUnreadMessagesAction,
} from '../../@types/action-types';
import { AppState, Chat, User } from '../../@types/types';
import { firebase } from '../../firebase';
import {
  handleChatOpen,
  setChats,
  setSelectedChat,
  setUnreadChats,
  setUnreadMessages,
  startAddNewExistingChat,
} from '../../redux/actions/userChats';
import ChatRoom from './utils/chatRoom';
import ChatsMobileBar from './utils/mobile/chatsMobileBar';
import ChatsList from './utils/chatsList';
interface IProps {
  user: User;
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
}
const ChatMobile: React.FC<IProps> = ({
  user,
  selectedChat,
  unreadChats,
  chatsList,
  setChats,
  setUnreadMessages,
  startAddNewExistingChat,
  setUnreadChats,
}) => {
  const database = firebase.firestore();
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
  return (
    <div>
      <Container component='div' maxWidth='xs'>
        <ChatsMobileBar selectedChat={selectedChat} />
        {selectedChat ? <ChatRoom /> : <ChatsList />}
      </Container>
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
  user: state.userInfo.user,
  chatsList: state.userChats.chats,
  selectedChat: state.userChats.selectedChat,
  unreadChats: state.userChats.unreadChats,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatMobile);
