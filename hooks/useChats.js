import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';

const useChats = ({ userId, defaultChats = [] }) => {
  const [chats, setChats] = useState(defaultChats);
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      firestore
        .collection('users')
        .doc(userId)
        .collection('chats')
        .onSnapshot(async collection => {
          const chatPromises = collection.docs.map(doc => {
            return firestore.collection('chats').doc(doc.id).get();
          });

          const chats = (await Promise.all(chatPromises)).map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          const urlPromises = [];

          chats.forEach((chat, chatIndex) => {
            if (!chat.avatar) return;

            for (const size in chat.avatar.sources) {
              urlPromises.push(
                storage
                  .ref(chat.avatar.sources[size].initial)
                  .getDownloadURL()
                  .then(url => ({
                    url,
                    size,
                    type: 'initial',
                    chatIndex,
                  }))
              );
              urlPromises.push(
                storage
                  .ref(chat.avatar.sources[size].webp)
                  .getDownloadURL()
                  .then(url => ({
                    url,
                    size,
                    type: 'webp',
                    chatIndex,
                  }))
              );
            }
          });

          const avatarResponses = await Promise.all(urlPromises);

          avatarResponses.forEach(({ url, size, type, chatIndex }) => {
            chats[chatIndex].avatar.sources[size][type] = url;
          });

          setChats(chats);
        });
    })();
  }, []);

  return chats;
};

export default useChats;
