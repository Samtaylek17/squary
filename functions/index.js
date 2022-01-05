const functions = require('firebase-functions');
const express = require('express');
const { auth, getUserInfo } = require('./utils/auth');
const { db, admin } = require('./utils/admin');

const app = express();
const cors = require('cors');

app.use(cors({ origin: true }));
app.options('*', cors({ origin: true }));
// const corsOption = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.options('*', cors(corsOption));

// eslint-disable-next-line max-len
exports.addUIDfromSignUp = functions.auth.user().onCreate(async ({ email, uid }) => {
  try {
    // eslint-disable-next-line max-len
    return db.collection('users').doc(email).set({ email, userId: uid }, { merge: true });
  } catch (error) {
    console.log('failed to add uid from new user', error);
  }
});

exports.deleteUserByEmail = functions.https.onRequest(async (request, response) => {
  const userEmail = request.body.userEmail;

  await admin
    .auth()
    .getUserByEmail(userEmail)
    .then((userRecord) => {
      const uid = userRecord.uid;
      admin
        .auth()
        .deleteUser(uid)
        .then(() => {
          console.log('Successfully deleted user');
          response.status(500).send('Deleted User');
        })
        .catch((error) => {
          console.log('Error deleting user', error);
          response.status(500).send('Failed to delete user. User may not exist');
        });
    })
    .catch((error) => {
      console.log('Error fetching user data', error);
      response.status(500).send('failed');
    });
});

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
app.post('/properties/:propertyId', auth, editProperty);
app.get('/properties/:propertyId', auth, getOneProperty);
app.post('/properties/transfer/:propertyId', auth, transferProperty);

exports.api = functions.https.onRequest(app);
