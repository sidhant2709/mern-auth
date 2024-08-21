import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
} from '../mailtrap/emails.js';
import {
    validateSigninInput,
    findUserByEmail,
    checkPassword,
    checkEmailVerification,
    updateUserLoginDetails,
} from '../middlewares/auth.middleware.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.log('error in getAllUsers', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const checkAuth = async (req, res) => {
    const { userId } = req;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log('error in checkAuth', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            console.log('userAlreadyExists', userAlreadyExists);
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user._id);

        // await sendVerificationEmail(user.email, verificationToken);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log('error in signup', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Verification token is invalid or has expired' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        // await sendWelcomeEmail(user.email, user.name);

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log('error in verifying email', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

/*
export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ success: false, message: 'User does not exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
        return res.status(400).json({ success: false, message: 'Email is not verified' });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = Date.now();

    await user.save();

    return res.status(200).json({
        success: true,
        message: 'Signin success',
        user: {
            ...user._doc,
            password: undefined,
            isVerified: undefined,
        },
    });
};

*/

export const signin = [
    validateSigninInput,
    findUserByEmail,
    checkPassword,
    checkEmailVerification,
    async (req, res) => {
        const { user } = req;
        generateTokenAndSetCookie(res, user._id);
        await updateUserLoginDetails(req, res, () => {
            // No operation (noop)
        });
        return res.status(200).json({
            success: true,
            message: 'Signin success',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    },
];

export const signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Signout successfully' });
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;

        await user.save();

        // await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);

        return res.status(200).json({
            success: true,
            message: 'Reset password email sent successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log('error in forgetPassword', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        // await sendPasswordResetSuccessEmail(user.email);

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log('error in resetPassword', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
