import { isAuthenticated, verifyToken } from '../middlewares';
import { deleteUsers, getAllUsers, getUser, putUser } from '../module/user/controller/UsersController';
import express from 'express';
// import { deleteUserById } from '../db/users';

export default (router: express.Router) => {
    router.get('/users', verifyToken, getAllUsers);
    router.delete('/users/:id', deleteUsers);
    router.get('/users/:id', getUser);
    router.put('/users/:id', putUser);
    return router;
};