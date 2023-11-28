import { merge } from "lodash";
// import { getUserBySessionToken } from '../db/users';
import express from "express";
import jwt, { JwtPayload, decode } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  mail: string;
}

interface ExtendedRequest extends express.Request {
  email?: string;
}

export const verifyToken = async (
  req: ExtendedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  if (token === null) {
    return res.status(403).json({
      status: 403,
      message: "Unauthorized",
      status_code: 0,
    });
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded: MyJwtPayload) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: err.message,
          status_code: 0,
        });
      }
      req.email = decoded.mail;
      // req.body.email
      next();
    }
  );
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["JAMBRONG-AUTH"];
    if (!sessionToken) {
      return res.status(403).json({
        status: 403,
        message: "Unauthorized",
        status_code: 0,
      });
    }
    // const existingUser = await getUserBySessionToken(sessionToken);
    // if (!existingUser) {
    //     return res.status(403).json({
    //         status: 403,
    //         message: "Unauthorized",
    //         status_code: 0
    //     });
    // };

    // merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({
      status: 400,
      message: error.message,
      status_code: 0,
    });
  }
};
