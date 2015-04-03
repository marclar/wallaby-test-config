require('./globals');

//Load env vars
require('dotenv').load();

var fs = require('fs');
var path = require('path');
var express = require('express');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var expressBeautify = require('express-beautify')();

var app = express();
app.use(compression());
app.use(cookieParser());
app.use(require('serve-favicon')(__dirname + '/public/favicons/favicon.ico'));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(expressBeautify);

var package = require('./package.json');

var defaultAppName = process.env.APP ? process.env.APP : 'app';

var routes = require('./src/jsx/'+defaultAppName+'/routes.jsx');

var webpack_host = process.env.WHOST ? process.env.WHOST : 'localhost';
var webpack_dev_server_port = process.env.WPORT ? process.env.WPORT : 8079;

var markup = require('./markup.jsx');

var page = new markup(defaultAppName, 'index.html', webpack_host, webpack_dev_server_port);


/** BEGIN X-EDITABLE ROUTES */

app.get('/xeditable/groups', function(req, res) {
  res.send([
    {value: 0, text: 'Guest'},
    {value: 1, text: 'Service'},
    {value: 2, text: 'Customer'},
    {value: 3, text: 'Operator'},
    {value: 4, text: 'Support'},
    {value: 5, text: 'Admin'}
  ]);
});

app.get('/xeditable/status', function(req, res) {
  res.status(500).end();
});

app.post('/xeditable/address', function(req, res) {
  res.status(200).end();
});

app.post('/dropzone/file-upload', function(req, res) {
  res.status(200).end();
});

/** END X-EDITABLE ROUTES */

app.get('/ltr', function(req, res, next) {
  res.redirect('/');
});

app.get('/rtl', function(req, res, next) {
  res.redirect('/');
});

/** CATCH-ALL ROUTE **/
app.get('*', function(req, res, next) {
  if(req.url === '/favicon.ico') return next();
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  var isRTL = req.cookies.rubix_dir === 'rtl' ? true : false;
  try {

    page.render(req, res, function(err, h, token) {
      if(isRTL)
        h = page.rtl.replace(new RegExp('{container}', 'g'), h || '');
      else
        h = page.ltr.replace(new RegExp('{container}', 'g'), h || '');

      if (!err) {
        res.sendHTML(h);
      } else if (error.redirect) {
        res.redirect(error.redirect.to);
      } else if (error.notFound) {
        res.status(404).sendHTML(h);
      }
    });
  } catch(e) {
    if(isRTL)
      res.sendHTML(page.rtl);
    else
      res.sendHTML(page.ltr);
  }
});

var server = app.listen(process.env.PORT || 8081, function() {
  try {
    process.send('CONNECTED');
  } catch(e) {}
});

process.on('uncaughtException', function(err) {
  console.log(arguments);
  process.exit(-1);
});
