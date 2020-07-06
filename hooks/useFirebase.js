import { useEffect, useState } from 'react';
import { set as setCookie, remove as removeCookie } from 'js-cookie';
import { useRouter } from 'next/router';

/**
 * @typedef {import('firebase')} firebase
 *
 * @returns {{
 *  app: (name?: string) => Promise<firebase.app.App>
 *  auth: (app?: firebase.app.App) => Promise<firebase.auth.Auth>
 *  firestore: (app?: firebase.app.App) => Promise<firebase.firestore.Firestore>
 *  messaging: (app?: firebase.app.App) => Promise<firebase.messaging.Messaging>
 *  storage: (app?: firebase.app.App) => Promise<firebase.storage.Storage>
 * }}
 */
export function useFirebase() {
  const [firebase, setFirebase] = useState(null);
  const router = useRouter();
  let unsubscribe;
  let componentUnmountedWithoutUnsubscribing = false;

  async function importFirebase() {
    if (firebase) return firebase;

    const firebaseModule = await import('../utils/firebase').then(
      m => m.default
    );

    setFirebase(firebaseModule);

    unsubscribe = firebaseModule.auth().onAuthStateChanged(user => {
      if (user) {
        setCookie('uid', user.uid);
        user
          .getIdToken()
          .then(token => setCookie('token', token))
          .catch(console.error);
      } else {
        removeCookie('token');
        removeCookie('uid');
      }
    });

    if (componentUnmountedWithoutUnsubscribing) unsubscribe();

    return firebaseModule;
  }

  const app = async name => (await importFirebase()).app(name);
  const auth = async app => (await importFirebase()).auth(app);
  const firestore = async app => (await importFirebase()).firestore(app);
  const messaging = async app => (await importFirebase()).messaging(app);
  const storage = async app => (await importFirebase()).storage(app);

  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      } else {
        componentUnmountedWithoutUnsubscribing = true;
      }
    };
  }, []);

  return { app, auth, firestore, messaging, storage };
}
