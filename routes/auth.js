const dotenv = require('dotenv').config();
const sendMail = require('../utils/mailer');
const router = require('express').Router();
const User = require('../models/User');
const EmailVerificationToken = require('../models/EmailVerificationToken');
const CryptoJS = require('crypto-js'); 
const jwt = require('jsonwebtoken');
const { verifyCookieToken } = require('../midware/verifyToken');
const { registerUserSchema, paramsIdTokenSchema, loginSchema, email } = require('../validator/schemes');
const verifyContentType = require('../midware/verifyContentType'); 
const crypto = require('crypto');
const { confirmEmailSchema } = require('../utils/mailHTMLSchemes');

// REGISTER

router.put('/register',  verifyContentType, async (req, res) => {
    try {
        const { username, email, password } = await registerUserSchema.validateAsync(req.body);
        const newUser = await new User({
            username: username,
            email: email,
            password: CryptoJS.AES.encrypt(password, process.env.USER_SECRET).toString()
        }).save();

        const verifyEmailToken = await new EmailVerificationToken({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save();
        
        const url = `${process.env.CONFIRM_EMAIL_URI}${newUser._id}/verify-email/${verifyEmailToken.token}`;
        await sendMail(newUser.email, 'Welcome !', confirmEmailSchema(newUser.username, url));
        res.status(201).json('Verification email has been sent to your account.');
    } catch (err) {
        if(err.isJoi) return res.status(400).json(err.message);
        res.status(500).json('Something went wrong..');
    }
});

// RESEND EMAIL VERIFICATION TOKEN

router.get('/resend-email-verification-token/:email', async (req, res) => {
    try {
        const sanitizedEmail = await email.validateAsync(req.params);
        const user = await User.findById({ email: sanitizedEmail });
        if (!user) return res.status(400).json('Invalid request..');
        const token = await EmailVerificationToken.findOne({ userId: user._id });
        if (!token) return res.status(400).json('Invalid request..');

        const url = `${process.env.CONFIRM_EMAIL_URI}${user._id}/verify-email/${token.token}`;
        await sendMail(user.email, 'Welcome !', confirmEmailSchema(user.username, url));
        
        res.status(201).json('Verification email has been sent to your account.');
    } catch (error) {
        res.status(500).json('Something went wrong..');
    }
});

// CONFIRM USER VIA EMAIL TOKEN

router.get('/verify-email/:id/verify-email/:token', async (req, res) => {
    try {
        const { id, token } = await paramsIdTokenSchema.validateAsync(req.params);
        const user = await User.findById({ _id: id });
        if (!user) return res.status(400).json('Invalid request..');
        const emailVerificationToken = await EmailVerificationToken.findOne({
            userId: user._id,
            token: token
        });
        if (!emailVerificationToken) return res.status(400).json('Invalid request..');
        await User.findByIdAndUpdate({ _id: user._id }, {
            $set: {
                verified: true
            } 
        }, { new: true });

        await EmailVerificationToken.deleteOne({ userId: user._id, token: token });

        res.status(200).json('Email verified successfully!');
    } catch (error) {
        res.status(500).json('Something went wrong..');
    }
});

// LOGIN

router.put('/login', verifyContentType, async (req, res) => {
    try {
        const { email, password } = await loginSchema.validateAsync(req.body);
        const user = await User.findOne({ email: email }); 
        if (!user) return res.status(401).json('Invalid email !');
        if (!user.verified) return res.status(401).json('Please verify your email..');
        if (user.loginAttempts === 5) return res.status(400).json('Too many incorrect login attempts, please reset your password..');
        const pass = CryptoJS.AES.decrypt(user.password, process.env.USER_SECRET).toString(CryptoJS.enc.Utf8);
        if (pass !== password) { 
            await User.findByIdAndUpdate( user._id, {
                $set: {
                    loginAttempts: user.loginAttempts + 1
                }
            });
            return res.status(401).json('Wrong Password..');
        }
        
        await User.findByIdAndUpdate( user._id, {
            $set: {
                loginAttempts: 0
            }
        });

        const accessToken = jwt.sign({
            id: user._id,
        }, process.env.JWT_SEC, 
           { expiresIn: "1d" }
        );

        const encAccessToken = CryptoJS.AES.encrypt(accessToken, process.env.ENC_TOKEN_KEY).toString();
        // cookie 
        res.cookie("token", encAccessToken, {
            httpOnly: true,
            // secure: true,
        });

        res.status(200).json('Login successfull !');  
    } catch(err){
        if(err.isJoi) return res.status(400).json(err.message);
        res.status(500).json('Something went wrong..');
    }
});

// LOGOUT

router.get('/logout', verifyCookieToken, async (req, res) => {
    try {
        res.clearCookie('token').status(200).json('Logged out !');
    } catch (err) {
        res.status(500).json('Something went wrong..');
    }
});

module.exports = router;