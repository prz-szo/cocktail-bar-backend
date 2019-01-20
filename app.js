const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const cocktailsRouter = require('./routes/cocktails');
const ingredientsRouter = require('./routes/ingredients');
const loginRouter = require('./routes/login');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cocktails', cocktailsRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/login', loginRouter);

// 404 && 500
app.use((req, res) => {
  res.status(404).json({ message: '404 - Not Found' })
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '500 - Server Error' })
});

module.exports = app;
