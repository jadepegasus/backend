const express = require("express");
const {
    getAllFriends,
    checkFriend,
    getFriends,
    createFriend,
    deleteFriend
} = require("../controllers/FriendController");

const router = express.Router();

router.route("/").get(getAllFriends).post(createFriend);
router.route("/getfriends").get(getFriends);
router.route("/delete").post(deleteFriend);
router.route('/check').post(checkFriend)

module.exports = router;
