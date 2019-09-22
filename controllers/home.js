//require your models

/**
 * Get Home
 */
exports.getHome = function (req, res, next) {
    res.render('index', { title: 'Night Rider' });
};