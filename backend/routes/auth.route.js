import express from 'express';

import {
    signup,
    signin,
    signout,
    verifyEmail,
    getAllUsers,
    forgetPassword,
    resetPassword,
    checkAuth,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

router.post('/verify-email', verifyEmail);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
