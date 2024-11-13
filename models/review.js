const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max,
    }, 
    createdAt: {
        type: DataTransfer,
        default: Date.new(),
    },
});

module.exports = mongoose.model("Review", reviewSchema);