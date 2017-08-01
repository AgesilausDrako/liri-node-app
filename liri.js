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
	  	var count= 0;
	  	if(tweets.length > 20) {
	  		count =20;
	  	} else {
	  		count = tweets.length;
	  		for (var i=0; i<count; i++) {
	  			console.log("Date Created: " + tweets[i].created_at + " " + tweets[i].text);
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
	 
	spotify.search({ type: 'track', query: value }).then(function(response) {
    console.log(response);
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

			var rotten = "Rotten Tomatoes";
	  	var movieOutput = `Title: ` + JSON.parse(body).Title + `\n` +
			    		  `Release Year: ` + JSON.parse(body).Year + `\n` +
			    		  `IMDB Rating: ` + JSON.parse(body).imdbRating + `\n` +
			    		  //`Rotten Tomatoes Rating: ` + JSON.parse(body).Ratings.Source.${rotten}.Value + `\n` +
			    		  `Country: ` + JSON.parse(body).Country + `\n` +
			    	      `Language: ` + JSON.parse(body).Language + `\n` +
			    	      `Plot: ` + JSON.parse(body).Plot + `\n` +
			    	      `Actors: ` + JSON.parse(body).Actors

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
			
	  spotify(data);

	});
}

// function log(data) {
// 	fs.appendFile("log.txt", data + `\n` + `\n`, function(err) {
// 	  if (err) {
// 	    return console.log(err);
// 	  }
// 	});
// }