const { db, admin } = require('../utils/admin');

exports.listProperty = (request, response) => {
  if (request.body.title.trim() === '') {
    return response.status(400).json({ name: 'Must not be empty' });
  }

  const newPropertyItem = {
    title: request.body.title,
    description: request.body.description,
    owner: request.user.email,
    userId: request.user.user_id,
    address: request.body.address,
    bedrooms: request.body.bedrooms,
    bathrooms: request.body.bathrooms,
    price: request.body.price,
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
  let document = db.collection('properties').doc(`${request.params.propertyId}`);
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

  let document = await db.collection('properties').doc(`${request.params.propertyId}`).get();

  if (document.email !== request.user.email) {
    response.status(403).json({ message: 'You are not allowed to perform this action' });
  }

  const recipient = db.collection('users').where('email', '==', request.body.recipientEmail).get();
  console.log(recipient);

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
      let properties = [];
      data.forEach((doc) => {
        let property = {
          propertyId: doc.id,
          title: doc.data().title,
          address: doc.data().address,
          bedrooms: doc.data().bedrooms,
          bathrooms: doc.data().bathrooms,
          price: doc.data().price,
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
  let property = {};
  db.collection('properties')
    .doc(propertyId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        property = {
          propertyId: doc.id,
          title: doc.data().title,
          address: doc.data().address,
          bedrooms: doc.data().bedrooms,
          bathrooms: doc.data().bathrooms,
          price: doc.data().price,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
        };
      }
    });
};
