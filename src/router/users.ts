import { isAuthenticated } from '../middlewares';
import { deleteUsers, getAllUsers, getUser } from '../controllers/users';
import express from 'express';
import { deleteUserById } from '../db/users';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id', deleteUsers);
    router.get('/users/:id', getUser);
    return router;
};