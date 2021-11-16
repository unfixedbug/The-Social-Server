const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                $set: req.body,
            });
            res.status(200).json("account updated");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can update your account only");
    }
});
// delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can delete your account only");
    }
});
// get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});
// follow user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {

                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("followed ");
            } else {
                res.status(403).json("you already follow this user");
            }
            res.status(200).json(other);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can follow other users only");
    }
});

// un-follow user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId != req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {

                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("unfollowed bitch ");
            } else {
                res.status(403).json("you dont follow this user");
            }
            res.status(200).json(other);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can follow other users only");
    }
});


module.exports = router;