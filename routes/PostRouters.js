const express = require("express");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    getAllPosts,
    getPostById,
    getPostByText,
    createPost,
    updatePost,
    deletePost,
    getPostByUserId
} = require("../controllers/PostController");

const router = express.Router();

router.route("/").get(getAllPosts).post(upload.array('images'), createPost);
router.route("/search/:id").get(getPostByText);
router.route("/:id").get(getPostById).put(upload.array('images'), updatePost).delete(deletePost);
router.route('/user/:id').get(getPostByUserId)

module.exports = router;
