import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
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

      unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const userId = user.uid;

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
        } else {
          setCurrentUser(null);
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

  return currentUser;
};

export default useCurrentUser;
