var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

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


// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// Exercise 1
app.get('/hello', function(req, res) {
  res.send('<h1>Hello World!</h1>');
});

// Exercise 2
app.get('/hello', function(req, res) {
  var name = req.query.name;
  
  if (!name){
    res.send(`<h1>Error invalid input </h1>`);
  }
  else {
    res.send(`<h1>Hello ${name} </h1>`);
  }
});

// Exercise 3
app.get('/calculator/:operation', function(req, res) {
    var operation = req.params.operation;
    var add = "add";
    var sub = "sub";
    var mult = "mult";
    var div = "div";
    var num1 = req.query.num1;
    var num2 = req.query.num2;
    
    // do a switch when you refactor
    
    if (operation === add) {
        res.send({
        "operator": operation,
        "firstOperand": Number(num1),
        "secondOperand": Number(num2),
        "solution": Number(num1) + Number(num2)
        });
    }
    else if (operation === sub) {
        res.send({
        "operator": operation,
        "firstOperand": Number(num1),
        "secondOperand": Number(num2),
        "solution": Number(num1) - Number(num2)
        });
    }
    else if (operation === mult) {
      res.send({
        "operator": operation,
        "firstOperand": Number(num1),
        "secondOperand": Number(num2),
        "solution": Number(num1) * Number(num2)
        });
    }
    else if (operation === div) {
      res.send({
        "operator": operation,
        "firstOperand": Number(num1),
        "secondOperand": Number(num2),
        "solution": Number(num1) / Number(num2)
        });
    }
    else {
        res.status(400).send('Bad request.');
    }
});

// Exercise 4

app.get('/posts', function(req, res) {
  redditAPI.getFiveLatestPosts({}, function(err, result){
    if (err){
      res.status(500).send('try again later');
      console.log(err.stack);
    }
    else {
      function makeList (post) {
        return `
          <li class="content-item">
            <h2 class="content-item__title">
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

// Exercise 5

app.get('/createcontent', function(req, res) {

  var damnedForm = `
    <form action="/createContent" method="POST">
      <div>
        <input type="text" name="url" placeholder="Enter a URL to content">
      </div>
      <div>
        <input type="text" name="title" placeholder="Enter the title of your content">
      </div>
      <button type="submit">Create!</button>
    </form>
  `;
  
  res.send(damnedForm);
});

// Exercise 6

app.post('/createcontent', function(req, res) {
  
  var newPost = {
    userId: 1,
    url: req.body.url,
    title: req.body.title
  };
  
  redditAPI.createPost(newPost, 1, function(err, post){
    if (err){
      console.log(err);
    }
    else {
      res.redirect(`/posts/`+ post.id);
    }
    
  });
});

app.get('/posts/:id', function(req, res) {
    redditAPI.getSinglePost(req.params.id, function(err, result){
    if (err){
      console.log(err);
    }
    else {
      res.send(result);
    }
  });
});


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});