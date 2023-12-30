const express = require("express")
const userRouter = require("./UserRoutes");
const postRouter = require("./PostRouters");
const notificationRouter = require("./NotificationRouters");
const friendRouter = require("./FriendRoutes");
const authRouters = require('./authRoutes');
const likeRouters = require('./LikeRouters')
const {signupRouter} = require('./Signup');
const ImageRoutes = require('./ImageRoutes')
const messageRoutes = require('./MessageRoutes')
const UserService = require("../services/UserService.js");
const commentRoutes  = require("./CommentRoutes")
//
const Router = express.Router()
const apiRouter = express.Router()

apiRouter.use("/users", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/friends", friendRouter);
apiRouter.use('/images', ImageRoutes);
apiRouter.use('/likes', likeRouters);
apiRouter.use('/messages', messageRoutes)
apiRouter.use('/comments', commentRoutes)

Router.use('/api', apiRouter)
Router.use('/signup', signupRouter)
Router.use('/auth', authRouters)

Router.route('/logined').get((req, res) => {
    if (req.session?.passport?.user) {
        res.json({message: req.session.passport.user, status: 'success'})
    } else {
        res.json({message:'chưa đăng nhập', status: 'fail'})
    }
    
});
Router.route('/logout').get((req, res) => {
    req.session.destroy(err => {
        if (err) return res.json({message: err, status: "fail"})
        const user_id = req.session?.passport?.user?.user_id
        if (user_id) UserService.unActived(user_id)
        res.json({message: 'đăng xuất thành công', status: 'success'})
    })
})

module.exports = Router;

// const authRouter = require("express").Router();


