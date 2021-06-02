# 🗺️ Meedle
https://meedleapp.herokuapp.com/

## :paperclip: Description
Meedle is a location sharing app that finds an optimal spot to meet up

## :bulb: Inspiration
Have you ever wanted to meet up with friends but can’t decide where? One friend wants to grab breakfast at the spot by their apartment, while the other insists that they meet closer to their house. You get frustrated and end up cancelling all together. 
Meedle is a live location sharing application that helps friends find an optimal place to meet in the middle. It keeps track of users’ real time geolocations, and uses the Google Maps API to generate a meeting place that will equalize travel time for all users. Meedle was built with React, Redux, Node.Js, Express, Socket.io, Turf.js, Nodemailer, postgreSQL, and Sequelize. Building this application, we learned how to track users’ geolocation, implement API security, and manage multi-user live data sharing.

## :thinking: Target Users & Main Features
#### Users
- Any group of friends deciding meetup location, or simply wanting to keep track of each other's location
#### Features
- Tracker Realtime Geolocations
- [x] Listen to realtime geo-location change
- [x] Prompt users to manually input address when geo-location watching fail 
![Image of locationFail](https://github.com/Mewtwo-s/mapapp/blob/main/public/geolocaitonFail.png)
![Image of userInput](https://github.com/Mewtwo-s/mapapp/blob/main/public/userInput.png)
- Create User Session: generate unique map session for group of friends to share live geo-locations
![Image of create](https://github.com/Mewtwo-s/mapapp/blob/main/public/create.png)


- Generate Invites From One of The Following Options
- [x] Session Code
- [x] Email
![Image of invite](https://github.com/Mewtwo-s/mapapp/blob/main/public/invite.png)

- Generate The Midpoint
- [x] Once friends joined the share map, session host will be able to generate the 'midpoint', which is the optimal geocode calculated base on equal travel distance of multiple user's geolocation coordinates
![Image of midpoint](https://github.com/Mewtwo-s/mapapp/blob/main/public/midpoint.png)

- Select Meetup Spot 
- [x] The app will auto generate a list of coffee shops (max. 3) and allow the host to pick the final meeting spot
![Image of places](https://github.com/Mewtwo-s/mapapp/blob/main/public/places.png)

- Generate Route And Find Directions
- [x] Once meeting spot is selected, a route from user's current location to the meeting point will be automatically generated
![Image of diection](https://github.com/Mewtwo-s/mapapp/blob/main/public/direction.png)
- [x] Each individual user will be directed to google map for further tranportatio guides
![Image of googlemap](https://github.com/Mewtwo-s/mapapp/blob/main/public/googlemap.png)


## :construction: Feature Under Construction 
- Progrssive Web App (PWA): transform the web-app into a PWA and leverage the caching features
- In-App notification: support in-app notifications


## :cake: Tech Stack
- Front-end: React, StyledComponent, React-Google-Map 
- Backend: Express, PostgreSQL, Sequelize
- Deployment: Heroku
- API Usage: Google Map API, Turf.js, Nodemailer
