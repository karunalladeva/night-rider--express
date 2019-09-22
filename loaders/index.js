var app = require('../app');
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);