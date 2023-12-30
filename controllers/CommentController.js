const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
const NotificationService = require('../services/NotificationService')


const addComment = async (req, res) => {
    try {
        let user_id = req.session?.passport?.user?.user_id
        if (!user_id) {
            res.json({ message: "chưa đăng nhập", status: "fail" })
            return;
        }
        const { post_id, text } = req.body
        const post = await Post.findById(post_id)
        if (!post) {
            res.json({ message: "Không tìm được bài viết", status: "fail" })
            return;
        }
        let user = await User.findById(user_id, {_id: 1, user_fullname: 1, user_activated: 1, user_picture: 1})
        const comment = new Comment({ post_id, user_id, text });
        await comment.save();
        const poster = await Post.findByIdAndUpdate(post_id, { comments: post.comments + 1 })
        if (poster && poster.user_id != user_id) {
            const message = `${req.session.passport.user.user_fullname} đã bình luận bài viết của bạn`
            const notify = { to_user_id: poster.user_id, from_user_id: user_id, action: 'comment', url: '/post?id=' + poster._id, message }
            await NotificationService.createNotification(notify)

        }
        res.status(200).json({ data: {user, comment}, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, status: 'fail' });
    }
};

const deleteComment = async (req, res) => {
    try {
        let user_id = req.session?.passport?.user?.user_id
        const comment = await Comment.findById(req.params.id)
        if (!comment) {
            res.json({ message: "không tìm được bình luận", status: "fail" })
            return;
        }
        const post = await Post.findById(comment.post_id)
        if (user_id != comment.user_id && user_id != post.user_id) {
            res.json({ message: "không có quyền xóa", status: "fail" })
            return;
        }
        const result = await Comment.findByIdAndDelete(req.params.id);
        const poster = await Post.findByIdAndUpdate(comment.post_id, { comments: post.comments - 1 })
        if (poster) {
            const notify = { to_user_id: poster.user_id, from_user_id: user_id, action: 'comment', url: '/post?id=' + poster._id }
            await NotificationService.deleteNotification(notify)

        }
        res.status(200).json({ data: result, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, status: 'fail' });
    }
}


const getComments = async (req, res) => {
    try {
        const post_id = req.params.id;
        const comments = await Comment.find({ post_id }).sort({ time: 1 });
        result = []
        if (comments)
            for (let comment of comments) {
                let user = await User.findById(comment.user_id, {_id: 1, user_fullname: 1, user_activated: 1, user_picture: 1})
                result.push({comment, user})
            }
        res.status(200).json({ data: result, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, status: 'fail' });
    }
};

module.exports = { addComment, deleteComment, getComments };
