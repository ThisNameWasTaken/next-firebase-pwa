import firebaseAdmin from '../../utils/firebaseAdmin';

export default async (req, res) => {
  if (!req.headers) return res.status(400).end();

  const { token } = req.headers;

  try {
    const user = await firebaseAdmin.auth().verifyIdToken(token);
    const userId = user.uid;

    if (!user) {
      return res.status(401).json({ error: 'You are not logged in' });
    }

    const userRef = firebaseAdmin.firestore().collection('users').doc(userId);

    const userData = await (await userRef.get()).data();

    userData.avatar.sources = undefined;

    return res.status(200).json({ currentUser: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
