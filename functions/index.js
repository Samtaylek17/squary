const functions = require('firebase-functions');
const express = require('express');
const { auth, getUserInfo } = require('./utils/auth');
const { db } = require('./utils/admin');

const app = express();
const cors = require('cors')({ origin: true });

// eslint-disable-next-line max-len
exports.addUIDfromSignUp = functions.auth.user().onCreate(async ({ email, uid }) => {
  try {
    // eslint-disable-next-line max-len
    return db.collection('users').doc(email).set({ email, userId: uid }, { merge: true });
  } catch (error) {
    console.log('failed to add uid from new user', error);
  }
});

app.use(cors);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { loginUser } = require('./apis/users');

const {
  listProperty,
  editProperty,
  transferProperty,
  getMyProperties,
  getOneProperty,
} = require('./apis/property');

// Users
app.post('/login', loginUser);
// app.post('/logout', logout);
app.get('/user', auth, getUserInfo);

// Properties
app.post('/properties', auth, listProperty);
app.get('/properties', auth, getMyProperties);
app.put('/properties/:propertyId', auth, editProperty);
app.get('/properties/:propertyId', auth, getOneProperty);
app.put('/properties/transfer/:propertyId', auth, transferProperty);

exports.api = functions.https.onRequest(app);