import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authenticateJwt } from "../middleware/auth";
import "dotenv/config";
import { Post } from "../models/Post";

const app = express();
const AUTH_SECRET = process.env.AUTH_SECRET || "";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Hello duniya from User" });
});

// Signup
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password == confirmPassword) {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = new User({ firstName, lastName, email, password });
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id }, AUTH_SECRET);
      res.json({
        msg: "New user created successfully",
        token,
      });
    } else {
      res.status(403).json({ msg: "Email already in use" });
    }
  } else {
    res.json({ msg: "Password and Confirm Password don't match" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.headers.email,
  });
  const password = req.headers.password;
  if (password == user?.password) {
    const token = jwt.sign({ userId: user?._id }, AUTH_SECRET);
    res.json({ msg: "Logged in successfully", token });
  } else {
    res.status(403).json({ msg: "Incorrect email or password!" });
  }
});

// Update Bio
router.put("/updatebio", authenticateJwt, async (req, res) => {
  const { profilePic, coverPic, from, currentCity, relationship, birthday } =
    req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(req.headers["userId"], {
      profilePic,
      coverPic,
      from,
      currentCity,
      relationship,
      birthday,
    });
    await updatedUser?.save();
    res.json({
      msg: "Bio updated successfully",
    });
  } catch (error) {
    res.status(404).json({ msg: "Failed to update bio", error });
  }
});

// Friend request send route
router.put("/request/:id", authenticateJwt, async (req, res) => {
  const otherUser = await User.findById(req.params.id);
  if (otherUser) {
    const updatedOtherUser = await User.updateOne(
      { _id: req.params.id },
      { $push: { requests: req.headers["userId"] } }
    );
    res.json({ msg: "Friend request sent successfully", otherUser: otherUser });
  } else {
    res.status(404).json({
      msg: "Unable to send friend request currently, please try again later",
    });
  }
});

// Friend request accept route
router.put("/requests/accept/:id", authenticateJwt, async (req, res) => {
  try {
    const updatedOtherUser = await User.updateOne(
      { _id: req.params.id },
      { $push: { friends: req.headers["userId"] } }
    );
    const updateCurrentUser = await User.updateOne(
      { _id: req.headers["userId"] },
      { $push: { friends: req.params.id }, $pull: { requests: req.params.id } }
    );
    res.json({ msg: "Friend request accepted" });
  } catch (error) {
    res
      .status(403)
      .json({ msg: "Friend request can't be accepted right now.", error });
  }
});

// Friend request reject route
router.put("/requests/reject/:id", authenticateJwt, async (req, res) => {
  try {
    const updateCurrentUser = await User.updateOne(
      { _id: req.headers["userId"] },
      { $pull: { requests: req.params.id } }
    );
    res.json({ msg: "Friend request rejected" });
  } catch (error) {
    res
      .status(403)
      .json({ msg: "Friend request can't be rejected right now.", error });
  }
});

// Block/Unblock user route
router.put("/block/:id", authenticateJwt, async (req, res) => {
  try {
    const currUser = await User.findById(req.headers["userId"]);
    const otherUser = await User.findById(req.params.id);
    const isBlocked = otherUser
      ? currUser?.blocked?.includes(otherUser._id)
      : false;
    if (isBlocked) {
      const unblockUser = await User.updateOne(
        { _id: req.headers["userId"] },
        { $pull: { blocked: req.params.id } }
      );
      res.json({ msg: "User unblocked successfully" });
    } else {
      const blockUser = await User.updateOne(
        { _id: req.headers["userId"] },
        { $push: { blocked: req.params.id } }
      );
      res.json({ msg: "User blocked successfully" });
    }
  } catch (error) {
    res.status(403).json({ msg: "Failed to block/unblock user" });
  }
});

// Timeline view
router.get("/timeline", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findById(req.headers["userId"]);
    const posts = user?.posts;
    res.json({ msg: "Fetched posts successfully", posts });
  } catch (error) {
    res.status(403).json({ msg: "Failed to fetch posts", error });
  }
});

// Profile viewing
router.get("/:id", authenticateJwt, async (req, res) => {
  try {
    const user = await User.find(
      { _id: req.params.id },
      {
        firstName: 1,
        lastName: 1,
        profilePic: 1,
        coverPic: 1,
        from: 1,
        currentCity: 1,
        relationship: 1,
        birthday: 1,
        posts: 1,
        friends: 1,
      }
    );
    res.json({ msg: "Fetched user successfully", user });
  } catch (error) {
    res.status(403).json({ msg: "Failed to fetch User's data", error });
  }
});

export default router;
