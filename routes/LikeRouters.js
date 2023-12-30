const express = require("express");
const {
  createReact,
  deleteReact,
  getReact,
  getUsersLiked
} = require("../controllers/LikeController");

const router = express.Router();

router.route("/").post(createReact).delete(deleteReact).put(getReact);
router.route('/:id').get(getUsersLiked)

module.exports = router;
