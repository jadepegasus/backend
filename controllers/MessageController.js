const Message = require('../models/Message');
const User = require('../models/User')


const getMessagers = async (req, res) => {
    try {
      let user_id = req.session?.passport?.user?.user_id
      if (!user_id) {
        res.json({message: "chưa đăng nhập", status: "fail"})
        return;
      }
      const messages = await Message.find({
        $or: [
          { sender: user_id},
          { receiver: user_id },
        ],
      }).sort({ timestamp: -1 });

      const messagers = new Map()
      for (let message of messages) {
        let user
        if (!message.sender) continue;
        if (message.sender.toString() == user_id) {
          if (!messagers.has(message.receiver.toString())) {
            user = await User.findById(message.receiver, {_id: 1, user_fullname: 1, user_activated: 1, user_picture: 1})
            messagers.set(message.receiver.toString(), {message, user})
          }
        } else {
          if (!messagers.has(message.sender.toString())) {
            user = await User.findById(message.sender, {_id: 1, user_fullname: 1, user_activated: 1, user_picture: 1})
            messagers.set(message.sender.toString(), {message, user})
          }
        }
      }
      res.status(200).json({data: Array.from(messagers.values()), status: 'success'})

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message, status: 'fail' });
    }
  };

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    let user_id = req.session?.passport?.user?.user_id
    if (user_id !== sender || !user_id) {
      res.json({message: "chưa đăng nhập hoặc sai người gửi", status: "fail"})
      return;
    }
    // const images = []
    // console.log(req.files)
    // if (req.files) {
    //   for (const image of req.files) {
    //     const newImage = await Image.create({
    //         name: image.originalname,
    //         contentType: image.mimetype,
    //         data: image.buffer
    //     })
    //     images.push(newImage?._id)
    //   }

    // }
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(200).json({ data: message, status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, status: 'fail' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    let user_id = req.session?.passport?.user?.user_id
    const message = await Message.findById(req.params.id)
    if (!message) {
      res.json({message: "không tìm được tin nhắn", status: "fail"})
      return;
    }
    if (user_id != message.sender && user_id != message.receiver) {
      res.json({message: "không có quyền xóa", status: "fail"})
      return;
    }
    // const photos = message.images
    // for (const image of photos) {
    //   await Image.findByIdAndDelete(image);
    // }
    const result = await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ data: result, status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, status: 'fail' });
  }
}


const getMessages = async (req, res) => {
    try {
      let user_id = req.session?.passport?.user?.user_id
      if (!user_id) {
        res.json({message: "chưa đăng nhập", status: "fail"})
        return;
      }
      const friend_id = req.params.id;
      const messages = await Message.find({
        $or: [
          { sender: user_id, receiver: friend_id },
          { sender: friend_id, receiver: user_id },
        ],
      }).sort({ timestamp: 1 });
      res.status(200).json({data: messages, status: 'success'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message, status: 'fail' });
    }
  };

module.exports = {getMessagers, getMessages, sendMessage, deleteMessage};
