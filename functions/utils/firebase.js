const firebase = require('firebase/compat/app');

const config = require('./config');

firebase.initializeApp(config);

module.exports = firebase;
