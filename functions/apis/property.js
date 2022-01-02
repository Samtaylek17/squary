const { db, admin } = require('../utils/admin');

exports.postOneProperty = (request, response) => {
  if (request.body.title.trim() === '') {
    return response.status(400).json({ name: 'Must not be empty' });
  }

  const newPropertyItem = {
    title: request.body.title,
    userId: request.user.user_id,
    address: request.body.address,
    bedrooms: request.body.bedrooms,
    bathrooms: request.body.bathrooms,
    price: request.body.price,
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
        };
      });
    });
};
