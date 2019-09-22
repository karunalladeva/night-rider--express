var User = require('../models/user');

const { sanitizeBody } = require('express-validator');
/**
 * Handle User create on POST.
 * Process request after validation and sanitization.
 * sanitizeBody used to avoiding the JSX vulunareability. 
 */

exports.addUser = [
    sanitizeBody('name').trim().escape(),
    sanitizeBody('email').trim().escape(),
    sanitizeBody('password').trim().escape(),
    async (req, res, next) => {
        let isUserIn
            , users;
            
        try{
            isUserIn = await User.find({ 'email': req.body.email });
        }catch(error){
           return jsonResponse(res, 209,false,[],"Mongo error, Try later!")
        }    

        if (isUserIn) return jsonResponse(res, 202,false,[],"Email already exists");
        try{
            users = new User(
                {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
            await users.save();    
        }catch(error){
           return jsonResponse(res, 209,false,[],"Mongo error, Try later!")
        }

        return jsonResponse(res, 200,true,[],"");
    }

];

exports.getUser = async (req, res, next) => {
    let users;

    try {
        users = await User.find({ 'email': req.params.email });
    } catch (error) {
        return jsonResponse(res, 209, false, [], "Mongo error, Try later!")
    }

    return jsonResponse(res, 200, true, users, "");
};