import { createUser, getUserByEmail, getUserByUsername } from '../db/users';
import express from 'express';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({
                status: 400,
                message: "email, password are required",
                status_code: 0
            })
        };
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "User is not exist",
                status_code: 0
            })
        };
        const expectedHash = authentication(user.authentication.salt, password);
        console.log("ex", expectedHash)
        console.log("use", user.authentication.password)
        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({
                status: 403,
                message: "Wrong Password",
                status_code: 0
            })
        };
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();
        res.cookie("JAMBRONG-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log("err", error);
        return res.status(400).json({
            status: 400,
            message: "Internal Server Error",
            status_code: 0
        })
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    console.log("masuk")
    try {
        console.log("masuk sni")
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({
                status: 400,
                message: "email, password, username are required",
                status_code: 0
            })
        };

        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                status: 400,
                message: "Email already exist",
                status_code: 0
            }).end()
        };
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "Username already exist",
                status_code: 0
            }).end()
        };
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
        });
        return res.status(200).json(user).end()
    } catch (error) {
        console.log("err", error);
        return res.status(400).json({
            status: 400,
            message: error.message,
            status_code: 0
        }).end()
    }
}