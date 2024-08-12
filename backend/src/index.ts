import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import "dotenv/config";
import cors from "cors";

const app = express();

const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

mongoose.connect(MONGO_URI, {
  dbName: "socialyze",
});

app.get("/", (req, res) => {
  res.send("Hello duniya!");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
