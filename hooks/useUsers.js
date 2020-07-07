import { useEffect, useState } from 'react';
import { get as getCookie } from 'js-cookie';

import { useFirebase } from './useFirebase';
import { useRouter } from 'next/router';

const useUsers = ({ excludeSelf = false }) => {
  const [users, setUsers] = useState(null);
  const firebase = useFirebase();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const userId = getCookie('uid');

      if (!userId) {
        router.push('/sign-in');
      }

      const firestore = await firebase.firestore();

      const snapshot = await firestore.collection('users').get();

      const users = [];

      snapshot.docs.forEach(doc => {
        if (excludeSelf && doc.id === userId) return;
        users.push({ ...doc.data(), id: doc.id });
      });

      setUsers(users);
    })();
  }, []);

  return users;
};

export default useUsers;
