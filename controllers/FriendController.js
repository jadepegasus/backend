const FriendService = require("../services/FriendService");
const NotificationService = require('../services/NotificationService')
const UserService = require('../services/UserService')

exports.getAllFriends = async (req, res) => {
  try {
    const Friends = await FriendService.getAllFriends();
    res.json({ data: Friends, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "fail" });
  }
};

exports.createFriend = async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      res.json({message: "chưa đăng nhập", status: "fail"})
      return;
    }
    const {user_one_id, user_two_id} = req.body
    if (user_one_id != req.session.passport.user.user_id) {
      res.json({message: "gửi sai yêu cầu kết bạn", status: 'fail'})
      return;
    }
    const user_two = await UserService.getUserById(user_two_id)
    if (!user_two) {
      res.json({message: "người bạn không tồn tại", status: 'fail'})
      return;
    }
    const relation = await FriendService.getFriendByUsersId(user_one_id, user_two_id)
    if (relation.result1 || relation.result2) {
      res.json({message: "các bạn đã là bạn bè", status: "fail"})
      return;
    } else {
      const newRelation = await FriendService.createFriend({user_one_id, user_two_id});
      const message = `${req.session.passport.user.user_fullname} đã thêm bạn làm bạn bè`
      const notify = {to_user_id: user_two_id, from_user_id: user_one_id, action: 'addfriend', url: '/profile?id='+user_one_id, message}
      await NotificationService.createNotification(notify)
      res.json({ data: newRelation, status: "success" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message, status: "fail" });
  }
};

exports.checkFriend = async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      res.json({message: "0", status: "success"})
      return;
    }
    const {user_one_id, user_two_id} = req.body
    if (!(user_one_id && user_two_id)) {
      res.json({message: "1", status: "success"})
      return;
    }
    const relation = await FriendService.getFriendByUsersId(user_one_id, user_two_id)
    if (relation.result1 || relation.result2) { // la ban be
      res.json({message: "2", status: "success"})
      return;
    } else {
      res.json({ message: "3", status: "success" });
    }


  } catch (err) {
    res.status(500).json({ message: err.message, status: "fail" });
  }
};

exports.getFriends = async (req, res) => {
    try {
      if (!req.session?.passport?.user) {
        res.json({message: "chưa đăng nhập", status: "fail"})
        return;
      }
      const user_id = req.session.passport.user.user_id
      const friends = await FriendService.getFriendsByUserId(user_id);
      const name_friends = friends.map(e => (
        (e.user_one_id === user_id) ? e.user_two_id : e.user_one_id
      ))
      const list_friends = await UserService.getFriends(name_friends)
      res.json({ data: list_friends, status: "success" });
    } catch (err) {
      res.status(500).json({ message: err.message, status: "fail" });
    }
  };


exports.deleteFriend = async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      res.json({message: "chưa đăng nhập", status: "fail"})
      return;
    }
    const {user_one_id, user_two_id} = req.body
    if (user_one_id != req.session.passport.user.user_id) {
      res.json({message: "gửi sai yêu cầu", status: 'fail'})
      return;
    }
    const relation = await FriendService.deleteFriend(user_one_id, user_two_id)
    if (relation.result1 || relation.result2) {
      const notify = {to_user_id: user_two_id, from_user_id: user_one_id, action: 'addfriend'}
      await NotificationService.deleteNotification(notify)
      res.json({data: relation, status: "success"})
      return;
    } else {
      res.json({ message: "các bạn chưa là bạn bè", status: "fail" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, status: "fail" });
  }
};

