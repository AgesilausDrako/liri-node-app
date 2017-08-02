// Variable that stores the keys to access APIs
var keys = require("./keys.js");
// Variables for necessary packages
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");
// Variables for command line inputs
var action = process.argv[2];
var value = process.argv[3];

// Sets up the conditions for action and calls the corresponding function
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

// Function which calls the last 20 tweets from Twitter
function twitter() {
	// Makes Twitter request and retrieves keys from keys file
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
  	  consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret,
	});

	// Variable which indicates the account name and number of tweets called
	var params = {screen_name: "darth_polyglot", count: 20 };
	client.get("statuses/user_timeline", params, function(error, tweets, response) {
	  if (!error) {
	  	var count = 0;
	  	if(tweets.length > 20) {
	  		count = 20;
	  	} else {
	  		count = tweets.length;
	  		// Loop which logs out the tweets including the date created
	  		for (var i=0; i<count; i++) {
	  			var tweetOutput = "Date Created: " + tweets[i].created_at + " " + tweets[i].text;
	  			// Logs the data to the random.txt file
	  			log(action, "", tweetOutput);
	  			// Output is logged to the console
	  			console.log(tweetOutput);
	  		}
	  	}   
	  }
	});
}

// Function which retrieves data from Spotify API based on song title input
function spotify() {

	// Makes Spotify requests and retrieves keys from keys.js
	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});
	spotify.search({ type: 'track', query: value, limit: 1 }).then(function(response) {
	// console.log(response);
	// Data is parsed with dot notation and saved in corresponding variables
	var data = response.tracks.items[0];
	var artistName = data.album.artists[0].name;
	var songName = data.name;
	var albumName = data.album.name;
	var songURL = data.album.artists[0].href;
	
	// Final variable for output
	var spotifyOutput = "Artist: " + artistName + "\n" +
				"Song: " + songName + "\n" +
				"Album: " + albumName + "\n" +
				"Preview: " + songURL;
	// Output is logged to the console	
	console.log(spotifyOutput);
	// Logs the data to the random.txt file
	log(action, value, spotifyOutput);	
	})
	.catch(function(err) {
	  console.log(err);
	});
}

// Function which retrieves data from OMDB API based on movie title input
function movie() {

	// Defaults to a value if no input made
	if (value === undefined) {
	  	value = "Mr Nobody";
	}
	
	// Calls new request and retrieves key from keys.js
	request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=" + keys.omdb.key, function(error, response, body) {
	  
	  if (!error && response.statusCode === 200) {

	  	// Data is parsed and saved in a variable to access requried info
	  	var bodyObj = JSON.parse(body);
	  	var ratings = "";

	  	// Variable is looped over to build the ratings variable(multiple ratings)
	    bodyObj.Ratings.forEach(function(item) {
	      ratings += `${item.Source} - ${item.Value}\n`;
	    });
	  	
	  	// Final variable for output
	  	var movieOutput = "Title: " + bodyObj.Title + "\n" +
  					    "Release Year: " + bodyObj.Year + "\n" +
  						"Ratings: " + ratings +
						"Country: " + bodyObj.Country + "\n" +
			    	    "Language: " + bodyObj.Language + "\n" + 
			    	    "Plot: " + bodyObj.Plot + "\n" +
			    	    "Actors: " + bodyObj.Actors;
		// Output is logged to the console
	    console.log(movieOutput);
	  }
	  // Logs the data to the random.txt file
	  log(action, value, movieOutput);
	});
}

// Function which retrieves data from the random.txt file and coverts them to instructions for function
function text() {
	// FileSystem reads the random.txt file
	fs.readFile("random.txt", "utf8", function(error, data) {

	  if (error) {
	    return console.log(error);
		}
		  // Breaks the string down by comma separation and store the contents into the output array.
		  var output = data.split(",");
		  // Variable which saves the input for calling the necessary action function
		  var command = output[0];
		  // Updates value with the necessary input for the function (song title, etc.)
		  value = output[1];

		// Depending on input the necessary function is called
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

// Logs final outputs the log.txt file
function log(action, value, data) {
	fs.appendFile("log.txt", action + " " + value + `\n` + data + `\n` + `\n`, function(err) {
	  if (err) {
	    return console.log(err);
	  }
	});
}