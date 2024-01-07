const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const book = require('./routes/book');
const event = require('./routes/event');
const auth = require('./routes/auth');

const app = express(); 
app.use(logger('dev'));

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, 'build')));
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'build'));
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended':'false' }));

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

 mongoose.connect(process.env.MONGODB_URI || 'mongodb://Admin:admin1@bookstore-shard-00-00.dd7jg.mongodb.net:27017,bookstore-shard-00-01.dd7jg.mongodb.net:27017,bookstore-shard-00-02.dd7jg.mongodb.net:27017/bookstore?ssl=true&replicaSet=atlas-104jno-shard-0&authSource=admin&retryWrites=true&w=majority', {promiseLibrary: require('bluebird') })
  .then(() => console.log('Connection succesful!'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

app.use('/api/book', book);
app.use('/api/event', event);

app.use('/api/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// app.listen(port, () => console.log(`Server listening on port ${port}`));
// const server = createServer(app);
// server.listen(port, err => {
//   if (err) throw err;

//   console.log('Server started!');
// })

module.exports = app;