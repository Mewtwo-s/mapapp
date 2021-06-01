# 🗺️: Algo Tracker
https://meedleapp.herokuapp.com/

## :paperclip: Description
Meedle is a location sharing app that finds an optimal spot to meet up

## :bulb: Inspiration
Meedle is a live location sharing application that helps friends find an optimal place to meet in the middle. It keeps track of users’ real time geolocations, and uses the Google Maps API to generate a meeting place that will equalize travel time for all users. Meedle was built with React, Redux, Node.Js, Express, Socket.io, Turf.js, Nodemailer, postgreSQL, and Sequelize. Building this application, we learned how to track users’ geolocation, implement API security, and manage multi-user live data sharing.

## :thinking: Target Users & Main Features
- 
- 
![Image of Login](https://github.com/karin6543/AlgoTracker/blob/master/public/login.png)

- Log daily practice outcome & syntax error to the system
- [x] Stack Line Chart: shows daily pass/fail distribution; Red - number of problem passed; Green - number of problem failed
- [x] Tree Map: shows practice passing rate by problem category
![Image of Dashboard](https://github.com/karin6543/AlgoTracker/blob/master/public/dashboard.png)

- View auto-generated visualizations that represents overall practice performance
- [x] Donut chart: shows distribution of different error types
![Image of Error](https://github.com/karin6543/AlgoTracker/blob/master/public/error.png)

- Compare practice passing rate vs. the avg. Leetcode user passing rate
- [x] Side-by-Side Bar Chart: compare user passing rate by category vs. avg LeetCode passing rate
![Image of Benchmark](https://github.com/karin6543/AlgoTracker/blob/master/public/benchmark.png)

## :construction: Feature Under Construction 
- Allows user to select error message in browser and report to the application
- Currently leveraging Chrome Extension to capture to browser activity
- User is able to select error message (single word OR a longer text, sentence)
- Makes request to API endpoint created by AWS lambda by sending the selected text
- In the API route, logic written in Python will help to pre-process the seleted text, and return the Error Type as a response
- Response will be pushed to DB, and Error Donut Chart will be redendered
![Image of chrome](https://github.com/karin6543/AlgoTracker/blob/master/public/chrome.png)

## :cake: Tech Stack
- Front-end: React, StyledComponent, React-Google-Map 
- Backend: Express, PostgreSQL, Sequelize
- Deployment: Heroku
- API Usage: Google Map API, Turf.js, Nodemailer
