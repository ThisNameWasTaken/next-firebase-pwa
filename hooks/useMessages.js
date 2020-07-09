import { useEffect, useState } from 'react';
import { get as getCookie } from 'js-cookie';

import { useFirebase } from './useFirebase';

const useMessages = ({ chatId: _chatId, messagesDefault = [] }) => {
  const firebase = useFirebase();
  const [messages, setMessages] = useState(messagesDefault);
  const [chatId, setChatId] = useState(_chatId);
  const [
    sendMessage,
    setSendMessage,
  ] = useState(() => ({ text = '', photo = undefined }) => {});
  const [
    deleteMessage,
    setDeleteMessage,
  ] = useState(() => (messageId = '') => {});

  useEffect(() => {
    (async () => {
      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      const userId = getCookie('uid');

      setSendMessage(() => ({ text = '', photo }) => {
        if (photo) {
          storage
            .ref()
            .child(`photos/chats/${userId}/${photo.name}`)
            .put(photo);
        }

        return firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            text,
            authorId: userId,
            createdAt: Date.now(),
          });
      });

      setDeleteMessage(() => messageId => {
        return firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .doc(messageId)
          .delete();
      });

      firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('createdAt')
        .onSnapshot(async collection => {
          const messagePromises = collection.docs.map(doc => {
            return firestore
              .collection('chats')
              .doc(chatId)
              .collection('messages')
              .doc(doc.id)
              .get();
          });

          const messages = (await Promise.all(messagePromises)).map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMessages(messages);
        });
    })();
  }, [chatId]);

  return { messages, sendMessage, deleteMessage, chatId, setChatId };
};

export default useMessages;
