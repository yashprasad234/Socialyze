import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
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
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

export const Comment = mongoose.model("Comment", CommentSchema);
