var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// app.get('/hello', function(req, res) {
//   res.send('<h1>Hello World!</h1>');
// });

// app.get('/hello', function(req, res) {
//   res.send(`<h1>Hello ${req.query.name} </h1>`);
// });

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

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});