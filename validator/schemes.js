const Joi = require('joi');

// USER / AUTH
const username = Joi.string().trim().alphanum().min(3).max(30).required();
const email = Joi.string().email().trim().lowercase().required();
const password = Joi.string().trim().min(6).required();

// REQUEST PARAMETERS
const paramsID = Joi.string().trim().alphanum().min(1).max(30).required();
const paramsToken = Joi.string().trim().required();


// --- JOI OBJECTS

// USER / AUTH OBJECT SCHEMES
const registerUserSchema = Joi.object({
    username: username,
    email: email,
    password: password
});

const loginSchema = Joi.object({
    email: email,
    password: password
});


// REQUEST PARAMETER OBJECT SCHEMES
const paramsIdSchema = Joi.object({
    id: paramsID
});

const paramsIdTokenSchema = Joi.object({
    id: paramsID,
    token: paramsToken
});


module.exports = { 
    paramsIdSchema,
    registerUserSchema,
    loginSchema,
    username,
    password,
    paramsToken,
    email,
    paramsIdTokenSchema
};