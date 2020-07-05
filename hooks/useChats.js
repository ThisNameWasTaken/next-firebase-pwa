import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';

const useChats = () => {
  const [chats, setChats] = useState(null);
  const firebase = useFirebase();

  let unsubscribe;
  let didUnsubscribe = true;

  useEffect(() => {
    (async () => {
      const [auth, firestore, storage] = await Promise.all([
        firebase.auth(),
        firebase.firestore(),
        firebase.storage(),
      ]);

      auth.onAuthStateChanged(user => {
        if (user) {
          const userId = user.uid;

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
                if (!chat?.avatar?.sources) return;

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
        } else {
          setChats(null);
        }
      });

      if (!didUnsubscribe) {
        unsubscribe();
      }
    })();

    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      } else {
        didUnsubscribe = false;
      }
    };
  }, []);

  return chats;
};

export default useChats;
