var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');


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
    getAllPosts: function(sortingmethod, options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      var sort = sortingmethod || 'hotness';
      
      conn.query(`
        SELECT 
          p.id, p.title, p.url, p.createdAt, p.updatedAt,
          
          u.id AS u_userId, 
          u.username AS u_username, 
          u.createdAt AS u_createdAt, 
          u.updatedAt AS u_updatedAt,
          
          s.id AS s_id, 
          s.name AS s_name, 
          s.createdAt AS s_createdAt, 
          s.updatedAt AS s_updatedAt,
          
          SUM(vote) AS voteScore,
          SUM(IF(vote = 1, 1, 0)) - SUM(IF(vote = -1, 1, 0)) AS top,
          SUM(vote) / (NOW() - p.createdAt) AS hotness,
          SUM(p.createdAt) AS new,
          SUM(IF(vote = -1, 1, 0)) - SUM(IF(vote = 1, 1, 0)) AS controversial
          
        FROM posts p
          LEFT JOIN users u ON p.userId = u.id
          LEFT JOIN subreddits s ON p.subredditId = s.id
          LEFT JOIN votes v ON v.postId = p.id
        GROUP BY p.id
        ORDER BY ${sort} DESC
        LIMIT ? OFFSET ?`, [limit, offset], 
        function(err, posts) {
          if (err) {
            callback(err);
          }
          else {
            posts = posts.map(function(item){
              return {
                id: item.id,
                title: item.title,
                url: item.url,
                voteScore: item.voteScore,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                user: {
                  id: item.u_id,
                  username: item.u_username,
                  createdAt: item.u_createdAt,
                  updatedAt: item.u_updatedAt
                },
                subreddit: {
                  id: item.s_id,
                  username: item.s_name,
                  createdAt: item.s_createdAt,
                  updatedAt: item.s_updatedAt
                },
              };
            });
            callback(null, posts);
            //console.log(posts); // for debugging
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
    getCommentsForPost: function(postId, callback){
    conn.query(`
        SELECT c1.id AS c1_id, c1.text AS c1_text, c1.createdAt AS c1_createdAt, c1.updatedAt AS c1_updatedAt, 
        c2.id AS c2_id, c2.text AS c2_text, c2.createdAt AS c2_createdAt, c2.updatedAt AS c2_updatedAt
        FROM comments c1
        LEFT JOIN comments c2 ON c1.id = c2.parentId
        WHERE c1.parentId IS NULL AND c1.postId = ?
        ORDER BY c1_createdAt` 
        , [postId],
        function(err, results) { 
        // console.log(results); // TEST. At this point all results print non-nested
          if (err) {
            callback(err);
          }
          else {
            
            var answerComments = [];
            
            
            var mappedReddit = results.forEach(function(item){
              // create 2 objects:
              // 1: var c1 = {} n var c2 = {}
              // 2 add c1 to comment array only if new
              // if c2.id is not NULL, add c2 to replies of c1 wih a push
              
              if (item.parentId === null) {
                  answerComments.push(item);
              }
              else if (item.parentId !== null) {
                  c1.replies.push(item);
              }
              
              var c1 = {
                id: item.c1_id,
                text: item.c1_text,
                parentId: item.c1_parentId,
                replies: []
              };
              var c2 = {
                id: item.c2_id,
                text: item.c2_text,
                parentId: item.c2_parentId,
                replies: []
              };
              
              // do a console.log here to test
              
              //console.log(answerComments);
            });
          }
          return callback(null, mappedReddit);
        }
      );
    },
    createOrUpdateVote: function(vote, callback) {
      //console.log(vote);
      // make sure vote is +1, 0 or -1
      if (Math.abs(vote.vote) > 1) { // is this ideal? ask ziad cuz i think this accepts 0.5
        callback(new Error('vote has to be +1, 0 or -1'));
        return;
      }
      //console.log("HERE WE ARE");
      conn.query(
        'INSERT INTO votes (userId, postId, vote) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE vote=?', [vote.userId, vote.postId, vote.vote, vote.vote], // why do I have two???
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            
            callback(null, vote);
          }
        }
      );
    },
    getFiveLatestPosts: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 5; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      
      conn.query(`
        SELECT 
          p.id, p.title, p.url, p.createdAt, p.updatedAt,
          
          u.id AS u_userId, 
          u.username AS u_username, 
          u.createdAt AS u_createdAt, 
          u.updatedAt AS u_updatedAt,
          
          s.id AS s_id, 
          s.name AS s_name, 
          s.createdAt AS s_createdAt, 
          s.updatedAt AS s_updatedAt
        FROM posts p
          JOIN users u ON p.userId = u.id
          JOIN subreddits s ON p.subredditId = s.id
        ORDER BY p.createdAt DESC
        LIMIT ? OFFSET ?`, [limit, offset], 
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            results = results.map(function(item){
              return {
                id: item.id,
                title: item.title,
                url: item.url,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                user: {
                  id: item.u_id,
                  username: item.u_username,
                  createdAt: item.u_createdAt,
                  updatedAt: item.u_updatedAt
                },
                subreddit: {
                  id: item.s_id,
                  username: item.s_name,
                  createdAt: item.s_createdAt,
                  updatedAt: item.s_updatedAt
                },
              };
            });
            callback(null, results);
          }
        }
      );
    },
    checkLogin: function(user, pass, cb) {
      conn.query('SELECT * FROM users WHERE username = ?', [user], function(err, result) {
        if (err) {
          console.log(err.stack);
        }
        else {
          if (result.length === 0) {
            cb(new Error('username or password incorrect')); // in this case the user does not exist
          }
          else {
            var user = result[0];
            var actualHashedPassword = user.password;
            
            bcrypt.compare(pass, actualHashedPassword, function(err, result) {
              if (err) {
                console.log(err.stack);
              }
              else {
                if (result === true) { // let's be extra safe here
                  cb(null, user);
                }
                else {
                  cb(new Error('username or password incorrect')); // in this case the password is wrong, but we reply with the same error
                }
              }
            });
          }
        }
      });
    },
    createSession: function(userId, callback) {
      var token = secureRandom.randomArray(100).map(code => code.toString(36)).join('');
      conn.query('INSERT INTO sessions SET user_id = ?, token = ?', [userId, token], function(err, result) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, token); // this is the secret session token :)
        }
      });
    },
    getUserFromSession: function(token, callback) {
      // If the cookie exists, do a database query to see if the session token belongs to a user. READ QUESTION
      conn.query(`
      SELECT 
        s.session_id, 
        s.token, 
        
        u.id AS u_id, 
        u.username AS u_username, 
        u.createdAt AS u_createdAt, 
        u.updatedAt AS u_updatedAt
        
      FROM sessions s
        LEFT JOIN users u ON s.user_id = u.id
      WHERE token = ?
      `, [token], function(err, user) {
        if (err) {
          console.log(err.stack);
        }
        else {
          // do another if else
          // then nmake an object
          if (user.length === 0) {
            callback(new Error('username or password incorrect'));
          }
          else {
          // var tokenBeingPassed = result[0];
          // var user = tokenBeingPassed.user_id;
          // console.log(tokenBeingPassed);
            user = user[0];
            user = {
              id: user.u_id,
              username: user.u_username,
              createdAt: user.u_createdAt,
              updatedAt: user.u_updatedAt
            };
            callback(null, user);
          }
        }
      });
    },
    getVotesForPost: function(postId, callback){
      conn.query(
        `SELECT sum(vote) as voteScore from votes where postId = ?`, [postId], function(err, result) {
            if(err){
              callback(err);
            } else {
              callback(null, result[0].voteScore);
            }
        }
        )
    }
  };
};
