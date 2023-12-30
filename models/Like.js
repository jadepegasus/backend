const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// post like
const likeSchema = new Schema({
    user_id: String,
    post_id: String,
    comment_id: String,
    type: String
});
module.exports = mongoose.model("like", likeSchema);
