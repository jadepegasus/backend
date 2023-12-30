const LikeModal = require('../models/Like')
const PostModal = require('../models/Post')
const UserModal = require('../models/User')
const NotificationService = require('../services/NotificationService')

exports.createReact = async (req, res) => {
    try {
        const user_id = req.session?.passport?.user?.user_id
        if (!user_id) {
            res.json({ message: "chưa đăng nhập", status: "fail" })
            return;
        }
        const react = req.body
        const old_like = await LikeModal.findOne({ post_id: react.post_id, user_id })
        if (old_like) {
            res.json({ message: 'đã like or unlike', status: 'fail' })
            return;
        }
        const new_like = await LikeModal.create({ ...react, user_id });
        let { likes, unlikes } = await PostModal.findById(react.post_id, { likes: 1, unlikes: 1 })
        if (react.type === 'like') {
            likes++
        } else if (react.type === 'unlike') {
            unlikes++
        }
        const poster = await PostModal.findByIdAndUpdate(react.post_id, { likes, unlikes })
        if (poster && poster.user_id != user_id) {
            const message = `${req.session.passport.user.user_fullname} đã ${react.type} bài viết của bạn`
            const notify = { to_user_id: poster.user_id, from_user_id: user_id, action: 'like', url: '/post?id=' + poster._id, message }
            await NotificationService.createNotification(notify)

        }
        res.json({ data: new_like, status: "success" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message, status: "fail" });
    }
}

exports.deleteReact = async (req, res) => {
    try {
        const user_id = req.session?.passport?.user?.user_id
        if (!user_id) {
            res.json({ message: "chưa đăng nhập", status: "fail" })
            return;
        }
        const react = req.body
        const old_like = await LikeModal.findOneAndDelete({ post_id: react.post_id, user_id })
        if (!old_like) {
            res.json({ message: 'chưa like or unlike', status: 'fail' })
            return;
        }
        let { likes, unlikes } = await PostModal.findById(react.post_id, { likes: 1, unlikes: 1 })
        if (old_like.type === 'like') {
            likes--
        } else if (old_like.type === 'unlike') {
            unlikes--
        }
        const poster = await PostModal.findByIdAndUpdate(react.post_id, { likes, unlikes })
        if (poster) {
            const notify = { to_user_id: poster.user_id, from_user_id: user_id, action: 'like', url: '/post?id=' + poster._id }
            await NotificationService.deleteNotification(notify)

        }
        res.json({ data: old_like, status: "success" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message, status: "fail" });
    }
}

exports.getReact = async (req, res) => {
    try {
        const user_id = req.session?.passport?.user?.user_id
        if (!user_id) {
            res.json({ message: "chưa đăng nhập", status: "fail" })
            return;
        }
        const react = req.body
        const old_react = await LikeModal.findOne({ post_id: react.post_id, user_id })
        res.json({ data: old_react, status: "success" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message, status: "fail" });
    }
}

exports.getUsersLiked = async (req, res) => {
    try {
        let reacts = await LikeModal.find({ post_id: req.params.id })
        let result = []
        for (let react of reacts) {
            let user = await UserModal.findById(react.user_id, { _id: 1, user_fullname: 1, user_picture: 1, user_activated: 1 })
            result.push({ ...react._doc, user })
        }
        res.json({ data: result, status: "success" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message, status: "fail" });
    }
}