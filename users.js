// load the mysql library
var mysql = require('mysql');

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'bmetcalfe1',
    password: '',
    database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);

// SELECT id, title, url, userId, createdAt, updatedAt
//         FROM posts
//         JOIN users ON posts.userId=users.id
//         ORDER BY createdAt DESC



var users = [{
    "username": "Aline",
    "password": "sed"
}, {
    "username": "Victor",
    "password": "ante."
}, {
    "username": "Winifred",
    "password": "nibh."
}, {
    "username": "Jessamine",
    "password": "Nullam"
}, {
    "username": "Leo",
    "password": "mattis"
}, {
    "username": "Marah",
    "password": "mattis"
}, {
    "username": "Nehru",
    "password": "arcu."
}, {
    "username": "Charity",
    "password": "vehicula"
}, {
    "username": "Tamara",
    "password": "sit"
}, {
    "username": "Sebastian",
    "password": "dui"
}, {
    "username": "Kiona",
    "password": "vulputate"
}, {
    "username": "Idola",
    "password": "quam"
}, {
    "username": "Montana",
    "password": "fermentum"
}, {
    "username": "Wilma",
    "password": "ut"
}, {
    "username": "Quon",
    "password": "metus."
}, {
    "username": "Sawyer",
    "password": "urna"
}, {
    "username": "Sean",
    "password": "hendrerit"
}, {
    "username": "Brynne",
    "password": "a,"
}, {
    "username": "Blythe",
    "password": "amet,"
}, {
    "username": "Harriet",
    "password": "est."
}, {
    "username": "Cheryl",
    "password": "dapibus"
}, {
    "username": "Ursula",
    "password": "fringilla"
}, {
    "username": "Mira",
    "password": "dignissim"
}, {
    "username": "Shelly",
    "password": "mollis"
}, {
    "username": "Jerome",
    "password": "eleifend"
}, {
    "username": "Conan",
    "password": "parturient"
}, {
    "username": "Lilah",
    "password": "fames"
}, {
    "username": "Deacon",
    "password": "tincidunt"
}, {
    "username": "Ingrid",
    "password": "ante,"
}, {
    "username": "Jacqueline",
    "password": "mauris,"
}, {
    "username": "Adrienne",
    "password": "dis"
}, {
    "username": "Ayanna",
    "password": "risus."
}, {
    "username": "Alika",
    "password": "rutrum"
}, {
    "username": "Amos",
    "password": "pede."
}, {
    "username": "Nolan",
    "password": "eget"
}, {
    "username": "Jenna",
    "password": "senectus"
}, {
    "username": "Rae",
    "password": "mi"
}, {
    "username": "Adena",
    "password": "dolor"
}, {
    "username": "Daniel",
    "password": "rutrum"
}, {
    "username": "Isabelle",
    "password": "urna"
}, {
    "username": "Gavin",
    "password": "Suspendisse"
}, {
    "username": "Shay",
    "password": "porttitor"
}, {
    "username": "Nichole",
    "password": "orci"
}, {
    "username": "Maia",
    "password": "Phasellus"
}, {
    "username": "Gage",
    "password": "sagittis"
}, {
    "username": "Quinlan",
    "password": "Fusce"
}, {
    "username": "Ivor",
    "password": "feugiat"
}, {
    "username": "Rajah",
    "password": "est."
}, {
    "username": "Randall",
    "password": "penatibus"
}, {
    "username": "Tana",
    "password": "enim"
}, {
    "username": "Halla",
    "password": "quis"
}, {
    "username": "Germaine",
    "password": "dis"
}, {
    "username": "Marah",
    "password": "erat,"
}, {
    "username": "Keefe",
    "password": "metus"
}, {
    "username": "Jacob",
    "password": "non,"
}, {
    "username": "Jillian",
    "password": "ut"
}, {
    "username": "Denton",
    "password": "non,"
}, {
    "username": "Kelsey",
    "password": "ullamcorper"
}, {
    "username": "Madeson",
    "password": "nunc"
}, {
    "username": "Aladdin",
    "password": "Nunc"
}, {
    "username": "Jenna",
    "password": "et"
}, {
    "username": "Quincy",
    "password": "ornare"
}, {
    "username": "Juliet",
    "password": "eu,"
}, {
    "username": "Eagan",
    "password": "arcu."
}, {
    "username": "Karyn",
    "password": "senectus"
}, {
    "username": "Hop",
    "password": "sit"
}, {
    "username": "Serina",
    "password": "lacinia"
}, {
    "username": "Petra",
    "password": "leo."
}, {
    "username": "Veronica",
    "password": "egestas"
}, {
    "username": "Philip",
    "password": "Proin"
}, {
    "username": "Chaim",
    "password": "mi."
}, {
    "username": "Drew",
    "password": "eget,"
}, {
    "username": "Astra",
    "password": "Nulla"
}, {
    "username": "Gregory",
    "password": "ac"
}, {
    "username": "Karleigh",
    "password": "et"
}, {
    "username": "Eliana",
    "password": "magnis"
}, {
    "username": "Jonas",
    "password": "nisi"
}, {
    "username": "Kelly",
    "password": "nulla."
}, {
    "username": "Amena",
    "password": "metus"
}, {
    "username": "Dylan",
    "password": "egestas."
}, {
    "username": "Yvonne",
    "password": "nec"
}, {
    "username": "Joel",
    "password": "Pellentesque"
}, {
    "username": "Emerald",
    "password": "diam"
}, {
    "username": "Whitney",
    "password": "augue"
}, {
    "username": "Audrey",
    "password": "ut"
}, {
    "username": "Vielka",
    "password": "sem"
}, {
    "username": "Roary",
    "password": "ut"
}, {
    "username": "Andrew",
    "password": "ipsum"
}, {
    "username": "Quinn",
    "password": "purus"
}, {
    "username": "Juliet",
    "password": "lectus"
}, {
    "username": "Chelsea",
    "password": "nunc."
}, {
    "username": "Graiden",
    "password": "quam"
}, {
    "username": "Xavier",
    "password": "dolor."
}, {
    "username": "Giacomo",
    "password": "eu"
}, {
    "username": "Winifred",
    "password": "senectus"
}, {
    "username": "Kiona",
    "password": "erat"
}, {
    "username": "Beau",
    "password": "arcu"
}, {
    "username": "Mara",
    "password": "et,"
}, {
    "username": "Jason",
    "password": "at"
}, {
    "username": "Daphne",
    "password": "imperdiet,"
}];





function insertUsers(arr) {
    var n = arr.length - 1;

    function loopUsers(n) {
        if (n === -1) {
            connection.end();
            return;
        }
        else {
            redditAPI.createUser(arr[n], function(err, res) {
                console.log(res);
                loopUsers(n - 1);
            })
        }
    }
    loopUsers(n)
    console.log('Inserting...');
}



insertUsers(users);