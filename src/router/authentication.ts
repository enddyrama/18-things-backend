import { login, register } from '../module/auth/controller/AuthenticationController';
import express from 'express';


export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login)
};