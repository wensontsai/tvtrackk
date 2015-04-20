var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.set('port', process.env.PORT || 3030);


// db schemas //
var showSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  airsDayOfWeek: String,
  airsTime: String,
  firstAired: Date,
  genre: [String],
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  status: String,
  poster: String,
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  episodes: [{
    season: Number,
    espisodeNumber: Number,
    episodeName: String,
    firstAired: Date,
    overview: String
  }]
});

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash){
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Show = mongoose.model('Show', showSchema);

mongoose.connect('mongodb://localhost/tvtracker');



// Middleware //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  if (req.user){
    res.cookie('user', JSON.stringify(req.user));
  }
  next();
});


// protects routes from unauthenticated requests //
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}


// Routes //

// data is passed to passport LocalStrategy - if email is found && password valid, then new cookie is created with user object.  * user object is sent back to client *
app.post('/api/login', passport.authenticate('local'), function(req, res){
  res.cookie('user', JSON.stringify(req.user));
  res.send(req.user);
});

app.post('/api/signup', function(req, res, next){
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err){
    if(err) return next(err);
    res.send(200);
  });
});

// passport has a logout() function on req object that can be called from ANY ROUTE - terminates a login session.  invoking logout() will remove req.user property and clear login session
app.get('/api/logout', function(req, res, next) {
  req.logout();
  res.send(200);
});


// gets all shows
app.get('/api/shows', function(req, res, next){
  var query = Show.find();
  if(req.query.genre){
    query.where({ genre: req.query.genre });
  } else if (req.query.alphabet){
    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') })
  } else {
    query.limit(12);
  }
  query.exec(function(err, shows){
    if (err) return next(err);
    res.send(shows);
  });
});

// get a show by ID
app.get('/api/shows/:id', function(req, res, next){
  Show.findById(req.params.id, function(err, show){
    if (err) return next(err);
    res.send(show);
  });
});

// add a new show
app.post('/api/shows', function(req, res, next){
  var apiKey = '9EF1D1E7D28FDA0B';
  var parser = xml2js.Parser({
    explicitArray: false,
    normalizeTags: true
  });
  var seriesName = req.body.showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');

  async.waterfall([
    function(callback){
      request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
        if (error) return next(error);
        parser.parseString(body, function(err, result){
          // 404 response is sent back if TVDB API has no info on show - seriesid !exist
          if (!result.data.series){
            return res.send(404, { message: req.body.showName + ' was not found.' });
          }
          // else set seriesID
          var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
          callback(err, seriesId);
        });
      });
    },
    // pass to query
    function(seriesId, callback) {
      request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
        if (error) return next(error);
        parser.parseString(body, function(err, result){
          var series = result.data.series;
          var episodes = result.data.episode;
          var show = new Show({
            _id: series.id,
            name: series.seriesname,
            airsDayOfWeek: series.airs_dayofweek,
            airsTime: series.airs_time,
            firstAired: series.firstaired,
            genre: series.genre.split('|').filter(Boolean),
            network: series.network,
            overview: series.overview,
            rating: series.rating,
            ratingCount: series.ratingcount,
            runtime: series.runtime,
            status: series.status,
            poster: series.poster,
            episodes: []
          });
          _.each(episodes, function(episode){
            show.episodes.push({
              season: episode.seasonnumber,
              episodeNumber: episode.episodenumber,
              episodeName: episode.episodename,
              firstAired: episode.firstaired,
              overview: episode.overview
            });
          });
          callback(err, show);
        });
      });
    },
    // pass show object to next function
    function( show, callback ){
      var url = 'http://thetvdb.com/banners/' + show.poster;
      request({ url: url, encoding: null }, function(error, response, body){
        //convert poster image to Base64, pass to callback function
        show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
        callback(error, show);
      });
    }
  //pass show object, save to database
  ], function(err, show){
    if(err) return next(err);
    show.save(function(err){
      if (err) {
        // 11000 -> duplicate key error, no duplicate _id fields in Mongo.  either this or explicitly set unique property like with userSchema
        if (err.code == 11000) {
          // 409 -> conflict code
          return res.send(409, { message: show.name + ' already exists.'});
        }
        return next(err);
      }
      res.send(200)
    });
  });
});



// error middleware, prints stack trace to console, but returns only error message to user //
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, { message: err.message });
});

// HTML5 pushState workaround  - LAST ROUTE catchall //
app.get ('*', function(req, res){
  res.redirect('/#' + req.originalUrl);
});

// server //
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

