# Monitor

Uptime monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

#### This project is built for the job test assignment of Bosta.co
##### MERN Stack

### Notes:

## Implementation Steps:
- [ ] make express server to test on
- [ ] log url data from static url
- [ ] path to add urls
- [ ] path to stop urls
- [ ] crud urls in database
- [ ] GET POST UPDATE DELETE urls paths
- [ ] crud url reports in database
- [ ] alert when url is down
- [ ] send webhook notifications at uptime or downtime - check bosts.co integration
- [ ] sign-up path
- [ ] change or delete account path
- [ ] account email verifications
- [ ] send emails at uptime or downtime event
- [ ] store check types
- [ ] add tags to paths and searchability to checks with tags

## Requested Features:
- [ ] Sign-up with email verification.
- [ ] Stateless authentication using JWT.
- [ ] Users can create a check to monitor a given URL if it is up or down.
- [ ] Users can edit, pause, or delete their checks if needed.
- [ ] Users may receive a notification on a webhook URL by sending HTTP POST request whenever a check goes down or up.
- [ ] Users should receive email alerts whenever a check goes down or up.
- [ ] Users can get detailed uptime reports about their checks availability, average response time, and total uptime/downtime.
- [ ] Users can group their checks by tags and get reports by tag.
