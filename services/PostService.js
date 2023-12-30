const PostModel = require("../models/Post");

exports.getAllPosts = async () => {
  return await PostModel.find();
};

exports.getPostByUserId = async (user_id) => {
  return await PostModel.find({user_id})
}

exports.createPost = async (Post) => {
  const newPost = new PostModel(Post);
  return await newPost.save();
};
exports.getPostById = async (id) => {
  return await PostModel.findById(id);
};
exports.getPostByText = async (text) => {
  let search = new RegExp(text, "i");
  return await PostModel.find({text: search});
};
exports.updatePost = async (id, Post) => {
  return await PostModel.findByIdAndUpdate(id, Post);
};

exports.deletePost = async (id) => {
  return await PostModel.findByIdAndDelete(id);
};
