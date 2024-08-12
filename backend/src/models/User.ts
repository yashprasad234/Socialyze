import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
    required: false,
  },
  coverPic: {
    type: String,
    default: "",
    required: false,
  },
  from: {
    type: String,
    default: "",
    required: false,
  },
  currentCity: {
    type: String,
    default: "",
    required: false,
  },
  relationship: {
    type: Number,
    default: 0,
    required: false,
  },
  birthday: {
    type: Date,
    default: new Date("01/01/1999"),
    required: false,
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
    required: false,
  },
  requests: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
    required: false,
  },
  blocked: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
    required: false,
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "Post",
    required: false,
  },
});

export const User = mongoose.model("User", UserSchema);
