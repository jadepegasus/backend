const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_name: String,
    user_email: {
        type: String,
        unique: true,
        required: true
    },
    user_password: Buffer,
    salt: Buffer,
    user_fullname: String,
    user_gender: String,
    user_picture: String,
    user_cover: String,
    user_work_title: String,
    user_work_place: String,
    user_current_city: String,
    user_hometown: String,
    user_birthday: {
        type: Date,
        default: Date.now
    },
    user_registered: {
        type: Date,
        default: Date.now
    },
    user_last_login: {
        type: Date,
        default: Date.now
    },
    user_activated: String,
    user_ip: String,
    google_email: String,
    facebook_id: String,
    google_id: String
});

module.exports = mongoose.model("user", userSchema);
