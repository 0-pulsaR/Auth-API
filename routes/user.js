const router = require("express").Router();
const { verifyCookieToken } = require('../midware/verifyToken');
const CryptoJS = require('crypto-js');
const User = require("../models/User");
const { username, password, paramsIdTokenSchema, email } = require('../validator/schemes');
const verifyContentType = require("../midware/verifyContentType");
const sendMail = require('../utils/mailer');
const { resetPasswordHTMLSchema } = require('../utils/mailHTMLSchemes');
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');

// GET USERNAME

router.get('/', verifyCookieToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user.username);
    } catch (err) {
        res.status(400).json('Invalid request..');
    }
});

// CHANGE USERNAME

router.put('/change-username', verifyCookieToken, verifyContentType, async (req, res) => {
    try {
        const sanitizedUsername = await username.validateAsync(req.body.username);
        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                username: sanitizedUsername
            }
        }, { new: true });
        
        res.status(200).json('Username changed successfully !');
    } catch (err) {
        if(err.isJoi) return res.status(400).json(err.message);
        res.status(500).json('Something went wrong..');
    }
});

// CHANGE PASSWORD

router.put('/change-password', verifyCookieToken, verifyContentType, async (req, res) => {
    try {
        const sanitizedPassword = await password.validateAsync(req.body.password);
        const encPass = CryptoJS.AES.encrypt(sanitizedPassword, process.env.USER_SECRET).toString();

        await User.findByIdAndUpdate(req.user.id, {
            $set: {
                password: encPass
            }
        }, { new: true });

        res.status(200).json('Password changed successfully !');
    } catch (err) {
        if(err.isJoi) return res.status(400).json(err.message);
        res.status(500).json('Something went wrong..');
    }
});

// FORGOT PASSWORD (forgotten password)

router.get('/forgot-password/:email', async (req, res) => {
    try {
        const sanitizedEmail = await email.validateAsync(req.params.email);
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) return res.status(404).json('Email not found..');

        const confirmationToken = await new PasswordResetToken({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();
        
        const url = `${process.env.RESET_PASSWORD_URI}${user._id}/${confirmationToken.token}`;
        
        await sendMail(user.email, 'Reset Password', resetPasswordHTMLSchema(url));
        
        res.status(200).json('Email has been sent to your account..');
    } catch (err) {
        if(err.isJoi) return res.status(400).json(err.message);
        res.status(500).json('Something went wrong..');
    }
});

// RESET PASSWORD

router.put('/reset-password/:id/:token', async (req, res) => {
    try {
        const sanitizedParams = await paramsIdTokenSchema.validateAsync(req.params);
        const user = await User.findOne({ _id: sanitizedParams.id });
        if (!user) return res.status(400).json('Something went wrong..');
        const sanitizedPassword = await password.validateAsync(req.body.password);
        const token = await PasswordResetToken.findOne({ 
            userId: sanitizedParams.id,
            token: sanitizedParams.token
        });
        
        if (!token) return res.status(400).json('Something went wrong..');
        
        const encPass = CryptoJS.AES.encrypt(sanitizedPassword, process.env.USER_SECRET).toString();
        await User.findByIdAndUpdate(sanitizedParams.id, {
            $set: {
                password: encPass,
                loginAttempts: 0
            }
        }, { new: true });
        
        await PasswordResetToken.deleteOne({ userId: sanitizedParams.id, token: sanitizedParams.token });

        res.status(200).json('Password changed successfully !');
    } catch (err) {
        if(err.isJoi) return res.status(400).json(err.message);
        res.status(500).json('Something went wrong..');
    }
});

// DELETE USER

router.delete('/delete-account', verifyCookieToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('token').status(200).json('User has been deleted successfully..');
    } catch (err) {
        return res.send(500).json('Something went wrong..');
    }
});

module.exports = router;



