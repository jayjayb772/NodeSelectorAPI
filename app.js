const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const nodeSelectRouter = require('./routes/nodeSelector');
const getCoordsToFile = require('./routes/getCoordsToFile');
const addNode = require('./routes/newAddNode');
const findNode = require('./routes/findNode');
const devEnd = require('./routes/devEndpoints/devMapboxEndpoint');
const formidable = require('express-formidable');
const bodyParser = require('body-parser');


const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
//app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.json());
app.use(formidable());// view engine setup

app.use('/', indexRouter);
app.use('/p', addNode);
app.use('/users', usersRouter);
app.use('/node-selector', nodeSelectRouter);
app.use('/csv-to-db', getCoordsToFile);
app.use('/find-node', findNode);
app.use('/dev-end', devEnd);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
