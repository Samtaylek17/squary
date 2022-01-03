const { db } = require('../utils/admin');

exports.listProperty = (request, response) => {
  if (request.body.title.trim() === '') {
    return response.status(400).json({ name: 'Must not be empty' });
  }

  const newPropertyItem = {
    title: request.body.title,
    description: request.body.description,
    price: request.body.price,
    owner: request.user.email,
    userId: request.user.user_id,
    createdAt: new Date().toISOString(),
  };

  db.collection('properties')
    .add(newPropertyItem)
    .then(async (doc) => {
      const responsePropertyItem = newPropertyItem;
      responsePropertyItem.propertyId = doc.id;

      return response.json({
        message: 'Property listed successfully',
        property: responsePropertyItem,
      });
    })
    .catch((err) => {
      response.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

exports.editProperty = (request, response) => {
  if (request.body.propertyId || request.body.createdAt) {
    response.status(403).json({ message: 'Not allowed to edit' });
  }
  const document = db.collection('properties').doc(`${request.params.propertyId}`);
  document
    .update({ ...request.body, updatedAt: new Date().toISOString() })
    .then(() => {
      response.json({ message: 'Updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};

exports.transferProperty = async (request, response) => {
  if (request.body.propertyId || request.body.createdAt) {
    response.status(403).json({ message: 'Not allowed to edit' });
  }

  const document = await db.collection('properties').doc(`${request.params.propertyId}`).get();

  if (document.email !== request.user.email) {
    response.status(403).json({ message: 'You are not allowed to perform this action' });
  }

  const recipient = db.collection('users').where('email', '==', request.body.recipientEmail).get();
  console.log(recipient);

  if (!recipient || recipient === undefined) {
    return response.status(404).json({ message: 'Email does not exist in our database' });
  }

  document
    .update({ owner: recipient.email, userId: recipient.id, updatedAt: new Date().toISOString() })
    .then(() => {
      response.json({ message: 'Property transfered successfully' }).catch((err) => {
        console.log(err);
        return response.status(500).json({
          error: err.code,
        });
      });
    });
};

exports.getMyProperties = (request, response) => {
  db.collection('properties')
    .where('userId', '==', request.user.user_id)
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      const properties = [];
      data.forEach((doc) => {
        const property = {
          propertyId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          price: doc.data().price,
          owner: doc.data().owner,
          userId: doc.data().userId,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
        };
        properties.push(property);
      });
      return response.json(properties);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.getOneProperty = (request, response) => {
  const propertyId = request.params.propertyId;
  // let property = {};
  db.collection('properties')
    .doc(propertyId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const property = {
          propertyId: doc.id,
          title: doc.data().title,
          price: doc.data().price,
          description: doc.data().description,
          owner: doc.data().owner,
          userId: doc.data().userId,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
        };
        return response.json(property);
      } else {
        console.log('No such property');
        return response.status(404);
      }
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};
