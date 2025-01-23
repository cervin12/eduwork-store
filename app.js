var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const productRoutes = require('./app/product/routes')
const tagRouter = require('./app/tags/routes')
const categoryRouter = require('./app/category/routes')
const userRouter = require('./app/auth/routes')
const orderRouter = require('./app/order/routes')
const cartRouter = require('./app/cart/routes')
const deliveryAddressRouter = require('./app/deliveryAddress/routes')
const { ForbiddenError } = require('@casl/ability')
var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', userRouter)
app.use('/api', productRoutes)
app.use('/api', tagRouter)
app.use('/api', categoryRouter)
app.use('/api', orderRouter)
app.use('/api', cartRouter)
app.use('/api', deliveryAddressRouter)


app.use((err, req, res, next) => {
  if (err instanceof ForbiddenError) {
    return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
  }

  // Handle other types of errors
  console.error(err); // Log the error for debugging
  res.status(err.status || 500).json({
    error: 1,
    message: err.message || 'Internal Server Error',
  });
});


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });



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
