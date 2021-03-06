const express = require('express')
const router = express.Router()
const RequireLogin = require('../middleware/RequireLogin')
const Post = require('../models/Post.model');
require('dotenv').config()


router.post('/createpost', RequireLogin, (req, res) => {
    const { title, body } = req.body
    if (!title || !body) {
        return res.status(422).json({ error: "Hãy điền đầy đủ thông tin" })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })
    post.save().then(result => {
            res.json({ post: result })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/allpost', RequireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id ")
        .populate("comments.postedBy", "_id ")
        .sort('-createdAt')
        .then((posts) => {
            res.json({ posts })
        }).catch(err => {
            console.log(err)
        })

})

router.get('/mypost', RequireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("PostedBy", "_id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err)
        })
})

router.delete('/deletepost/:postId', RequireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(
                        res.json('Xóa bài thành công!')
                    ).catch(err => {
                        console.log(err)
                    })
            }
        })
})

router.put('/like',RequireLogin, (req, res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

module.exports = router;