const NotificationService = require("../services/NotificationService")

exports.createNotification = async (req, res) => {
  try {
    let user_id = req.session?.passport?.user?.user_id
    if (!user_id) {
      res.json({message: "chưa đăng nhập", status: "fail"})
      return;
    }
    const {to_user_id, action, url, message} = req.body
    const Notification = await NotificationService.createNotification({to_user_id, action, url, message, from_user_id: user_id});
    res.json({ data: Notification, status: "success" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message, status: "fail" });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const Notification = await NotificationService.getNotificationById(req.params.id);
    res.json({ data: Notification, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "fail" });
  }
};

exports.deleteNotificationById = async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      res.json({message: "chưa đăng nhập", status: "fail"})
      return;
    }
    const Notification = await NotificationService.deleteNotificationById(req.params.id);
    res.json({ data: Notification, status: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "fail" });
  }
};

exports.deleteNotifications = async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      res.json({message: "chưa đăng nhập", status: "fail"})
      return;
    }
    const Notifications = await NotificationService.deleteNotificationByUserId(req.session.passport.user.user_id);
    res.json({ data: Notifications, status: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "fail" });
  } 
};
exports.getNotifications = async (req, res) => {
  try {
    if (!req.session?.passport?.user) {
      res.json({message: "chưa đăng nhập", status: "fail"})
      return;
    }
    const Notifications = await NotificationService.getNotificationByUserId(req.session.passport.user.user_id);
    res.json({ data: Notifications, status: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "fail" });
  }
}
