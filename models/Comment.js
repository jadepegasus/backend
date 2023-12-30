const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// comment
const commentSchema = new Schema({
    post_id: String,
    user_id: String,
    text: String,
    time: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("comment", commentSchema )