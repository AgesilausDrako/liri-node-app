# liri-node-app

## Description
Liri is a backend application, utilizing node.js, to represent a command line search engine. It queries various APIs and returns data ranging from recent tweets from twitter and song/movie information.

## Important Details
This application requires node.js so please be sure to have that installed or it will not work.
Before running the application it is necessary to navigate to the folder containing all of the application files and run the following command in the terminal: **npm install**
This will install all the packages and their necessary versions according to the package.json file.

**Please note that node.js v6.11.2 is the version used utilized in the production of this application. It is not known how newer versions will affect its performance.**

## Utilization
In order to run liri the user will need to: 
1. Pull the files and navigate to the proper folder. 
2. In order to pull the most recent tweets the user will need to enter into the console: **node liri.js my-tweets**
3. In order to query data about a specific song the user will need to enter into the console: **node liri.js spotify-this-song '<song name here>'**
4. In order to query data about a specific movie the user will need to enter into the console: **node liri.js movie-this '<movie name here>'**
5. Liri can also execute preset instructions by reading a file. To do that the user must enter into the console: **node liri.js do-what-it-says** (At the moment the file is set to spotify a song but it could easily be modified for more commands)
6. The user can continue making queries until done.

## Added feature
Liri also employs a log function which writes every query into a log.txt file to keep track of historical data and usage.