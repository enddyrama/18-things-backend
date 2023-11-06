import { merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';
import express from 'express';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['JAMBRONG-AUTH'];
        if (!sessionToken) {
            return res.status(403).json({
                status: 403,
                message: "Unauthorized",
                status_code: 0
            });
        };
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.status(403).json({
                status: 403,
                message: "Unauthorized",
                status_code: 0
            });
        };

        merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.log("err", error);
        return res.status(400).json({
            status: 400,
            message: error.message,
            status_code: 0
        });
    };
}