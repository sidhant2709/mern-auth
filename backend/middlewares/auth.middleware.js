import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const handleError = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({ success: false, message });
};

export const validateSigninInput = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return handleError(res, 'All fields are required', 400);
    }
    next();
};

export const findUserByEmail = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return handleError(res, 'User does not exist', 400);
        }
        req.user = user;
        next();
    } catch (error) {
        return handleError(res, 'Server error');
    }
};

export const checkPassword = async (req, res, next) => {
    const { password } = req.body;
    const { user } = req;
    try {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return handleError(res, 'Invalid credentials', 400);
        }
        next();
    } catch (error) {
        return handleError(res, 'Server error');
    }
};

export const checkEmailVerification = (req, res, next) => {
    const { user } = req;
    if (!user.isVerified) {
        return handleError(res, 'Email is not verified', 400);
    }
    next();
};

export const updateUserLoginDetails = async (req, res, next) => {
    const { user } = req;
    try {
        user.lastLogin = Date.now();
        await user.save();
        next();
    } catch (error) {
        return handleError(res, 'Server error');
    }
};
