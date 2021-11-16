const router = require("express").Router();
const Post = require("../models/Post");
//create post
router.put("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(400).send("Bad request");
    }
});

//update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("post has beeen updated");
        } else {
            res.status(403).send("you can update your post only");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//delet the post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("post has beeen delted");
        } else {
            res.status(403).send("you can delete your post only");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// like / dislike post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.likes.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post has been liked");
        } else {
            await post.likes.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// get timeline
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const currentPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(UserPosts.concat(...friendsPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});

// get post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

/// get users all posts
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const post = await Post.findById({ userId: user._id });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;