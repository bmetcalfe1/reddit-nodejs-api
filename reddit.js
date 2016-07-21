var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;

module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user, callback) {
      
      // first we have to hash the password...
      bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
        if (err) {
          callback(err);
        }
        else {
          conn.query(
            'INSERT INTO users (username,password, createdAt) VALUES (?, ?, ?)', [user.username, hashedPassword, new Date()],
            function(err, result) {
              if (err) {
                /*
                There can be many reasons why a MySQL query could fail. While many of
                them are unknown, there's a particular error about unique usernames
                which we can be more explicit about!
                */
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                /*
                Here we are INSERTing data, so the only useful thing we get back
                is the ID of the newly inserted row. Let's use it to find the user
                and return it
                */
                conn.query(
                  'SELECT id, username, createdAt, updatedAt FROM users WHERE id = ?', [result.insertId],
                  function(err, result) {
                    if (err) {
                      callback(err);
                    }
                    else {
                      /*
                      Finally! Here's what we did so far:
                      1. Hash the user's password
                      2. Insert the user in the DB
                      3a. If the insert fails, report the error to the caller
                      3b. If the insert succeeds, re-fetch the user from the DB
                      4. If the re-fetch succeeds, return the object to the caller
                      */
                        callback(null, result[0]);
                    }
                  }
                );
              }
            }
          );
        }
      });
    },
    createPost: function(post, subredditId, callback) {
      conn.query(
        'INSERT INTO posts (userId, title, url, subredditId, createdAt) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, subredditId, new Date()], //add subreddit id to insert
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT id, title, url, userId, createdAt, updatedAt FROM posts WHERE id = ?', [result.insertId], // do a join here?
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    getAllPosts: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      
      conn.query(`
        SELECT posts.id, posts.title, posts.url, posts.userId, posts.createdAt, posts.updatedAt,
        users.id AS u_userId, users.username AS u_username, users.createdAt AS u_createdAt, users.updatedAt AS u_updatedAt,
        subreddits.id AS s_id, subreddits.name AS s_name, subreddits.createdAt AS s_createdAt, subreddits.updatedAt AS s_updatedAt
        FROM posts 
        JOIN users ON posts.userId = users.id
        JOIN subreddits ON posts.subredditId = subreddits.id
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?`
        , [limit, offset], // add a where after join?
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            var mappedReddit = results.map(function(item){
              return {
                id: item.id,
                title: item.title,
                url: item.url,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                userId: item.userId,
                user: {
                  id: item.u_userId,
                  username: item.u_username,
                  createdAt: item.u_createdAt,
                  updatedAt: item.u_updatedAt
                },
                subreddit: {
                  id: item.s_id,
                  username: item.s_name,
                  createdAt: item.s_createdAt,
                  updatedAt: item.s_updatedAt
                }
              };
            });
            callback(null, mappedReddit);
          }
        }
      );
    },
    getAllPostsForUser: function(userId, options, callback) {
      if (!callback) {
          callback = options;
          options = {};
        }
        var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
        var offset = (options.page || 0) * limit;
        
        conn.query(`
          SELECT posts.id, posts.title, posts.url, posts.userId, posts.createdAt, posts.updatedAt,
          users.id AS u_userId, users.username AS u_username, users.createdAt AS u_createdAt, users.updatedAt AS u_updatedAt 
          FROM posts JOIN users ON posts.userId = users.id 
          WHERE users.id = ?
          ORDER BY posts.createdAt DESC
          LIMIT ? OFFSET ?`
          , [userId, limit, offset],
          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              var mappedReddit = results.map(function(item){
                return {
                  id: item.u_userId,
                  username: item.u_username,
                  createdAt: item.u_createdAt,
                  updatedAt: item.u_updatedAt,
                  post: {
                    id: item.id,
                    title: item.title,
                    url: item.url,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    userId: item.userId
                  }
                };
              });
              callback(null, mappedReddit);
            }
          }
        );
    },
    getSinglePost: function(postId, callback) {
        conn.query(`
          SELECT posts.id, posts.title, posts.url, posts.userId, posts.createdAt, posts.updatedAt,
          users.id AS u_userId, users.username AS u_username, users.createdAt AS u_createdAt, users.updatedAt AS u_updatedAt 
          FROM posts JOIN users ON posts.userId = users.id 
          WHERE posts.id = ?
          ORDER BY posts.createdAt DESC`
          , [postId],
          function(err, results) {
            if (err) {
              callback(err);
            }
            else {
              var mappedReddit = results.map(function(item){
                return {
                  post: {
                    id: item.id,
                    title: item.title,
                    url: item.url,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    userId: item.userId
                  }
                };
              });
              callback(null, mappedReddit);
            }
          }
        );
    },
    createSubreddit: function(sub, callback) {
      conn.query(
          'INSERT INTO subreddits (name, description) VALUES (?, ?)', [sub.name, sub.description, new Date()],
          function(err, result) {
            if (err) {
              callback(err);
            }
            else {
              /*
              Post inserted successfully. Let's use the result.insertId to retrieve
              the post and send it to the caller!
              */
              conn.query(
                'SELECT id, name, description, createdAt, updatedAt FROM subreddits WHERE id = ?', [result.insertId],
                function(err, result) {
                  if (err) {
                    callback(err);
                  }
                  else {
                    callback(null, result[0]);
                  }
                }
              );
            }
          }
      ); 
    },
    getAllSubreddits: function(callback) {
      conn.query(`
        SELECT *
        FROM subreddits
        ORDER BY subreddits.createdAt`
        ,
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            var mappedReddit = results.map(function(item){
              return {
                id: item.id,
                name: item.name,
                description: item.description,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
              };
            });
          }
          callback(mappedReddit);
        }
      );
    },
    createComment: function(comment, callback){
      conn.query(
        'INSERT INTO comments (text, userId, postId, parentId) VALUES (?, ?, ?, ?)', [comment.text, comment.userId, comment.postId, comment.parentId],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            conn.query(
              'SELECT text, userId, postId, parentId FROM comments WHERE id = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
//     getCommentsForPost: function(postId, callback){
//     conn.query(`
//         SELECT comments.id, comments.text, comments.createdAt, comments.updatedAt
//         FROM comments
//         LEFT JOIN comments ON comments.Id = comments.parentId
//         WHERE comments.id = ?
//         ORDER BY comments.createdAt`
//         , [postId],
//         function(err, results) {
//           if (err) {
//             callback(err);
//           }
//           else {
//             var mappedReddit = results.map(function(item){
//               return {
//                 id: item.id,
//                 text: item.text,
//                 createdAt: item.createdAt,
//                 updatedAt: item.updatedAt,
//                 replies: {
//                     id: item.id,
//                     text: item.text,
//                     createdAt: item.createdAt,
//                     updatedAt: item.updatedAt
//                   }
//               };
//             });
//           }
//           callback(mappedReddit);
//         }
//       );
//     }
  };
};
