// our main file
// load the mysql library
var mysql = require('mysql');

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

// redditAPI.getAllPostsForUser(3, {}, function(err, result){ // 3 now but its whatever you wanna pass it
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

redditAPI.createOrUpdateVote({
  vote: 1,
  userId: 1,
  postId: 1,
  }, function(err, result){
    if (err ){
      console.log(err);
    }
    else {
      console.log(result);
    }
});

