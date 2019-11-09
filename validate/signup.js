const Joi = require('@hapi/joi');

const signupValidate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
    contact: Joi.string(),
    email: Joi.string(),
    location: Joi.string()
});
module.exports.signupValidate = signupValidate;