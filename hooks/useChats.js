import { useEffect, useState } from 'react';
import { get as getCookie } from 'js-cookie';

import { useFirebase } from './useFirebase';
import { useRouter } from 'next/router';

const useChats = () => {
  const [chats, setChats] = useState(null);
  const router = useRouter();
  const firebase = useFirebase();
  const [
    createChat,
    setCreateChat,
  ] = useState(
    () => ({
      avatar = undefined,
      title = '',
      members = [{ id: '', role: '' }],
    }) => {}
  );

  useEffect(() => {
    (async () => {
      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      const userId = getCookie('uid');

      if (!userId) {
        router.push('/sign-in');
      }

      firestore
        .collection('users')
        .doc(userId)
        .collection('chats')
        .onSnapshot(async collection => {
          const chats = [];
          collection.docs.forEach(doc => {
            firestore
              .collection('chats')
              .doc(doc.id)
              .onSnapshot(async doc => {
                const chatIndex = chats.findIndex(chat => chat.id === doc.id);
                const newChatData = { ...doc.data(), id: doc.id };

                if (chatIndex !== -1) {
                  chats[chatIndex] = newChatData;
                } else {
                  chats.push(newChatData);
                }

                if (chats.length === collection.docs.length) {
                  setChats(chats);
                }
              });
          });
        });

      setCreateChat(
        () => ({
          avatar = undefined,
          title = '',
          members = [{ id: '', role: '' }],
        }) => {
          firestore
            .collection('chats')
            .add({
              title,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
            .then(doc => {
              const chatId = doc.id;

              members.forEach(member => {
                firestore
                  .collection('chats')
                  .doc(chatId)
                  .collection('members')
                  .doc(member.id)
                  .set({ role: member.role });
              });
            });

          if (avatar) {
            storage
              .ref()
              .child(`avatars/chats/${userId}/${avatar.name}`)
              .put(avatar);
          }
        }
      );
    })();
  }, []);

  return { chats, createChat };
};

export default useChats;
