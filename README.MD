# Notion Mail CLI App
A command line app supporting sending, reading, and deleting messages, backed by a Notion Database. The Notion API is used to interact with the database.

## Design Decisions
I decided to use [inquirer](https://www.npmjs.com/package/inquirer) to handle the CLI interactions from the user. This was done because it presents a clean UI and significantly sped up development by allowing me to leverage the pre-existing functions.

One key drawback is that inquirer does not have multi-line input support out of the box. Technically, it does support it, but to do so it will open an editor such as notepad, vim, nano, etc and allow the user to enter input. I decided to not use this function to keep this app purely CLI based. There was the option to require an installation of vim or nano as they are also terminal based, but I did not want the UX to jump in and out of editor and CLI.

The path forward for supporting multi-line input would likely be to implement a custom multi-line parsing function to grab user input after the user manually ends the message, perhaps with a specified key combination like `ctrl + enter`.

## References
I spent a lot of time looking at inquirer docs and Notion API docs. For testing, I am not super familiar with the intricacies of JavaScript mocking, such as CommonJS vs ES modules and the difference in import/export behaviours so I had to spend a lot of time reading StackOverflow to try and understand how to test some of the functions.

When starting out, I also referenced this repo for [Node.js CLI Apps Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)

## Additional Features
- Notion Client singleton so that the client is only created a single time
- Message timestamps
- Delete message functionality
- Test suite (incomplete - ran out of time)
- Exit command
- Paginate requests (override default page size of 100 -> 5 since most people won't need to read their last 100 messages at a time)
  - Note that reading messages for a user no longer displays the number of messages as shown in the sample. This is the trade off for paginating, which I believe to be worth it for efficiency and considering the typical usecase.

## Future Improvements
- Complete test suite
- Add a caching layer to avoid repeated calls to the API for the same data
- Improve the database structure
  - Create an index on the recipient by setting up the database to store the recipient name, and a pageID pointing to another database that holds only messages to that user.
  - This greatly improves efficiency of all operations, since for send, read, and delete we are always filtering on the recipient. We no longer need to iterate over messages which we expect to be strictly larger than number of users.
- Add command to create the database for the user
- Add command to change the database id without needing to manually edit the .ENV
- Add command to change the API key without needing to manually edit the .ENV
- Add retry logic or error handling to failed queries
  - Depending on the error returned, prompt user to input specific fields again. Detect API key error and database ID errors and notify user of misconfigured .ENV

# Installation
## Prerequisites
- [node]()
- [npm]() or [yarn]()

## Clone the repository
```
git clone github-link
cd my-repo
```

## Install dependencies
```
npm install
# or
yarn install
```
## Setup Notion Database
1. Head over to [Notion's home page](https://www.notion.so/) and create a free Notion account, if you don't already have one.
2. Create a database in Notion. You can create a database by creating a new page and selecting `Table` in the template selection menu.

[Here is an example of a database with the columns we'll need.](https://notion.notion.site/2d89d69e5b584c7a8896e61c006a3433?v=4803c24e13894ed28d5c3f5c0579bc8d)

Note: the *Message* column should have the *Title* property, *Sender* and *Recipient* should be *Text* properties, not *Person* properties.

3. Create and connect a new integration to the database
    - Check out the [Getting Started guide for the Notion API](https://developers.notion.com/docs/create-a-notion-integration#getting-started) to learn how to create an integration
    - Be sure to [give your integration permission](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions) to access the database page!

## Setup .ENV
```
NOTION_API_KEY=<your-api-key>
NOTION_DATABASE_ID=<your-database-id>
```

# Usage
## Starting the app
```
mail
# or
npm start
# or 
yarn start
```
## Commands
### Send
Prompts user to input a sender, recipient, and message. Sender and recipient cannot be empty. On valid input, sends the message from sender to the recipient.
### Read
Prompts user to input a recipient. Recipient cannot be empty. On valid input opens a selection for user to scroll through messages. 

Messages are sorted by most recent, and loaded in pages. To view more messages, select `Load more messages` command. To go back, select `Back` or select any message.
### Delete
Prompts user to input a recipient. Recipient cannot be empty. On valid input, opens a selection for user to scroll through messages.

Select a message to delete it. To go back without deleting any messages, select `Back`. To load more messages select `Load more messages`.
### Help
Displays possible commands and their descriptions.
### Exit
Exits the program.

# Example
```
$ npm start

Welcome to NotionMail!
Please select an option:
- send: Send mail to a user.
- read: Check a user's mail.
- delete: delete mail for a user.
- exit: exit program.
- help: display help.
? Enter command:

# type command and press enter to submit
```

# Testing
## Running tests
This project uses Jest for testing. To run the tests, use the following command
```
npm test
# or 
yarn test
```
