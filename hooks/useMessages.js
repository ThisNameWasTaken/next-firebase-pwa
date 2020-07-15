import { useEffect, useState } from 'react';
import { get as getCookie } from 'js-cookie';

import { useFirebase } from './useFirebase';
import getSrcFromImageFile from '../utils/getSrcFromImageFile';

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
  const [typingUsers, setTypingUsers] = useState([]);
  const [showIsTyping, setShowIsTyping] = useState(() => async isTyping => {});

  useEffect(() => {
    (async () => {
      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      const userId = getCookie('uid');

      setShowIsTyping(() => async isTyping => {
        const typingUsersDocRef = firestore
          .collection('chats')
          .doc(chatId)
          .collection('typingUsers')
          .doc(userId);

        isTyping ? typingUsersDocRef.set({}) : typingUsersDocRef.delete();
      });

      firestore
        .collection('chats')
        .doc(chatId)
        .collection('typingUsers')
        .onSnapshot(collection => {
          setTypingUsers(
            collection.docs.map(doc => doc.id).filter(id => id !== userId)
          );
        });

      setSendMessage(() => ({ text = '', photo }) => {
        const messagesRef = firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages');

        if (photo) {
          const image = document.createElement('img');
          document.body.appendChild(image);
          image.style.width = '100vw';
          image.style.height = 'auto';
          image.style.position = 'absolute';
          image.style.top = '-9999vw';
          image.style.left = '-9999vw';
          image.style.pointerEvents = 'none';
          image.style.visibility = 'hidden';
          image.setAttribute('aria-hidden', 'true');

          getSrcFromImageFile(photo)
            .then(src => {
              image.src = src;
              image.addEventListener(
                'load',
                async event => {
                  const doc = await messagesRef.add({
                    text,
                    authorId: userId,
                    createdAt: Date.now(),
                    photo: { width: image.width, height: image.height },
                  });

                  console.log({ messageId: doc.id });

                  await storage
                    .ref()
                    .child(
                      `photos/chats/${chatId}/messages/${doc.id}/${photo.name}`
                    )
                    .put(photo);

                  document.body.removeChild(image);
                },
                { once: true }
              );
            })
            .catch(console.error);
        } else {
          messagesRef.add({
            text,
            authorId: userId,
            createdAt: Date.now(),
          });
        }
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

  return {
    messages,
    sendMessage,
    deleteMessage,
    chatId,
    typingUsers,
    showIsTyping,
  };
};

export default useMessages;
