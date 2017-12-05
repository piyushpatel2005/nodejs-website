const Joi = require('joi');

module.exports  = {
    body: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/[a-zA-Z0-9@#$%&*!]{8,20}/).required(),
        confirmation: Joi.string().regex(/[a-zA-Z0-9@#$%&*!]{8,20}/).required()
    }
}