const Listing = require('../models/listing');  // path to your Listing model

const createListing = (req, res) => {
  const newListing = new Listing({
    title: req.body.title,
    description: req.body.description,
    image: {
      filename: 'listingimage',
      url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
    }
  });

  newListing.save()
    .then(() => res.send('Listing created successfully'))
    .catch(err => res.status(400).send(err.message));
};

module.exports = { createListing };
