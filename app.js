var express = require('express');
var fs = require('fs');
var jade = require('jade');
var ejs = require('ejs');

var app = express();

////////////////////////////////////////////////////////////////////////////////
// options

var indexes = [
  "index.html",
  "index.ejs",
  "index.jade",
];

var renders = {};

renders['.jade'] = function (data) {
  var fn = jade.compile(data, {});
  return fn({});
};

renders['.ejs'] = function (data) {
  return ejs.compile(data)();
};

////////////////////////////////////////////////////////////////////////////////
// implement

var match_index = function (req, res, next) {
  var path = __dirname + '/public' + req.path;
  fs.readdir(path, function(err, files) {
    if (err) {
      next();
    } else {
      var index = "";
      for (var i = 0; i < indexes.length; ++i) {
        if (files.indexOf(indexes[i]) !== -1) {
          index = indexes[i];
          break;
        }
      }
      req.url = req.url + index;
      next();
    }
  });
};

// index
app.use(function (req, res, next) {
  var path = __dirname + '/public' + req.path;
  fs.lstat(path, function (err, stats) {
    if (err) {
      next();
    } else if (stats.isDirectory()) {
      if (req.path.match(/\/$/)) {
        match_index(req, res, next);
      } else {
        res.redirect(req.path + '/');
      }
    } else {
      next();
    }
  });
});

// render
app.use(function (req, res, next) {
  ext = req.path.match(/\.[a-zA-Z0-9]+$/)[0];
  if (renders[ext]) {
    var path = __dirname + '/public' + req.path;
    fs.readFile(path, "utf-8", function (err, data) {
      if (err) {
        next(); 
      } else {
        res.send(renders[ext](data));
      }
    });
  } else {
    next();
  }
});

app.use(express.static('public', {
  index: false
}));

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
