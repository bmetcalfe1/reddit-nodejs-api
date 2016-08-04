
var mysql = require('mysql'); // load the mysql library
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');


app.set('view engine', 'ejs');

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(checkLoginToken);
app.use("/public", express.static(__dirname+'/static'));

function checkLoginToken (request, response, next) {
  // check if there's a SESSION cookie...
  if (request.cookies.SESSION) {
    redditAPI.getUserFromSession(request.cookies.SESSION, function(err, user) {
      if(err){
        console.log(err);
      }
      else {
        // if we get back a user object, set it on the request. 
        // From now on, this request looks like it was made by this user as far as the rest of the code is concerned
        if (user) {
          request.loggedInUser = user;
        }
        next();
      }
    });
  }
  else {
    // if no SESSION cookie, move forward
    next();
  }
}

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'bmetcalfe1', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);
app.use(bodyParser.urlencoded({ extended: false }));

// It's request time!
// redditAPI.createUser({
//   username: 'hello23',
//   password: 'xxx'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     redditAPI.createPost({
//       title: 'hi reddit!',
//       url: 'https://www.reddit.com',
//       userId: user.id
//     }, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });
//   }
// });

// redditAPI.getAllPosts({}, function(err, result){
//   if (err ){
//     console.log(err);
//   }
//   else {
//     console.log(result);
//   }
// });

// redditAPI.getAllPostsForUser(1, {}, function(err, result){ // 3 now but its whatever you wanna pass it
//   if (err ){
//     console.log(err);
//   }
//   else {
//     console.log(result);
//   }
// });

// redditAPI.getSinglePost(21, function(err, result){ // 3 now but its whatever you wanna pass it
//   if (err ){
//     console.log(err);
//   }
//   else {
//     console.log(result);
//   }
// });

// redditAPI.createSubreddit({name: "DJ Khaled", description: "we the greatest music"}, function(err, result){ // 3 now but its whatever you wanna pass it
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(result);
//   }
// });

// redditAPI.getAllSubreddits(function(err, result){ // 3 now but its whatever you wanna pass it
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(result);
//   }
// });

// redditAPI.createPost({
//       title: 'yoo reddit!',
//       url: 'https://www.reddit.com',
//       userId: 10
//     }, 1, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });

// redditAPI.createComment({
//   text: "new comment yay!",
//   userId: 7,
//   postId: 1,
//   parentId: null
//   }, function(err, result){
//     if (err ){
//       console.log(err);
//     }
//     else {
//       console.log(result);
//     }
// });

// redditAPI.getCommentsForPost(1, function(err, result){
//   if (err){
//     console.log(err);
//   }
//   else {
//     console.log(result);
//   }
// });

// redditAPI.createOrUpdateVote({
//   vote: 0,
//   userId: 5,
//   postId: 6,
//   }, function(err, result){
//     if (err ){
//       console.log(err);
//     }
//     else {
//       console.log(result);
//     }
// });

// Reddit clone -- the "full thing" edition

//HOMEPAGE
// starting with sortingmethed 'new' only. REFACTOR LATER w other sorting methods
app.get('/homepage', function(req, res) {
  var sort = req.query.sort;
    
  redditAPI.getAllPosts(sort, {}, function(err, result){
    if (err){
      res.status(500).send('try again later');
      console.log(err.stack);
    }
    else {
      res.render('pages/homepage', {
        result: result
      });
    }
  });
});

app.post('/votePost', function(req, res) {
  var voteObj = {
    userId: req.loggedInUser.id,
    postId: Number(req.body.postId),
    vote: Number(req.body.vote)
  };
  redditAPI.createOrUpdateVote(voteObj, function(err, result){
    if (err){
      res.status(500).send('no dice');
      console.log(err.stack);
    }
    else {
      redditAPI.getVotesForPost(voteObj.postId, function(err, score){
        if(err){
          res.json(err);
        } else {
          res.json({score: score});
        }
      });
      //res.redirect('/homepage');
      //res.json({ok: true});
    }
  });
});

// SIGNUP PAGE
app.get('/signup', function(req, res) {
  res.render('pages/signup');
});

app.post('/signup', function(req, res) {
  
  var newUser = {
    username: req.body.un,
    password: req.body.pw
  };
  
  redditAPI.createUser(newUser, function(err, post){
    if (err){
      res.status(500).send('try again later'); // WHATS THE RIGHT ONE?? Error 303???
      console.log(err.stack);
    }
    else {
      res.redirect(`/login`);
    }
    
  });
});

// LOGIN PAGE
app.get('/login', function(req, res) {
  res.render('pages/login');
});

app.post('/login', function(req, res) {
  
  var userCredentials = {
    username: req.body.un,
    password: req.body.pw
  };
  
  redditAPI.checkLogin(userCredentials.username, userCredentials.password, function(err, user){
    //console.log(user);
    if (err){
      res.status(401).send(err.message);
    }
    else {
      redditAPI.createSession(user.id, function(err, token) { 
        //console.log(token);
        if (err) {
          res.status(500).send('an error occurred. please try again later!');
        }
        else {
          res.cookie('SESSION', token); // the secret token is now in the user's cookies!
          res.redirect('/homepage');
        }
      });
    }
  }); 
}); // for the app.post

// CREATE PAGE
app.get('/createPost', function(req, res) {
  res.render('pages/createpost');
});

app.post('/createPost', function(request, response) {
  // before creating content, check if the user is logged in
  //console.log(request);
  if (!request.loggedInUser) {
    // HTTP status code 401 means Unauthorized
    response.status(401).send('You must be logged in to create content!');
  }
  else {
    // here we have a logged in user, let's create the post with the user!
    console.log(request.loggedInUser);
    redditAPI.createPost({
      title: request.body.title,
      url: request.body.url,
      userId: request.loggedInUser.id
    }, 1, function(err, post) {
      // do something with the post object or just response OK to the user :)
      if(err){
        console.log(err);
      }
      else {
        response.redirect('/homepage');
      }  
    });
  }
});

// endpoint to fetch html

app.get('/suggestTitle', function(req, res) {
  var currentQueryUrl = req.query.url;
  //console.log(currentQueryUrl);
  request(currentQueryUrl, function(error, response, html) {
    var $ = cheerio.load(html);
    var myTitle = $('title').text();
    //console.log(myTitle);
    res.send(myTitle);
  });
});

// YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :)
// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});