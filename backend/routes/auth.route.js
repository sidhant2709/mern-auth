import express from 'express';
import { signup, signin, signout, verifyEmail, getAllUsers } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/users', getAllUsers);

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

router.post('/verify-email', verifyEmail);

export default router;
