const router = require("express").Router();
const Post = require("../models/Posts")
const User = require("../models/User")


// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})



// update a posts   params.id->post   
router.put("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set : req.body});
            res.status(200).json("Posts updated")
        }else{
            res.status(403).json("Cannot update other posts")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})



// delete a post

router.delete("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Posts deleted")
        }else{
            res.status(403).json("Cannot delete other posts")
        }
    } catch (error) {
        res.status(500).json(error)
    }

})




// like/dislike a post params.id -> postId

router.put("/:id/like", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        // if post likes array doesnot contain that user,
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("Liked your post")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("Disliked your post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})


// get a post   params.id->post

router.get("/:id", async (req, res)=>{
    try {
        const post =await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})


// get timeline

router.get("/timeline/all", async(req,res)=>{
    
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPost = await Post.find({userId:currentUser});
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId})
            })
        )
        res.json(userPost.concat(...friendPost))
    } catch (error) {
        res.status(500).json(error)
    }
})




module.exports = router;