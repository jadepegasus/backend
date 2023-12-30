const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');

router.route('/:id').get(commentController.getComments).delete(commentController.deleteComment)
router.route('/').post(commentController.addComment)

module.exports = router;
