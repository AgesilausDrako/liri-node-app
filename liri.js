var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var action = process.argv[2];
var value = process.argv[3];

switch (action) {
  case "my-tweets":
    twitter();
    break;

  case "spotify-this-song":
    spotify();
    break;

  case "movie-this":
    movie();
    break;

  case "do-what-it-says":
    text();
    break;
}

function twitter() {
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
  	  consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret,
	});

	var params = {screen_name: "darth_polyglot", count: 20 };
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
	  if (!error) {
	  	var count = 0;
	  	if(tweets.length > 20) {
	  		count = 20;
	  	} else {
	  		count = tweets.length;
	  		for (var i=0; i<count; i++) {
	  			var tweetOutput = "Date Created: " + tweets[i].created_at + " " + tweets[i].text;
	  			// log(tweetOutput);
	  			console.log(tweetOutput);
	  		}
	  	}   
	  }
	});
}

function spotify() {

	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});
	 
	spotify.search({ type: 'track', query: value, limit: 1 }).then(function(response) {
	console.log(response);
	// var data = JSON.parse(response);
	// console.log(data);
	// 	for (var key in response) {
	// 		console.log(key, response[key]);
	// 	}
	})
	.catch(function(err) {
	  console.log(err);
	});
}

function movie() {
	
	request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=" + keys.omdb.key, function(error, response, body) {
	  if (!value) {
	  	value = "Mr. Nobody";
		}
	  
	  if (!error && response.statusCode === 200) {

	  	var bodyObj = JSON.parse(body);
	  	var ratings = "";

	    bodyObj.Ratings.forEach(function(item) {
	      ratings += `${item.Source} - ${item.Value}\n`;
	    });
	  	
	  	var movieOutput = "Title: " + bodyObj.Title + "\n" +
  					    "Release Year: " + bodyObj.Year + "\n" +
  						"Ratings: " + ratings +
						"Country: " + bodyObj.Country + "\n" +
			    	    "Language: " + bodyObj.Language + "\n" + 
			    	    "Plot: " + bodyObj.Plot + "\n" +
			    	    "Actors: " + bodyObj.Actors;

	    console.log(movieOutput);
	  }
	  //log(movieOutput);
	});
}

function text() {
	fs.readFile("random.txt", "utf8", function(error, data) {

	  if (error) {
	    return console.log(error);
		}
		// Break the string down by comma separation and store the contents into the output array.
		  var output = data.split(",");
		  var command = output[0];
		  value = output[1];

		  // Loop Through the newly created output array
		  for (var i = 0; i < output.length; i++) {

		    // Print each element (item) of the array/
		    console.log(output[i]);
	  	}

	  	if (command === "movie-this") {
	  		movie(value);
	  	}

	  	if (command === "spotify-this-song") {
	  		spotify(value);
	  	}

	  	if (command === "my-tweets") {
	  		twitter();
	  	}
	});
}

// function log(data) {
// 	fs.appendFile("log.txt", data + `\n` + `\n`, function(err) {
// 	  if (err) {
// 	    return console.log(err);
// 	  }
// 	});
// }