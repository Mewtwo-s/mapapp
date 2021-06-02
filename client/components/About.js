import React from 'react'

function About() {
    return (
        <div className="container" style={{color:"#0f3057"}}>
        <div>
            <h2>What Is Meedle ?</h2>
            <div>Meedle is a live location sharing application that helps friends find an optimal place to meet in the middle. It keeps track of users’ real time geolocations, and uses the Google Maps API to generate a meeting place that will equalize travel distance for all users.</div>
            </div>
        <div>
        <div>
            <h2>Tech-Stack</h2>
            <li>Frontend: React(w.hooks), React-Google-Map, Redux, styled-components</li>
            <li>Backend: Express, PostgreSQL, Sequelize</li>
            <li>APIs: Google Map APIs, Socket.io, Turf.js, Nodemailer</li>
        </div>
        <div>
            <h2> Before Session Starts</h2>
            <div><h3></h3>
            <h4>Create New Session</h4>
            <li>
            <a href='https://mapapp999test.herokuapp.com/home'> In homepage, create a new session</a></li>
            <h4>Invite Friends
            <li>By session code</li> 
            <li>By Email</li>
            <li>Invite existing Meedle users</li>
            </h4></div>

        <div>
            <h2>In A Session</h2>
            <h4>
            <li>Enable user's geolocation setting</li>
            <li>When geolocation failed, user will be prompted to enter address</li>
            <li>When all friends joined session, host and generate the optimal meetup point</li>
            <li>Hosts can select a coffee shop as the final meetup location for all the users in the session</li>
            <li>Users can click on the map and get directed to Google Map for further transporation guide</li></h4>
            
            <div>
            <h2>Ending A Session</h2>
            <h4>
            <li>When all users arrived at the meetup spot and clicked 'I have arrived', session will end for all users</li>
            <li>Host can end session for all users anytime</li> 
            </h4>
            </div>
            </div>
            <h2><a href='https://github.com/Mewtwo-s/mapapp/blob/main/README.md'>Curious About Meedle? Checkout Our GitHub Repository 👀... Have Fun Meeting With Your Friends In The Middle 🙌</a></h2></div>
            <h2></h2>
         
        </div>
        </div>
    )
}

export default About
