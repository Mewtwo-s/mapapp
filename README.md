# 🗺️ Meedle
https://meedleapp.herokuapp.com/

## :paperclip: Description
Meedle is a location sharing app that finds an optimal spot to meet up

## :bulb: Inspiration
Have you ever wanted to meet up with friends but can’t decide where? One friend wants to grab breakfast at the spot by their apartment, while the other insists that they meet closer to their house. You get frustrated and end up cancelling all together. 
Meedle is a live location sharing application that helps friends find an optimal place to meet in the middle. It keeps track of users’ real time geolocations, and uses the Google Maps API to generate a meeting place that will equalize travel time for all users. Meedle was built with React, Redux, Node.Js, Express, Socket.io, Turf.js, Nodemailer, postgreSQL, and Sequelize. Building this application, we learned how to track users’ geolocation, implement API security, and manage multi-user live data sharing.

## :thinking: Target Users & Main Features
#### Users: Any group of friends deciding meetup location, or simply wanting to keep track of each other's location
#### Features

- Create User Session: generate unique map session for group of friends to share live geo-locations

![Image of Dashboard](https://github.com/karin6543/AlgoTracker/blob/master/public/dashboard.png)

- Invite Friends & Guests
- [x] Stack Line Chart: shows daily pass/fail distribution; Red - number of problem passed; Green - number of problem failed
- [x] Tree Map: shows practice passing rate by problem category
![Image of Dashboard](https://github.com/karin6543/AlgoTracker/blob/master/public/dashboard.png)

- Generate Meetup Spot
- [x] Donut chart: shows distribution of different error types
![Image of Error](https://github.com/karin6543/AlgoTracker/blob/master/public/error.png)

- Generate Route And Find Directions
- [x] Side-by-Side Bar Chart: compare user passing rate by category vs. avg LeetCode passing rate
![Image of Benchmark](https://github.com/karin6543/AlgoTracker/blob/master/public/benchmark.png)

## :construction: Feature Under Construction 
- Allows user to select error message in browser and report to the application


## :cake: Tech Stack
- Front-end: React, StyledComponent, React-Google-Map 
- Backend: Express, PostgreSQL, Sequelize
- Deployment: Heroku
- API Usage: Google Map API, Turf.js, Nodemailer
