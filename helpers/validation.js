const jwt = require('jsonwebtoken');
// const User = require('../models/user');

/**
 * JWT validation
 * @param {request} req 
 * @param {response} res 
 * @param {CallableFunction} next 
 */
exports.validateToken = async (req, res, next) => {
    const authorizationHeaader = req.headers.oauth;
    let result;
    if (authorizationHeaader) {
        const token = req.headers.oauth.split(' ')[1]; // Bearer <token>
        const options = {
            issuer: req.headers.deviceId
        };
        try {
            // verify makes sure that the token hasn't expired and has been issued by us
            result = jwt.verify(token, process.env.JWT_SECRET, options);

            // Let's pass back the decoded token to the request object
            req.user = result;
            // We call next to pass execution to the subsequent middleware
            next();
        } catch (err) {
            // Throw an error just in case anything goes wrong with verification
            // throw new Error(err);
            res.apiResponse(false,`Authentication failed.`)
        }
    } else {
        res.apiResponse(false,`Authentication error. Token required.`)
    }
}

exports.deviceIdValidator = (req,res,next) => {
    if (!req.headers.deviceid || req.headers.deviceid === "")
        res.apiResponse(false,`Authentication failed. deviceId required.`)
    else
        next()
}