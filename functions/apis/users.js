const { admin, db } = require('../utils/admin');
const firebase = require('../utils/firebase');

const { validateLoginData, validateSignUpData } = require('../utils/validators');

exports.loginUser = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(403).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((error) => {
      console.log(error);
      return response.status(403).json({ general: 'wrong credentials, please try again' });
    });
};

exports.getUserDetails = (request, response) => {
  console.log(request.user);
  let userData = {};
  db.doc(`/users/${request.user.email}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        const { password, userId, createdAt, ...userDataWithoutPasswordIdAndDate } = userData;
        return response.json(userDataWithoutPasswordIdAndDate);
      }
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

// Logout
exports.logoutUser = (request, response) => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      return response.json({ message: 'user successfully logged out' });
    })
    .catch(function (error) {
      console.error(error);
    });
};
