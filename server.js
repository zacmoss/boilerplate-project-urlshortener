'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



app.post('/api/shorturl/new', function(req, res) {
  let url = req.body.url;
  let number = (Math.random() * 99).toFixed(0);
  let error = undefined;
  //console.log(url.indexOf('https://'));
  if (url.indexOf('https://') === -1) {
    error = "invalid url";
    console.log("no https://");
    res.json({"error": "invalid url"});
  } else {
    let short = url.slice(8);
    //console.log("short" + short);
    dns.lookup(short, function(err) {
      if (err) {
        error = "invalid url";
        res.json({"error": "invalid url"});
      } else {
        res.json({"original_url": url, "shortened_url": number});
        app.get('/api/shorturl/' + number, function(req, res) {
          // link to url
          res.redirect(url);
        });
      }
    });
  }
  console.log(url);
  console.log(number);
  /*
  if (error) {
    res.json({"error": "invalid url"});
  } else {
    res.json({"original_url": url, "shortened_url": number});
    app.get('/api/shorturl/' + number, function(req, res) {
      // link to url
      res.redirect(url);
      //console.log('worked');
    });
  }
  */
  
});




app.listen(port, function () {
  console.log('Node.js listening ...');
});