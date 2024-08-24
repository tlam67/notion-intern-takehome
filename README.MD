Features to include
- send
- receive
- delete (also clear all messages)
- change API key
- change database
- create database
- configure database (takes an existing database and formats the columns correctly)
- could try caching recent messages
- display using inquirer select prompt for the read mail, display 5 at a time, and load more option
- retry logic
- more testing like running the program, going through some flow and quitting via ctrl-c in the middle of it

"test": "node --experimental-vm-modules ./node_modules/jest/bin/jest" 
points to the jest/bin/jest instead of .bin/jest because of windows issue.

fix _ naming to camelCase

# Notion Mail CLI App
A command line app supporting sending, reading, and deleting messages, backed by a Notion Database.

# Installation
Download the source code. 

