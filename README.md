## Cricket app 

The app contains information of all cricket matches going on live. You can also browse a players statistics and other information. The app is built using Node.js, Bootstrap. In order to run the app go to project folder in your terminal and then use the command ```npm start ``` to run the app

### API used
The app uses cricapi from which it fetches live scores and player information which is shown at frontend to the user. 

### Project Structure
``` .
├── public
│   ├── components
│   │   ├── compmatches.html
│   │   ├── liveMatches.html
│   │   ├── matchScore.html
│   │   ├── navbar.html
│   │   ├── playFind.html
│   │   └── upmatches.html
│   ├── css
│   │   └── styles.css
│   ├── index.html
│   └── js
│       ├── compmatches.js
│       ├── liveMatches.js
│       ├── matches.js
│       ├── navbar.js
│       ├── playFind.js
│       └── script.js
└── server.js
```
### Screenshots of the app

The image below shows all recent cricket matches going live
![Alt text](./images/cricapp1.png?raw=true "Live Matches Information")

After clicking on view details you can get complete scorecard for the match as shown below
![Alt text](./images/cricapp6.png?raw=true "Live Matches Information")

The image below shows full profile of a player queried by the user
![Alt text](./images/cricapp3.png?raw=true "Player Finder")

The image below shows the upcoming matches in the future
![Alt text](./images/cricapp5.png?raw=true "Player Finder")

