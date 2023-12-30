const FriendModel = require("../models/Friend");

exports.getAllFriends = async () => {
  return await FriendModel.find();
};

exports.createFriend = async (Friend) => {
  const newFriend = new FriendModel(Friend);
  return await newFriend.save();
};
exports.getFriendById = async (id) => {
  return await FriendModel.findById(id);
};
exports.getFriendsByUserId = async (id) => {
  return await FriendModel.find({$or: [{user_one_id: id}, {user_two_id: id}]});
};
exports.getFriendByUsersId = async (user_one_id, user_two_id) => {
  const result1 = await FriendModel.findOne({user_one_id, user_two_id})
  const result2 = await FriendModel.findOne({user_one_id: user_two_id, user_two_id: user_one_id})
  return {result1, result2}
}

exports.deleteFriend = async (user_one_id, user_two_id) => {
  const result1 = await FriendModel.findOneAndDelete({user_one_id, user_two_id})
  const result2 = await FriendModel.findOneAndDelete({user_one_id: user_two_id, user_two_id: user_one_id})

  return {result1, result2}
};
exports.deleteAllFriend = async () => {
  return await FriendModel.deleteMany();
}