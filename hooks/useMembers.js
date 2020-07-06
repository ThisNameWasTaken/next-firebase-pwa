import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';

const useMembers = ({ chatId, membersDefault = {} }) => {
  const [members, setMembers] = useState(membersDefault);
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      firestore
        .collection('chats')
        .doc(chatId)
        .collection('members')
        .onSnapshot(async collection => {
          const memberPromises = collection.docs.map(doc => {
            return firestore.collection('users').doc(doc.id).get();
          });

          const members = {};

          (await Promise.all(memberPromises)).forEach(doc => {
            members[doc.id] = {
              id: doc.id,
              ...doc.data(),
            };

            if (members[doc.id].avatar) {
              members[doc.id].avatar.sources = undefined;
            }
          });

          setMembers(members);
        });
    })();
  }, []);

  return { members };
};

export default useMembers;
