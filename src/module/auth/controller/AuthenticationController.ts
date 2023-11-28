// import { createUser, getUserByEmail, getUserByUsername } from '../db/users';
import express from "express";
import { authentication, random } from "../../../helpers";
import {
  getUserByEmail,
  createUser,
} from "../../user/repository/UserRepository";
import bycrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv({ path: "./.env" });

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({
        status: 400,
        message: "email, password are required",
        status_code: 0,
      });
    }
    const user = await getUserByEmail({ email });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "User is not exist",
        status_code: 0,
      });
    }
    const match = await bycrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        status: 400,
        message: "Wrong Password",
        status_code: 0,
      });
    }
    const { id, email: usermail, password: passuser } = user;
    console.log("match", id, usermail, password);
    const accessToken = jwt.sign(
      { id, email, password },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { id, email, password },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      status: 200,
      result: {
        token: accessToken,
        user: user,
      },
      status_code: 1,
    });
  } catch (err) {
    console.log(" " + err);
    return res.status(400).json({
      status: 400,
      message: "not connected due to error",
      status_code: 0,
    });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({
        status: 400,
        message: "email, password, username are required",
        status_code: 0,
      });
    }
    const existingEmail = await getUserByEmail({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: 400,
        message: "Email already exist",
        status_code: 0,
      });
    }
    try {
      const insert = await createUser({ email, password, username });
      if (insert) {
        return res.status(201).json({
          status: 201,
          message: "User registered successfully",
          status_code: 1,
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "Failed to insert data",
          status_code: 1,
        });
      }
    } catch (err) {
      console.log(" " + err);
      return res.status(400).json({
        status: 400,
        message: "not connected due to error",
        status_code: 0,
      });
    }
  } catch (error) {
    console.log("err", error);
    return res
      .status(400)
      .json({
        status: 400,
        message: error.message,
        status_code: 0,
      })
      .end();
  }
};
