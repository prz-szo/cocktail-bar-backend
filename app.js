var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cocktailsRouter = require('./routes/cocktails');
var ingredientsRouter = require('./routes/ingredients');
var loginRouter = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cocktails', cocktailsRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/login', loginRouter);

module.exports = app;
