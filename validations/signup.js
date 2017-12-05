const Joi = require('joi');

module.exports  = {
    body: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmation: Joi.string().required()
    }
}