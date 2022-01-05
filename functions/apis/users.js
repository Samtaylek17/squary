/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const { admin, db } = require('../utils/admin');
const firebase = require('../utils/firebase');
const cors = require('cors')({ origin: true });

const { validateLoginData, validateSignUpData } = require('../utils/validators');

exports.register = (request, response) => {
  cors(request, response, () => {
    const newUser = {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      // password: request.body.password,
      createdAt: new Date().toISOString(),
      userId: request.body.userId,
    };

    console.log(newUser);

    db.doc(`/users/${newUser.email}`)
      .set(newUser, { merge: true })
      .then(() => {
        return response.status(201).json({ email: 'created' });
      })
      .catch((err) => {
        return response.status(500).json({ general: 'Something went wrong, please try again' });
      });
  });
};

exports.loginUser = (request, response) => {
  cors(request, response, () => {
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
  });
};

exports.getUserDetails = (request, response) => {
  // console.log(request.user);
  cors(request, response, () => {
    const userData = {};
    db.doc(`/users/${request.user.email}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          userData.userCredentials = doc.data();
          const { password, id, createdAt, ...userDataWithoutPasswordIdAndDate } = userData;
          console.log(userDataWithoutPasswordIdAndDate);
          return response.json(userDataWithoutPasswordIdAndDate);
        }
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      });
  });
};

exports.getUserInfo = (request, response, next) => {
  cors(request, response, () => {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
      return next();
    }

    firebase
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        request.user = decodedToken;
        return db.collection('users').where('userId', '==', request.user.uid).limit(1).get();
      })
      .then((data) => {
        if (data && data.doc && data.docs.length) {
          request.user.email = data.docs[0].data().email;

          // request.user.roles = data.docs[0].data().roles;
        }
        return next();
      })
      .catch((err) => {
        console.error('Error while verifying token', err);
        return next();
      });
  });
};

// Logout
exports.logoutUser = (request, response) => {
  cors(request, response, () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        return response.json({ message: 'user successfully logged out' });
      })
      .catch(function (error) {
        console.error(error);
      });
  });
};
