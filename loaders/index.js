var app = require('../app');

/**
 * Load MongoDB
 */

require('./mongoDB')

/** 
 * Load Router
*/
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);