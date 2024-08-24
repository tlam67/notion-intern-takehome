import chalk from "chalk";

import sendCommand from "../commands/send.js";
import readCommand from "../commands/read.js";
import deleteCommand from "../commands/delete.js";
import helpCommand from "../commands/help.js";
import { MainCommands, CommandPrompts } from "./enum.js";
import { getSender, getMessage, getRecipient } from "./prompt.js";

/***********************************
 * PUBLIC METHODS
 **********************************/

/**
 * Handles all commands by invoking the approriate handlers.
 * 
 * @param {Function} inputFunction - function to prompt for input
 * @param {Function} selectFunction - function to prompt for selection
 * @param {string} command - the command to process. Valid commands:
 * - {@link MainCommands.EXIT_COMMAND} - exit the program
 * - {@link MainCommands.SEND_COMMAND} - send a message
 * - {@link MainCommands.READ_COMMAND} - read a message(s)
 * - {@link MainCommands.DELETE_COMMAND} - delete a message
 * - {@link MainCommands.HELP_COMMAND} - display help information
 * @returns {Promise<boolean>} - returns a promise that resolves to `true` if the command is `EXIT_COMMAND` and `false` otherwise
 */
export default async function commandHandler(inputFunction, selectFunction, command) {
  if (command === MainCommands.EXIT_COMMAND) {
    return true;
  }

  if (command === MainCommands.SEND_COMMAND) {
    await handleSend(inputFunction);
  } else if (command === MainCommands.READ_COMMAND) {
    await handleRead(inputFunction, selectFunction);
  } else if (command === MainCommands.DELETE_COMMAND) {
    await handleDelete(inputFunction, selectFunction);
  } else if (command === MainCommands.HELP_COMMAND) {
    handleHelp();
  } else {
    // just in case validation in the prompt fails
    console.log("Unknown command. Please try again.");
  }
  return false;
}

/***********************************
 * PRIVATE METHODS
 **********************************/

/**
 * Synchronously displays information on possible commands
 */
function handleHelp() {
  helpCommand();
}

/**
 * Handles the send command by getting user input for sender,
 * recipient and message, then sending to notion API.
 *
 * @param {Function} inputFunction - function to prompt for input
 * @todo support multiline messages
 */
async function handleSend(inputFunction) {
  const sender = await getSender(inputFunction);
  const recipient = await getRecipient(inputFunction);
  const message = await getMessage(inputFunction);
  const success = await sendCommand(sender, recipient, message);
  if (success) {
    console.log(chalk.green("Message sent successfully"));
  } else {
    console.log(chalk.red("Error sending message"));
  }
}

/**
 * Handles the command for read by allowing user to browse messages.
 * 
 * @param {Function} selectFunction - function to prompt for selection
 */
async function handleRead(inputFunction, selectFunction) {
  await browseMessages(inputFunction, selectFunction, CommandPrompts.READ_MESSAGES);
}

/**
 * Handles the command for delete by allowing user to select a message
 * to delete.
 * 
 * @param {Function} selectFunction - function to prompt for selection
 */
async function handleDelete(inputFunction, selectFunction) {
  const messageId = await browseMessages(inputFunction, selectFunction, CommandPrompts.DELETE_MESSAGES);
  // check user selected message instead of exiting
  if (messageId) {
    const success = await deleteCommand(messageId);
    if (success) {
      console.log(chalk.green("Message deleted successfully"));
    } else {
      console.log(chalk.red("Error deleting message"));
    }
  }
}

/**
 * Opens an interactive prompt for the user to select messages.
 * Used for letting user browse messages for read and delete operations.
 *
 * @param {Function} selectFunction - function to prompt for selection
 * @param {string} selectPrompt the prompt to be displayed along with the messages
 * @returns {string | null} the page ID of the selected message or null if no page selected (user selected 'back')
 */
async function browseMessages(inputFunction, selectFunction, selectPrompt) {
  const recipient = await getRecipient(inputFunction);

  let nextCursor = undefined;
  let msgs = []; // messages loaded so far

  // options for user to go back or load more
  const backOption = {
    name: chalk.red("Back"),
    value: false, // page ID is uuid, safe to set this to bool
  };
  const loadOption = {
    name: chalk.green("Load more messages"),
    value: true, // page ID is uuid, safe to set this to bool
  };

  while (true) {
    // read a page of messages
    const response = await readCommand(recipient, nextCursor);

    if (!response) {
      // if response is null. Empty response won't trigger this
      console.log(chalk.red("Error reading messages"));
      break;
    } else if (response.results.length === 0 && !nextCursor) {
      // no messages at all
      console.log(chalk.red(recipient, "has no messages"));
      break;
    }

    // update next cursor so we can make follow up requests to correct page
    nextCursor = response.has_more ? response.next_cursor : undefined;

    // list of messages to display, return page ID to delete when one is selected
    const messages = response.results.map((page) => ({
      name: `from: ${chalk.blue(page.properties.Sender.rich_text[0]?.text?.content)}, date: ${chalk.blue(page.created_time)}\n${chalk.blueBright(page.properties.Message.title[0]?.text?.content)}\n`,
      value: page.id,
    }));

    // update messages in memory
    msgs = msgs.concat(messages);

    // if there are more messages, add load more option
    let options = nextCursor ? [loadOption, backOption] : [backOption];

    const messageId = await selectFunction({
      message: selectPrompt,
      choices: msgs.concat(options),
    });

    if (messageId === true) {
      // Load more messages, loop over with the updated cursor
      continue;
    } else if (messageId === false) {
      // Back, exit loop without deleting anything
      break;
    } else {
      // User selected a message
      return messageId;
    }
  }
  return null;
}
