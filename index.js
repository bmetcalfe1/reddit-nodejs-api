
var mysql = require('mysql'); // load the mysql library
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(checkLoginToken);

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
  redditAPI.getAllPosts({}, function(err, result){
    if (err){
      res.status(500).send('try again later');
      console.log(err.stack);
    }
    else {
    function makeList (post) {
      return `
        <li class="content-item">
          <h2 class="content-item">
            <a href=${post.url}>${post.title}</a>
          </h2>
          <p>Created by ${post.user.username}</p>
        </li>
      `;
    }
        
    var htmlMaker = `
      <div id="contents">
        <h1>List of contents</h1>
        <ul class="contents-list">
          ${result.map(function(post){
            return makeList(post);
          }).join("")}
        </ul>
      </div>  
    `;
    
    res.send(htmlMaker);
    }
  });
});

// SIGNUP PAGE
app.get('/signup', function(req, res) {

  var signupForm = `
    <form action="/signup" method="POST">
      <div>
        <input type="text" name="un" placeholder="Enter a username">
      </div>
      <div>
        <input type="text" name="pw" placeholder="Enter a password">
      </div>
      <button type="submit">Sign Up!</button>
    </form>
  `;
  
  res.send(signupForm);
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

  var loginForm = `
    <form action="/login" method="POST">
      <div>
        <input type="text" name="un" placeholder="Enter your username">
      </div>
      <div>
        <input type="text" name="pw" placeholder="Enter your password">
      </div>
      <button type="submit">Login!</button>
    </form>
  `;
  
  res.send(loginForm);
});

app.post('/login', function(req, res) {
  
  var userCredentials = {
    username: req.body.un,
    password: req.body.pw
  };
  
  redditAPI.checkLogin(userCredentials.username, userCredentials.password, function(err, user){
    console.log(user);
    if (err){
      res.status(401).send(err.message);
    }
    else {
      redditAPI.createSession(user.id, function(err, token) { 
        console.log(token);
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
app.get('/createpost', function(req, res) {

  var createpostForm = `
    <form action="/createpost" method="POST">
      <div>
        <input type="text" name="url" placeholder="Enter URL">
      </div>
      <div>
        <input type="text" name="title" placeholder="Enter title">
      </div>
      <button type="submit">Post dat, bro!</button>
    </form>
  `;
  
  res.send(createpostForm);
});

app.post('/createPost', function(request, response) {
  // before creating content, check if the user is logged in
  console.log(request);
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
        response.send("ok");  
      }  
    });
  }
});

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


