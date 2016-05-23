var ObjectID = require('mongodb').ObjectID;
var exec = require('child_process').exec;


module.exports = function(app, db) {

	var stop_counter = 0;

	app.get('/', function(req, res){
		res.send('welcome to moticat, son.');
		//res.sendfile('./public/views/index.html'); //load our public/index.html file

	});

	app.get('/north', function(req, res){
		var a = Array.apply(null, Array(46)).map(Number.prototype.valueOf,0);

		a[stop_counter] = 1;

		stop_counter+=1;

		stop_counter = stop_counter % 46;

		res.send(a.toString());
		
	});

	app.get('/video/:uid', function(req, res){
		var videos = db.collection('videos');

		var uid = req.params.uid; //user id

		console.log("video request from " + uid);

		videos.count(function(err, count){

			var random = Math.floor(Math.random() * (count));

			videos.find({}).skip(random).toArray(function(err, docs) {		

				if(err) throw err;

				res.send(docs[0]);
			});

		});

	});


	app.get('/quote/:uid', function(req, res){
		var quotes = db.collection('quotes');

		var uid = req.params.uid; //user id

		console.log("quote request from " + uid);

		quotes.count(function(err, count){
		
			//var random = Math.floor(Math.random() * ((count + 1) - 1)) + 1;//ids must be numbers
			var random = Math.floor(Math.random() * (count));

			console.log(random);

			quotes.find({}).skip(random).toArray(function(err, docs) {		

				if(err) throw err;

				res.send(docs[0]);
			});

		});
	});

	app.get('/combo/:uid', function(req, res){
		var videos = db.collection('videos');
		var quotes = db.collection('quotes');

		var user = req.params.uid;

		console.log("combo request from " + user);

		//get count of quotes to use to find a random quote
		quotes.count(function(err, qcount){

			//choose random number to choose random quote
			var qrandom = Math.floor(Math.random() * (qcount));

			console.log(qrandom + "th quote chosen");

			quotes.find({}).skip(qrandom).toArray(function(err, docs) {		

				if(err) throw err;

				var combo = {};

				//random quote is here
				combo["quote"] = docs[0];

				//get count of videos to use to find a random video
				videos.count(function(err, vcount){

					//choose random number to choose random video
					var vrandom = Math.floor(Math.random() * (vcount));

					console.log(vrandom + "th video chosen");

					videos.find({}).skip(vrandom).toArray(function(err, docs) {		

						if(err) throw err;

						//random video is here
						combo["video"] = docs[0];

						res.send(combo);
					});

				});
			});

		});

	});

	app.get('/video/:uid/:cid', function(req, res){
		var videos = db.collection('videos');

		var uid = req.params.uid; //user id
		var cid = req.params.cid; //category id

		console.log("video request from " + uid);

		videos.find({}).toArray(function(err, docs) {		

			if(err) throw err;

			res.send(docs);
		});
	});


app.put('/user/:uid', function(req, res){

	console.log("add user if non-existence");
	var users = db.collection('users');

	var uid = req.params.uid;
	
		users.insert({_id: uid}, function(err, doc){

			if(err)
			{
				console.log(uid + " already exists");
				res.send("This mf, " + uid + ", already exists.");
				return;
			}
			
			console.log("welcome " + uid);
			res.send("Welcome to Moti, " + uid + ".");

		});

	});

}