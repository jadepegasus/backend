const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    user_one_id: String,
    user_two_id: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("friend", friendSchema);