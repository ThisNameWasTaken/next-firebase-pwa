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
    () => async ({
      avatar = undefined,
      title = '',
      members = [{ id: '', role: '' }],
    }) => {}
  );
  const [filter, setFilter] = useState(null);
  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    if (filter) {
      setFilteredChats(
        chats?.filter(chat => {
          const isMatchingName = chat?.name?.includes(filter);
          const isMatchingLastMessage = chat?.lastMessage?.text.includes(
            filter
          );

          return isMatchingName || isMatchingLastMessage;
        })
      );
    } else {
      setFilteredChats(chats);
    }
  }, [chats, filter]);

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

          if (collection.docs.length === 0) {
            setChats(chats);
          }

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
        () => async ({
          avatar = undefined,
          title = '',
          members = [{ id: '', role: '' }],
        }) => {
          const newChatDoc = await firestore.collection('chats').add({
            name: title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          if (avatar) {
            storage
              .ref()
              .child(`avatars/chats/${newChatDoc.id}/${avatar.name}`)
              .put(avatar);
          }

          await newChatDoc
            .collection('members')
            .doc(userId)
            .set({ role: 'admin' });

          members.forEach(({ id, role }) => {
            newChatDoc.collection('members').doc(id).set({ role });
          });
        }
      );
    })();
  }, []);

  return { chats: filteredChats, createChat, filterChats: setFilter };
};

export default useChats;
