const nexmo = require('../config/nexmo');
const jwt = require('jsonwebtoken');
/*
 * return site name
 */
exports.siteName = ()=>{
    return "Trippy";
}

/*
* send sms using nexmo
*/
exports.sendSms = (from,to,message) => {
    nexmo.message.sendSms('919578663674', to, "hai",(err, responseData) => {});
}

/**
 * 
 * @param {"json object"} payload 
 * @param {"options like expiresIn..."} options 
 */
exports.jwtgen = (payload,options = {}) => {
    return jwt.sign({...payload}, process.env.JWT_SECRET, options);
}