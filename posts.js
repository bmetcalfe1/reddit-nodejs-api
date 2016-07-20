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


var testPosts = [
	{
		"userId": 38,
		"title": "nonummy ut, molestie in, tempus",
		"url": "www.google.com"
	},
	{
		"userId": 96,
		"title": "non justo. Proin non massa",
		"url": "www.google.com"
	},
	{
		"userId": 41,
		"title": "fermentum",
		"url": "www.google.com"
	},
	{
		"userId": 86,
		"title": "tortor,",
		"url": "www.google.com"
	},
	{
		"userId": 73,
		"title": "in aliquet lobortis, nisi",
		"url": "www.google.com"
	},
	{
		"userId": 51,
		"title": "sed orci",
		"url": "www.google.com"
	},
	{
		"userId": 64,
		"title": "vitae, orci. Phasellus dapibus quam",
		"url": "www.google.com"
	},
	{
		"userId": 97,
		"title": "mi",
		"url": "www.google.com"
	},
	{
		"userId": 32,
		"title": "lobortis. Class aptent taciti",
		"url": "www.google.com"
	},
	{
		"userId": 76,
		"title": "ligula. Aenean euismod mauris",
		"url": "www.google.com"
	},
	{
		"userId": 82,
		"title": "lorem, sit amet",
		"url": "www.google.com"
	},
	{
		"userId": 13,
		"title": "pellentesque eget, dictum placerat, augue.",
		"url": "www.google.com"
	},
	{
		"userId": 55,
		"title": "ullamcorper",
		"url": "www.google.com"
	},
	{
		"userId": 13,
		"title": "auctor,",
		"url": "www.google.com"
	},
	{
		"userId": 60,
		"title": "pede ac urna. Ut tincidunt",
		"url": "www.google.com"
	},
	{
		"userId": 50,
		"title": "commodo tincidunt nibh.",
		"url": "www.google.com"
	},
	{
		"userId": 89,
		"title": "nibh lacinia orci,",
		"url": "www.google.com"
	},
	{
		"userId": 8,
		"title": "tincidunt",
		"url": "www.google.com"
	},
	{
		"userId": 12,
		"title": "velit eu sem. Pellentesque ut",
		"url": "www.google.com"
	},
	{
		"userId": 71,
		"title": "vitae dolor. Donec",
		"url": "www.google.com"
	},
	{
		"userId": 21,
		"title": "pede. Praesent eu dui.",
		"url": "www.google.com"
	},
	{
		"userId": 12,
		"title": "sem, vitae aliquam",
		"url": "www.google.com"
	},
	{
		"userId": 57,
		"title": "lectus. Nullam suscipit, est",
		"url": "www.google.com"
	},
	{
		"userId": 88,
		"title": "molestie arcu. Sed eu",
		"url": "www.google.com"
	},
	{
		"userId": 23,
		"title": "consequat",
		"url": "www.google.com"
	},
	{
		"userId": 18,
		"title": "pede",
		"url": "www.google.com"
	},
	{
		"userId": 31,
		"title": "eget lacus. Mauris",
		"url": "www.google.com"
	},
	{
		"userId": 86,
		"title": "volutpat ornare,",
		"url": "www.google.com"
	},
	{
		"userId": 53,
		"title": "metus eu erat semper rutrum.",
		"url": "www.google.com"
	},
	{
		"userId": 90,
		"title": "gravida sagittis.",
		"url": "www.google.com"
	},
	{
		"userId": 16,
		"title": "dolor, tempus non,",
		"url": "www.google.com"
	},
	{
		"userId": 47,
		"title": "consectetuer ipsum nunc id",
		"url": "www.google.com"
	},
	{
		"userId": 52,
		"title": "pharetra, felis eget varius",
		"url": "www.google.com"
	},
	{
		"userId": 67,
		"title": "ac urna. Ut tincidunt vehicula",
		"url": "www.google.com"
	},
	{
		"userId": 68,
		"title": "imperdiet nec,",
		"url": "www.google.com"
	},
	{
		"userId": 93,
		"title": "velit justo nec ante. Maecenas",
		"url": "www.google.com"
	},
	{
		"userId": 26,
		"title": "convallis est, vitae sodales",
		"url": "www.google.com"
	},
	{
		"userId": 35,
		"title": "fringilla. Donec feugiat",
		"url": "www.google.com"
	},
	{
		"userId": 70,
		"title": "Morbi accumsan laoreet ipsum. Curabitur",
		"url": "www.google.com"
	},
	{
		"userId": 69,
		"title": "elit, pharetra ut, pharetra sed,",
		"url": "www.google.com"
	},
	{
		"userId": 70,
		"title": "tellus non magna. Nam ligula",
		"url": "www.google.com"
	},
	{
		"userId": 1,
		"title": "Etiam imperdiet dictum",
		"url": "www.google.com"
	},
	{
		"userId": 92,
		"title": "lacinia vitae, sodales at,",
		"url": "www.google.com"
	},
	{
		"userId": 95,
		"title": "sem egestas blandit.",
		"url": "www.google.com"
	},
	{
		"userId": 30,
		"title": "est ac facilisis facilisis, magna",
		"url": "www.google.com"
	},
	{
		"userId": 8,
		"title": "quis,",
		"url": "www.google.com"
	},
	{
		"userId": 25,
		"title": "ipsum porta elit,",
		"url": "www.google.com"
	},
	{
		"userId": 91,
		"title": "magna",
		"url": "www.google.com"
	},
	{
		"userId": 78,
		"title": "In condimentum.",
		"url": "www.google.com"
	},
	{
		"userId": 37,
		"title": "pede et",
		"url": "www.google.com"
	},
	{
		"userId": 100,
		"title": "mollis. Integer tincidunt",
		"url": "www.google.com"
	},
	{
		"userId": 29,
		"title": "dui nec",
		"url": "www.google.com"
	},
	{
		"userId": 60,
		"title": "non,",
		"url": "www.google.com"
	},
	{
		"userId": 33,
		"title": "non dui nec",
		"url": "www.google.com"
	},
	{
		"userId": 11,
		"title": "dui. Suspendisse",
		"url": "www.google.com"
	},
	{
		"userId": 95,
		"title": "Integer urna. Vivamus molestie dapibus",
		"url": "www.google.com"
	},
	{
		"userId": 93,
		"title": "gravida. Praesent eu nulla at",
		"url": "www.google.com"
	},
	{
		"userId": 32,
		"title": "amet, faucibus ut,",
		"url": "www.google.com"
	},
	{
		"userId": 43,
		"title": "pellentesque, tellus sem mollis",
		"url": "www.google.com"
	},
	{
		"userId": 31,
		"title": "Fusce",
		"url": "www.google.com"
	},
	{
		"userId": 94,
		"title": "imperdiet non, vestibulum nec, euismod",
		"url": "www.google.com"
	},
	{
		"userId": 1,
		"title": "feugiat. Sed nec metus",
		"url": "www.google.com"
	},
	{
		"userId": 24,
		"title": "egestas blandit. Nam",
		"url": "www.google.com"
	},
	{
		"userId": 1,
		"title": "Integer mollis. Integer",
		"url": "www.google.com"
	},
	{
		"userId": 77,
		"title": "non,",
		"url": "www.google.com"
	},
	{
		"userId": 91,
		"title": "tempus, lorem fringilla",
		"url": "www.google.com"
	},
	{
		"userId": 48,
		"title": "sed sem egestas",
		"url": "www.google.com"
	},
	{
		"userId": 31,
		"title": "mus. Proin vel arcu",
		"url": "www.google.com"
	},
	{
		"userId": 19,
		"title": "neque",
		"url": "www.google.com"
	},
	{
		"userId": 30,
		"title": "aliquet diam.",
		"url": "www.google.com"
	},
	{
		"userId": 45,
		"title": "ornare sagittis felis. Donec",
		"url": "www.google.com"
	},
	{
		"userId": 98,
		"title": "massa non ante",
		"url": "www.google.com"
	},
	{
		"userId": 43,
		"title": "ultrices",
		"url": "www.google.com"
	},
	{
		"userId": 23,
		"title": "ac facilisis",
		"url": "www.google.com"
	},
	{
		"userId": 35,
		"title": "ante",
		"url": "www.google.com"
	},
	{
		"userId": 81,
		"title": "egestas nunc sed",
		"url": "www.google.com"
	},
	{
		"userId": 63,
		"title": "quis lectus.",
		"url": "www.google.com"
	},
	{
		"userId": 76,
		"title": "urna suscipit nonummy.",
		"url": "www.google.com"
	},
	{
		"userId": 23,
		"title": "Etiam",
		"url": "www.google.com"
	},
	{
		"userId": 84,
		"title": "neque et nunc.",
		"url": "www.google.com"
	},
	{
		"userId": 55,
		"title": "nec,",
		"url": "www.google.com"
	},
	{
		"userId": 86,
		"title": "libero. Integer",
		"url": "www.google.com"
	},
	{
		"userId": 40,
		"title": "urna.",
		"url": "www.google.com"
	},
	{
		"userId": 94,
		"title": "Cras dolor",
		"url": "www.google.com"
	},
	{
		"userId": 73,
		"title": "convallis in, cursus et,",
		"url": "www.google.com"
	},
	{
		"userId": 96,
		"title": "at lacus. Quisque purus sapien,",
		"url": "www.google.com"
	},
	{
		"userId": 15,
		"title": "vehicula et,",
		"url": "www.google.com"
	},
	{
		"userId": 61,
		"title": "eu dolor egestas rhoncus.",
		"url": "www.google.com"
	},
	{
		"userId": 28,
		"title": "tempus non, lacinia at, iaculis",
		"url": "www.google.com"
	},
	{
		"userId": 69,
		"title": "blandit enim",
		"url": "www.google.com"
	},
	{
		"userId": 74,
		"title": "auctor. Mauris",
		"url": "www.google.com"
	},
	{
		"userId": 15,
		"title": "ullamcorper",
		"url": "www.google.com"
	},
	{
		"userId": 71,
		"title": "mauris blandit mattis.",
		"url": "www.google.com"
	},
	{
		"userId": 2,
		"title": "mauris, aliquam eu, accumsan sed,",
		"url": "www.google.com"
	},
	{
		"userId": 60,
		"title": "luctus ut, pellentesque",
		"url": "www.google.com"
	},
	{
		"userId": 2,
		"title": "diam vel arcu. Curabitur ut",
		"url": "www.google.com"
	},
	{
		"userId": 55,
		"title": "metus. Vivamus euismod",
		"url": "www.google.com"
	},
	{
		"userId": 42,
		"title": "a, scelerisque sed,",
		"url": "www.google.com"
	},
	{
		"userId": 8,
		"title": "pretium aliquet, metus",
		"url": "www.google.com"
	},
	{
		"userId": 66,
		"title": "Nulla eget metus eu",
		"url": "www.google.com"
	},
	{
		"userId": 46,
		"title": "est mauris, rhoncus id, mollis",
		"url": "www.google.com"
	},
	{
		"userId": 38,
		"title": "parturient",
		"url": "www.google.com"
	},
	{
		"userId": 79,
		"title": "mollis",
		"url": "www.google.com"
	},
	{
		"userId": 94,
		"title": "cursus purus.",
		"url": "www.google.com"
	},
	{
		"userId": 85,
		"title": "sem. Nulla interdum.",
		"url": "www.google.com"
	},
	{
		"userId": 3,
		"title": "non dui nec urna suscipit",
		"url": "www.google.com"
	},
	{
		"userId": 10,
		"title": "et ultrices posuere cubilia",
		"url": "www.google.com"
	},
	{
		"userId": 4,
		"title": "mollis dui,",
		"url": "www.google.com"
	},
	{
		"userId": 65,
		"title": "penatibus et magnis",
		"url": "www.google.com"
	},
	{
		"userId": 77,
		"title": "In",
		"url": "www.google.com"
	},
	{
		"userId": 17,
		"title": "lorem, luctus ut,",
		"url": "www.google.com"
	},
	{
		"userId": 1,
		"title": "Nulla semper",
		"url": "www.google.com"
	},
	{
		"userId": 62,
		"title": "velit dui, semper et, lacinia",
		"url": "www.google.com"
	},
	{
		"userId": 44,
		"title": "vehicula aliquet libero. Integer in",
		"url": "www.google.com"
	},
	{
		"userId": 18,
		"title": "sem,",
		"url": "www.google.com"
	},
	{
		"userId": 69,
		"title": "nec urna et",
		"url": "www.google.com"
	},
	{
		"userId": 84,
		"title": "lectus sit amet luctus",
		"url": "www.google.com"
	},
	{
		"userId": 76,
		"title": "nulla",
		"url": "www.google.com"
	},
	{
		"userId": 81,
		"title": "euismod est arcu",
		"url": "www.google.com"
	},
	{
		"userId": 1,
		"title": "ac libero nec",
		"url": "www.google.com"
	},
	{
		"userId": 71,
		"title": "Proin vel arcu",
		"url": "www.google.com"
	},
	{
		"userId": 95,
		"title": "consectetuer mauris id sapien. Cras",
		"url": "www.google.com"
	},
	{
		"userId": 80,
		"title": "scelerisque sed, sapien.",
		"url": "www.google.com"
	},
	{
		"userId": 29,
		"title": "Curabitur massa.",
		"url": "www.google.com"
	},
	{
		"userId": 33,
		"title": "libero dui",
		"url": "www.google.com"
	},
	{
		"userId": 37,
		"title": "sem. Nulla",
		"url": "www.google.com"
	},
	{
		"userId": 75,
		"title": "taciti sociosqu",
		"url": "www.google.com"
	},
	{
		"userId": 35,
		"title": "nec,",
		"url": "www.google.com"
	},
	{
		"userId": 59,
		"title": "arcu. Nunc mauris. Morbi",
		"url": "www.google.com"
	},
	{
		"userId": 78,
		"title": "feugiat metus sit amet ante.",
		"url": "www.google.com"
	},
	{
		"userId": 37,
		"title": "nisl",
		"url": "www.google.com"
	},
	{
		"userId": 71,
		"title": "eleifend non, dapibus rutrum, justo.",
		"url": "www.google.com"
	},
	{
		"userId": 53,
		"title": "nec metus",
		"url": "www.google.com"
	},
	{
		"userId": 68,
		"title": "enim nisl elementum purus,",
		"url": "www.google.com"
	},
	{
		"userId": 12,
		"title": "nec orci. Donec",
		"url": "www.google.com"
	},
	{
		"userId": 30,
		"title": "et, rutrum",
		"url": "www.google.com"
	},
	{
		"userId": 14,
		"title": "posuere,",
		"url": "www.google.com"
	},
	{
		"userId": 30,
		"title": "In nec",
		"url": "www.google.com"
	},
	{
		"userId": 96,
		"title": "egestas. Fusce aliquet magna a",
		"url": "www.google.com"
	},
	{
		"userId": 77,
		"title": "aliquet,",
		"url": "www.google.com"
	},
	{
		"userId": 98,
		"title": "aliquam",
		"url": "www.google.com"
	},
	{
		"userId": 31,
		"title": "in, cursus et,",
		"url": "www.google.com"
	},
	{
		"userId": 85,
		"title": "odio",
		"url": "www.google.com"
	},
	{
		"userId": 25,
		"title": "odio",
		"url": "www.google.com"
	},
	{
		"userId": 30,
		"title": "Nunc pulvinar arcu et pede.",
		"url": "www.google.com"
	},
	{
		"userId": 48,
		"title": "non arcu. Vivamus sit",
		"url": "www.google.com"
	},
	{
		"userId": 85,
		"title": "tincidunt tempus risus. Donec",
		"url": "www.google.com"
	},
	{
		"userId": 69,
		"title": "sit amet,",
		"url": "www.google.com"
	},
	{
		"userId": 40,
		"title": "lacinia mattis.",
		"url": "www.google.com"
	},
	{
		"userId": 40,
		"title": "sagittis semper. Nam tempor diam",
		"url": "www.google.com"
	},
	{
		"userId": 43,
		"title": "Nulla semper tellus id nunc",
		"url": "www.google.com"
	},
	{
		"userId": 77,
		"title": "malesuada fames ac turpis",
		"url": "www.google.com"
	},
	{
		"userId": 87,
		"title": "varius et, euismod et,",
		"url": "www.google.com"
	},
	{
		"userId": 37,
		"title": "netus et",
		"url": "www.google.com"
	},
	{
		"userId": 47,
		"title": "mauris sit amet",
		"url": "www.google.com"
	},
	{
		"userId": 12,
		"title": "nec urna et arcu imperdiet",
		"url": "www.google.com"
	},
	{
		"userId": 79,
		"title": "purus, in molestie tortor",
		"url": "www.google.com"
	},
	{
		"userId": 40,
		"title": "mollis. Phasellus",
		"url": "www.google.com"
	},
	{
		"userId": 12,
		"title": "tincidunt",
		"url": "www.google.com"
	},
	{
		"userId": 35,
		"title": "ligula eu",
		"url": "www.google.com"
	},
	{
		"userId": 77,
		"title": "nunc id enim.",
		"url": "www.google.com"
	},
	{
		"userId": 6,
		"title": "Fusce feugiat. Lorem ipsum",
		"url": "www.google.com"
	},
	{
		"userId": 97,
		"title": "Mauris vel",
		"url": "www.google.com"
	},
	{
		"userId": 55,
		"title": "mauris erat eget ipsum.",
		"url": "www.google.com"
	},
	{
		"userId": 33,
		"title": "velit eget laoreet",
		"url": "www.google.com"
	},
	{
		"userId": 19,
		"title": "Nulla eu neque pellentesque massa",
		"url": "www.google.com"
	},
	{
		"userId": 12,
		"title": "tellus",
		"url": "www.google.com"
	},
	{
		"userId": 48,
		"title": "et libero. Proin",
		"url": "www.google.com"
	},
	{
		"userId": 91,
		"title": "in lobortis tellus justo sit",
		"url": "www.google.com"
	},
	{
		"userId": 8,
		"title": "at sem molestie sodales.",
		"url": "www.google.com"
	},
	{
		"userId": 55,
		"title": "Nullam ut nisi a",
		"url": "www.google.com"
	},
	{
		"userId": 44,
		"title": "ipsum. Suspendisse non",
		"url": "www.google.com"
	},
	{
		"userId": 99,
		"title": "ut cursus",
		"url": "www.google.com"
	},
	{
		"userId": 88,
		"title": "est ac",
		"url": "www.google.com"
	},
	{
		"userId": 33,
		"title": "libero.",
		"url": "www.google.com"
	},
	{
		"userId": 41,
		"title": "ridiculus mus.",
		"url": "www.google.com"
	},
	{
		"userId": 53,
		"title": "nibh dolor,",
		"url": "www.google.com"
	},
	{
		"userId": 76,
		"title": "rhoncus.",
		"url": "www.google.com"
	},
	{
		"userId": 58,
		"title": "magnis dis parturient montes,",
		"url": "www.google.com"
	},
	{
		"userId": 37,
		"title": "elementum sem,",
		"url": "www.google.com"
	},
	{
		"userId": 14,
		"title": "libero. Proin",
		"url": "www.google.com"
	},
	{
		"userId": 25,
		"title": "Fusce mollis. Duis sit",
		"url": "www.google.com"
	},
	{
		"userId": 5,
		"title": "auctor",
		"url": "www.google.com"
	},
	{
		"userId": 15,
		"title": "congue a, aliquet vel, vulputate",
		"url": "www.google.com"
	},
	{
		"userId": 35,
		"title": "enim commodo hendrerit.",
		"url": "www.google.com"
	},
	{
		"userId": 15,
		"title": "id enim. Curabitur",
		"url": "www.google.com"
	},
	{
		"userId": 10,
		"title": "libero",
		"url": "www.google.com"
	},
	{
		"userId": 52,
		"title": "in faucibus",
		"url": "www.google.com"
	},
	{
		"userId": 100,
		"title": "mollis non, cursus non, egestas",
		"url": "www.google.com"
	},
	{
		"userId": 65,
		"title": "ut",
		"url": "www.google.com"
	},
	{
		"userId": 76,
		"title": "varius. Nam porttitor",
		"url": "www.google.com"
	},
	{
		"userId": 82,
		"title": "dolor",
		"url": "www.google.com"
	},
	{
		"userId": 41,
		"title": "per conubia",
		"url": "www.google.com"
	},
	{
		"userId": 16,
		"title": "In scelerisque scelerisque",
		"url": "www.google.com"
	},
	{
		"userId": 88,
		"title": "et netus et malesuada fames",
		"url": "www.google.com"
	},
	{
		"userId": 86,
		"title": "ipsum dolor sit amet,",
		"url": "www.google.com"
	},
	{
		"userId": 87,
		"title": "elementum purus, accumsan",
		"url": "www.google.com"
	},
	{
		"userId": 54,
		"title": "Vestibulum",
		"url": "www.google.com"
	},
	{
		"userId": 30,
		"title": "et, magna. Praesent interdum",
		"url": "www.google.com"
	},
	{
		"userId": 3,
		"title": "sem. Nulla interdum. Curabitur dictum.",
		"url": "www.google.com"
	}
];


function insertPosts(arr) {
    var n = arr.length - 1;

    function loopPosts(n) {
        if (n === -1) {
            connection.end();
            return;
        }
        else {
            redditAPI.createPost(arr[n], function(err, res) {
                console.log(res);
                loopPosts(n - 1);
            });
        }
    }
    loopPosts(n);
    console.log('Inserting...');
}

insertPosts(testPosts);
