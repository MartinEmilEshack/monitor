# Monitor

Uptime monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

#### This project is built for the job test assignment of Bosta.co

##### MERN Stack

### Notes:

-  jump-started the project from a MERN stack project template [MERN template](https://github.com/MoathShraim/Nodejs-rest-api-project-structure-Express)

## Implementation Steps:

-  [x] ~~make express server to test on~~
-  [x] ~~log url data from static url~~
-  [x] ~~path to add urls~~
-  [x] ~~path to stop urls~~
-  [x] ~~crud urls in database~~
-  [x] ~~GET POST UPDATE DELETE urls paths~~
-  [x] ~~GET reports paths~~
-  [x] ~~crud url reports in database~~
-  [x] ~~alert when url is down after being up~~
-  [x] ~~alert when url is up after being down~~
-  [x] ~~send emails at uptime or downtime event~~
-  [x] ~~send webhook notifications at uptime or downtime - check bosta.co integration~~
-  [x] ~~sign-up path~~
-  [x] ~~log-in path~~
-  [ ] change account path
-  [x] ~~delete account path~~
-  [ ] account email verifications
-  [ ] store check tags
-  [ ] searching mechanisms for checks name, id, tags
-  [ ] searching mechanisms for reports id, user_id, check_name, check_id, check_tags

## Requested Features:

-  [ ] Sign-up with email verification.
-  [x] ~~Stateless authentication using JWT.~~
-  [x] ~~Users can create a check to monitor a given URL if it is up or down.~~
-  [x] ~~Users can edit, pause, or delete their checks if needed.~~
-  [x] ~~Users may receive a notification on a webhook URL by sending HTTP POST request whenever a check goes down or up.~~
-  [x] ~~Users should receive email alerts whenever a check goes down or up.~~
-  [x] ~~Users can get detailed uptime reports about their checks availability, average response time, and total uptime/downtime.~~
-  [ ] Users can group their checks by tags and get reports by tag.
-  [ ] unit testing
