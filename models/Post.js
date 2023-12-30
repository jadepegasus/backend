const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// post
const postSchema = new Schema({
    user_id: String,
    time: {
        type: Date,
        default: Date.now
    },
    location: String,
    privacy: String, // friends, public or private
    text: String,
    photos: [String],  // mảng các link ảnh
    likes: {
        type: Number,
        default: 0
    },
    unlikes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    share_from: String // được chia sẻ từ bài nào hay ko
});
module.exports = mongoose.model("post", postSchema);
