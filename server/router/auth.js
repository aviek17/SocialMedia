const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username: username, email: email, password: hashedPassword })

        const storeUser = await user.save();
        res.status(201).json(storeUser)
    } catch (err) {
        console.log(err)
    }
})

// LogIn
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ emai: req.body.email });
        if (!user) {
            res.status(404).send({ error: "User not found" });
        }else{
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword) {
                res.status(400).send({ error: "Invalid Details"})
            }else{
                res.status(201).send({message:"Log in Success"})
            }
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;