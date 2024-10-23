const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default:
            "https://plus.unsplash.com/premium_photo-1673697239909-e11521d1ba94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXZlbmluZ3xlbnwwfHwwfHx8MA%3D%3D",
        set: (v) =>
            v === ""
                ? "https://plus.unsplash.com/premium_photo-1673697239909-e11521d1ba94?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXZlbmluZ3xlbnwwfHwwfHx8MA%3D%3D"
                : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 
