# Squary

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Frontend Available Scripts

In the project directory, you can run:

### `yarn`

Installs all project dependencies and dev-dependencies

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Functions Available Scripts

Navigate into the functions and run the following commands

## `npm install`

Installs all functions dependencies and dev-dependencies

## `npm run serve`

Runs the firebase cloud functions in development mode.

The application runs on [http://localhost:5001](http://localhost:3000) by default

**Note: You need to pass your firebase configurations for the project to run successfully**
Create a **.env** file in the root project directory and pass in the following variables

REACT_APP_FIREBASE_API_KEY=`**************************`,
REACT_APP_FIREBASE_AUTH_DOMAIN=`***********************`,
REACT_APP_FIREBASE_DB_URL=`**************************`,
REACT_APP_FIREBASE_PROJECT_ID=`************************`,
REACT_APP_FIREBASE_STORAGE_BUCKET=`**********************`,
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=`*********************`,
REACT_APP_FIREBASE_APP_ID=`*******************************`,
REACT_APP_PROPERTY_API_URL=`*******************************`,

**For the frontend application to be able to communicate with the server you need to provide the api url in the .env file which is the REACT_APP_PROPERTY_API_URL above**

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
