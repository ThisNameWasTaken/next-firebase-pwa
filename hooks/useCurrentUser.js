import { useEffect, useState } from 'react';
import { get as getCookie } from 'js-cookie';

import { useFirebase } from './useFirebase';
import { useRouter } from 'next/router';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const firebase = useFirebase();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const [firestore, storage] = await Promise.all([
        firebase.firestore(),
        firebase.storage(),
      ]);

      const userId = getCookie('uid');

      if (!userId) {
        router.push('/sign-in');
        return;
      }

      firestore
        .collection('users')
        .doc(userId)
        .onSnapshot(async doc => {
          const user = await doc.data();
          user.id = userId;

          const avatarPromises = [];

          for (const size in user.avatar.sources) {
            avatarPromises.push(
              storage
                .ref(user.avatar.sources[size].initial)
                .getDownloadURL()
                .then(url => ({
                  url,
                  size,
                  type: 'initial',
                }))
            );

            avatarPromises.push(
              storage
                .ref(user.avatar.sources[size].webp)
                .getDownloadURL()
                .then(url => ({
                  url,
                  size,
                  type: 'webp',
                }))
            );
          }

          const avatarResponses = await Promise.all(avatarPromises);

          avatarResponses.forEach(({ url, size, type }) => {
            user.avatar.sources[size][type] = url;
          });

          setCurrentUser(user);
        });
    })();
  }, []);

  return currentUser;
};

export default useCurrentUser;
