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
              const chats = [];
              collection.docs.forEach(doc => {
                firestore
                  .collection('chats')
                  .doc(doc.id)
                  .onSnapshot(async doc => {
                    const chatIndex = chats.findIndex(
                      chat => chat.id === doc.id
                    );
                    const newChatData = { ...doc.data(), id: doc.id };

                    newChatData.avatar.sources = undefined;

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
