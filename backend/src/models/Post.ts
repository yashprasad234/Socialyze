import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: false,
  },
  caption: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: false,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    required: false,
  },
});

export const Post = mongoose.model("Post", PostSchema);
