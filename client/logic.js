// Before Map component
- user generates code, manually send to another user
- host starts session, enter map 
- other non-host user enter code, join map, DB POST call to userSession table


//IN MAPP
Data needed:
1. session info - roomId, passcode
2. user info - userId
3. user realtime location

To render the markers - keep track of an object?

{ roomId : [{user1: loc}, {user2: loc} , {user3: loc} ... ] } 

- we save this in REDUX Store
- we save this in DB or Cache, like every 5 mins? 
- when should we save data to DB? 

General Workflow

*** DO WE NEED THIS ??? ***
- user joined a room
Action: JOIN_ROOM 


- get session info from backend
Action: GET_SESSION 

- access user info 
No action needed, we have props.auth!

- get the current location - start watching location for a single user
Action: MY_LOCATION_UPDATED
THUNK: watchMyLocation 
Goal - keep track of user loation & make change to the array of locations, and save to REDUX Store


- emit currentUser location to all users in the room
SOCKET: emit location of currentUser to all the other users in the room
Q: MY_LOCATION_UPDATED should update the REDUX store. does everyone's map get re-rendered once
the store change? it this is the case, do we still need to emit message?

- everyone in the room receives updates, map re-render!


- with all the above ^^^ able to load the map for >=1 user

- render the lcoations as marker



- when a single user quits page, clear the location for a single user
e.g 
{sessionID: [{user1: loc}, {user2: loc} , {user3: loc} ... ]} 
user1 leaves -> trigger action LEAVE_SESSION -> call stopWatchingMyLocation & remove {user1:loc}
from our array
- REDUX store get updated [{user2: loc} , {user3: loc} ... ]
- page re-rendered for all 

Action - LEAVE_SESSION, LOCATION_WATCH_STOPPED (do we really need this, or we can just call the stopWatch function)
THUNK - stopWatchingMyLocation


- when a single user refreshes the page 
we need a way to access the array of locations -> [{user1: loc}, {user2: loc} , {user3: loc} ... ]
can we trigger MY_LOCATION_UPDATED again? 
Maybe a GET_CURRENT_SESSION_USER action makes sense since we are just fetching but not trying to change anything?


- what if a single user got yeeted out, and comes back
GET_CURRENT_SESSION_USER should work 