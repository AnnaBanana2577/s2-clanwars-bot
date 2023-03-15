## Todo

Commands

- [x] register <playfabid>
- [x] createclan <clanname>
- [x] apply <clanname>
- [x] clans
- [x] applicants
- [x] leave
- [x] clan <clanname>
- [x] makeleader <user>
- [x] accept <user>
- [x] deny <user>
- [x] ready
- [x] cancel
- [x] status command
- [x] help command

Start match function

- [x] Check for empty servers - if so StartMatch
- [x] If not, put in a queue

S2 Server

- [ ] Pause / Restart / Voting Script
- [ ] Script counts rounds (more than 2 mins), after 3 rounds posts back to bot

Planning

- Bot creates match object in DB
  - Sets timeout for 30 mins - after 30 mins checks if server empty - if so deletes match
- Server puts every joining player as spec - cant change teams
  - sends to bot playfabId on server join - bot handles setting team via rcon
- Server posts to bot when all players left - bot deletes match
- Server posts to bot when a round ends - bot delets match after 3 rounds
