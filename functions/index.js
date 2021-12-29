const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({ origin: true });
const { auth, getUserInfo } = require('./utils/auth');
const { db } = require('./utils/admin');

const app = express();

app.use(cors);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { loginUser, getUserDetails } = require('./apis/users');

// Users
app.post('/login', loginUser);
// app.post('/logout', logout);
app.get('/user', auth, getUserDetails);

exports.api = functions.https.onRequest(app);
