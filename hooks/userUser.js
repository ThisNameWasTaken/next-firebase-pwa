import { useEffect, useState } from 'react';

import { useFirebase } from './useFirebase';
import { useRouter } from 'next/router';

const useUser = userId => {
  const [currentUser, setCurrentUser] = useState(null);
  const firebase = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    (async () => {
      const firestore = await firebase.firestore();

      firestore
        .collection('users')
        .doc(userId)
        .onSnapshot(async doc => {
          const user = await doc.data();
          user.id = userId;

          setCurrentUser(user);
        });
    })();
  }, []);

  return currentUser;
};

export default useUser;
