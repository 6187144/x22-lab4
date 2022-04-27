var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var axios = require('axios').default;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

const geoKey = "4120607b14064b6f80abcef15b430167";

app.get('/api/location', async function(req, res) {
    // let ip = req.ip; // useless for testing

    let ip = "2607:fa49:6800:8700:2c92:8908:81fe:c31a"; // used for testing
    //let ip= req.ip; 
    console.log(ip);
    
    let ipUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${geoKey}&ip=${ip}`;

    let response = await axios.get(ipUrl);

    let data = response.data;

    res.json({ lat: data.latitude, lng: data.longitude, ip: ip });

});


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