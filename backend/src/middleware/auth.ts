import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

const AUTH_SECRET = process.env.AUTH_SECRET || "";

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader?.split(" ")[1];
    jwt.verify(token, AUTH_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ msg: "jwt failed to verify the token" });
      }
      if (!payload) {
        return res
          .status(403)
          .json({ msg: "no payload given for the given token" });
      }
      if (typeof payload === "string") {
        return res.status(403).json({ msg: "payload returned is a string" });
      }

      req.headers["userId"] = payload.userId;
      next();
    });
  } else {
    res.status(401).json({ msg: "no authorization header passed" });
  }
};
