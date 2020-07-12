import { useEffect, useState } from 'react';

import { useFirebase } from './useFirebase';
import getQueryParams from '../utils/getQueryParams';

const useChat = (chatId = undefined) => {
  const [chat, setChat] = useState(null);
  const firebase = useFirebase();

  useEffect(() => {
    chatId = chatId || getQueryParams().chatId;

    (async () => {
      const firestore = await firebase.firestore();

      firestore
        .collection('chats')
        .doc(chatId)
        .onSnapshot(doc => {
          const chat = doc.data();
          chat.id = chatId;
          setChat(chat);
        });
    })();
  }, []);

  return { chat };
};

export default useChat;
