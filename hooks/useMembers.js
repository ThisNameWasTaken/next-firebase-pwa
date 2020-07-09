import { useEffect, useState } from 'react';
import { useFirebase } from './useFirebase';
import { get as getCookie } from 'js-cookie';

const useMembers = ({ chatId }) => {
  const firebase = useFirebase();
  const [members, setMembers] = useState({});
  const [leaveChat, setLeaveChat] = useState(() => () => {});
  const [addMember, setAddMember] = useState(() => (userId = '') => {});
  const [removeMember, setRemoveMember] = useState(() => (userId = '') => {});
  const [addAdmin, setAddAdmin] = useState(() => (userId = '') => {});

  useEffect(() => {
    const userId = getCookie('uid');

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
            const docData = doc.data();

            firestore
              .collection('users')
              .doc(userId)
              .onSnapshot(async doc => {
                const user = await doc.data();
                user.id = userId;

                members[userId] = { ...docData, ...user, id: userId };

                if (Object.keys(members).length === collection.docs.length) {
                  setMembers(members);
                }
              });
          });
        });

      setRemoveMember(() => async userId => {
        try {
          return await firestore
            .collection('chats')
            .doc(chatId)
            .collection('members')
            .doc(userId)
            .delete();
        } catch (err) {
          console.error(err);
        }
      });

      setLeaveChat(() => async () => {
        try {
          return await firestore
            .collection('chats')
            .doc(chatId)
            .collection('members')
            .doc(userId)
            .delete();
        } catch (err) {
          console.error(err);
        }
      });

      setAddMember(() => async userId => {
        try {
          return await firestore
            .collection('chats')
            .doc(chatId)
            .collection('members')
            .doc(userId)
            .set({ role: 'member' });
        } catch (err) {
          console.error(err);
        }
      });

      setAddAdmin(() => async userId => {
        try {
          return await firestore
            .collection('chats')
            .doc(chatId)
            .collection('members')
            .doc(userId)
            .set({ role: 'admin' });
        } catch (err) {
          console.error(err);
        }
      });
    })();
  }, []);

  return { members, leaveChat, addMember, removeMember, addAdmin };
};

export default useMembers;
