const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// update
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password,salt)
            }catch(err){
                console.log(err)
                return res.json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,
                {$set : req.body})
            res.status(201).send({message:"Account has been updated"})

        }catch(err){
            return res.status(401).json(err)
        }
    }else{
        res.status(401).json("Cannot update other account")
    }
})



// delete
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(201).send({message : "Account deleted successfully"})
        }catch(err){
            return res. status(401).json(err)
        }
    }else{
        return res. status(401).send({error : "Cannot delete others account"})
    }
})



// get a user
router.get("/:id", async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc
        res.status(201).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})


// follow   currentUser-> requesting to follow(userId)    user-> who will be followed(params)
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})

                res.status(200).json("User has been followed")
            }else{
                return res.status(400).json("Already followed")
            }
        } catch (error) {
            
        }
    }else{
        res.status(401).json("Cannot follow own")
    }
})



// unfollow    

router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if( user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}})

                res.status(200).json("User has been unfollowed")
            }else{
                return res.status(400).json("Not followed by you")
            }
        } catch (error) {
            
        }
    }else{
        res.status(401).json("Cannot unfollow own")
    }
})


module.exports = router;