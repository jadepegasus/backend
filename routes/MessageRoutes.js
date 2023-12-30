const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');
// const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.route('/:id').get(messageController.getMessages).delete(messageController.deleteMessage);
router.route('/').get(messageController.getMessagers).post(messageController.sendMessage);
module.exports = router;