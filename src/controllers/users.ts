import { deleteUserById, getUserById, getUsers } from '../db/users';
import express from 'express';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log("err", error);
        return res.status(400).json({
            status: 400,
            message: error.message,
            status_code: 0
        })
    }
};
export const getUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const users = await getUserById(id);
        if (!users) {
            return res.status(400).json({
                status: 400,
                message: "No user by this Id",
                status_code: 0
            })
        }
        return res.status(200).json(users);
    } catch (error) {
        console.log("err", error);
        return res.status(400).json({
            status: 400,
            message: error.message,
            status_code: 0
        })
    }
};

export const deleteUsers = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);

        await deleteUserById(id);
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "No user by this Id",
                status_code: 0
            })
        }
        return res.status(200).json({
            status: 200,
            message: "Successfully deleted",
            status_code: 1
        })
    } catch (error) {
        console.log("err", error);
        return res.status(400).json({
            status: 400,
            message: error.message,
            status_code: 0
        })
    }
};