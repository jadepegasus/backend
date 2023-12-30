const express = require("express");
const {
    getNotifications,
    deleteNotifications,
    deleteNotificationById
} = require("../controllers/NotificationController");

const router = express.Router();

router.route("/").get(getNotifications)
router.route("/delete").get(deleteNotifications)
router.route('/delete/:id').get(deleteNotificationById)

module.exports = router;
