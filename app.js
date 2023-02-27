"use strict";
require('marko/express'); 
require('marko/node-require').install();
require('marko/compiler').configure({ writeToDisk: false });

var compression = require('compression'),
express = require('express'),
app = express(),
cookieParser = require('cookie-parser'),
errpage = require('./views/Shared/error.marko')

app.use(compression())
app.use(cookieParser());

app.locals.staticdir = process.env.node_env == "PRODUCTION" ? 'https://d3sh86b159avjl.cloudfront.net' : '/static';

app.settings.env = process.env.node_env == "PRODUCTION" ? 'production' : 'development';

//console.log(new Date().toISOString())
var routes = require('./controller/index'),
users = require('./controller/Users/user'),
amazon = require('./controller/Amazon'),
onedrive = require('./controller/One'),
google = require('./controller/Google'),
dropbox = require('./controller/Dropbox'),
facebook = require('./controller/Facebook'),
instagram = require('./controller/Instagram');


app.use('/', routes)
app.use('/users', users)
app.use('/amazon',amazon)
app.use('/one', onedrive)
app.use('/google', google)
app.use('/dropbox',dropbox)
app.use('/facebook', facebook)
app.use('/instagram', instagram);

//console.log(new Date().toISOString())
app.disable('x-powered-by');

if (app.get('env') === 'development') {
    app.use('/static', express.static(__dirname + '/client'));
    app.use('/', express.static(__dirname + '/client'));
    
    var path = require('path')
    var viewsDir = path.join(__dirname, 'views/Home')
    require('marko/hot-reload').enable();
    require('fs').watch(viewsDir, function (event, filename) {
        if (/\.marko$/.test(filename)) {
            // Resolve the filename to a full template path:
            var templatePath = path.join(viewsDir, filename);

            console.log('Marko template modified: ', templatePath);

            // Pass along the *full* template path to marko
            require('marko/hot-reload').handleFileModified(templatePath);
        }
    });
    
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

if (app.get('env') === 'development') {
    app.use(function(req, res, next) {
      res.render = function() {
        throw new Error('res.render should not be called!');
      };next();
    });
}
// error handler
app.use(function (error, req, res, next) {
  if (!error) {
    next()
  } else {
     var errdetail = "Method: " + req.method + "  " + req.originalUrl + '\r\n' + 'From: ' + req.headers['referer'];
    if (app.get('env') === 'development') {
      console.error(error.status + " : " + error.message + '\r\n' + errdetail);
    }
    res.marko(errpage, { status: error.status, message:error.message, errdetail:errdetail});
  }
})

app.listen(process.env.PORT);
module.exports = app;

