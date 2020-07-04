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
          });

          const urlPromises = [];

          for (const memberId in members) {
            const member = members[memberId];

            if (!member.avatar) continue;

            for (const size in member.avatar.sources) {
              urlPromises.push(
                storage
                  .ref(member.avatar.sources[size].initial)
                  .getDownloadURL()
                  .then(url => ({
                    url,
                    size,
                    type: 'initial',
                    memberId,
                  }))
              );
              urlPromises.push(
                storage
                  .ref(member.avatar.sources[size].webp)
                  .getDownloadURL()
                  .then(url => ({
                    url,
                    size,
                    type: 'webp',
                    memberId,
                  }))
              );
            }
          }

          const avatarResponses = await Promise.all(urlPromises);

          avatarResponses.forEach(({ url, size, type, memberId }) => {
            members[memberId].avatar.sources[size][type] = url;
          });

          setMembers(members);
        });
    })();
  }, []);

  return { members };
};

export default useMembers;
