const verifyToken = require("../middlewares/verifyToken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();

userRouter.get("/find/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            throw new Error("No such user");
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
})

userRouter.get("/findAll", async (req, res) => {
    try {
        const users = await User.find({});

        if (!users) {
            throw new Error("No any user");
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error.message);
    }
})

userRouter.put("/updateUser/:userId", verifyToken, async (req, res) => {
    if (req.params.userId === req.user.id) {

        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            const updateUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
            return res.status(200).json(updateUser);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    } else {
        return res.status(403).json({ msg: "You can update only own profile." });
    }
})

userRouter.delete("/deleteUser/:userId", verifyToken, async (req, res) => {
    if (req.params.userId === req.user.id) {

        try {

            await User.findByIdAndDelete(req.params.userId)
            return res.status(200).json({ msg: "User deleted successfully." });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    } else {
        return res.status(403).json({ msg: "You can delete only own profile." });
    }
})

module.exports = userRouter;