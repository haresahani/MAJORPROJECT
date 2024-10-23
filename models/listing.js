const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { type: String, required: true },  // example field
    description: { type: String, required: true },  // example field
    image: {
      filename: { type: String, required: true },
      url: { type: String, required: true }
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 
