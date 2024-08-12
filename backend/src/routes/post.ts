import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authenticateJwt } from "../middleware/auth";
import "dotenv/config";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";

const app = express();
const AUTH_SECRET = process.env.AUTH_SECRET || "";
const router = express.Router();

// Create post
router.post("/create", authenticateJwt, async (req, res) => {
  try {
    const { imgUrl, caption } = req.body;
    const newPost = new Post({
      createdAt: Date.now(),
      imgUrl,
      caption,
      userId: req.headers["userId"],
    });
    await newPost.save();
    res.json({ msg: "New post created", post: newPost });
  } catch (error) {
    res.status(403).json({ msg: "Failed to create post", error });
  }
});

// Delete post
router.delete("/delete/:id", authenticateJwt, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted successfully" });
  } catch (error) {
    res.status(403).json({ msg: "Unable to delete post", error });
  }
});

// Liking/Unliking post
router.put("/like/:id", authenticateJwt, async (req, res) => {
  try {
    const currUser = await User.findById(req.headers["userId"]);
    const post = await Post.findById(req.params.id);
    const isLiked = currUser ? post?.likes?.includes(currUser?._id) : false;
    if (!isLiked) {
      const likePost = await Post.updateOne(
        { _id: req.params.id },
        { $push: { likes: req.headers["userId"] } }
      );
      res.json({ msg: "Liked post successfully" });
    } else {
      const unlikePost = await Post.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.headers["userId"] } }
      );
      res.json({ msg: "Unliked post successfully" });
    }
  } catch (error) {
    res.status(403).json({ msg: "Unable to like the post", error });
  }
});

// Commenting on post
router.post("/comment/:id", authenticateJwt, async (req, res) => {
  try {
    const { comment } = req.body;
    const newComment = new Comment({
      comment,
      createdAt: Date.now(),
      userId: req.headers["userId"],
      postId: req.params.id,
    });
    await newComment.save();
    const updatePost = await Post.updateOne(
      { _id: req.params.id },
      { $push: { comments: newComment._id } }
    );
    res.json({ msg: "Commented on the post successfully" });
  } catch (error) {
    res
      .status(403)
      .json({ msg: "Unable to comment on the post right now", error });
  }
});

// Delete Comment
router.delete("/comment/delete/:id", authenticateJwt, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const updatePost = await Post.updateOne(
      { _id: comment?.postId },
      { $pull: { comments: req.params.id } }
    );
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted comment successfully" });
  } catch (error) {
    res
      .status(403)
      .json({ msg: "Unable to comment on the post right now", error });
  }
});

export default router;
