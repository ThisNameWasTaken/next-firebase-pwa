import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';

const useMembers = ({ chatId }) => {
  const [members, setMembers] = useState({});
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      const firestore = await firebase.firestore();

      firestore
        .collection('chats')
        .doc(chatId)
        .collection('members')
        .onSnapshot(async collection => {
          const members = {};

          collection.docs.forEach(doc => {
            const userId = doc.id;

            firestore
              .collection('users')
              .doc(userId)
              .onSnapshot(async doc => {
                const user = await doc.data();
                user.id = userId;

                members[userId] = user;

                if (Object.keys(members).length === collection.docs.length) {
                  setMembers(members);
                }
              });
          });
        });
    })();
  }, []);

  return { members };
};

export default useMembers;
