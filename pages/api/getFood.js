import firebaseAdmin from '../../utils/firebaseAdmin';

const favoriteFoods = ['pizza', 'burger', 'chips', 'tortilla'];

const getFood = async (req, res) => {
  const token = req.headers.token;

  try {
    await firebaseAdmin.auth().verifyIdToken(token);

    return res.status(200).json({
      food: favoriteFoods[Math.floor(Math.random() * favoriteFoods.length)],
    });
  } catch (error) {
    return res.status(401).send('You are logged in');
  }
};

export default getFood;
