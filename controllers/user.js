var User = require('../models/user');

exports.get_user = function (req, res, next) {
    res.render('signup', { title: 'Create User' ,user_status : req.session.user || false });
};