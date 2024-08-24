import chalk from "chalk";

/**
 * Enums to hold common constants.
 */

export const MainCommands = Object.freeze({
  SEND_COMMAND: "send",
  READ_COMMAND: "read",
  HELP_COMMAND: "help",
  DELETE_COMMAND: "delete",
  EXIT_COMMAND: "exit",
});

const commandSpacing = " ".repeat(4);
export const CommandPrompts = Object.freeze({
  GET_COMMAND: "Enter command:",
  GET_SENDER: commandSpacing + "Sender:",
  GET_RECIPIENT: commandSpacing + "Recipient:",
  GET_MESSAGE: commandSpacing + "Message:",
  READ_MESSAGES: "Browse messages:",
  DELETE_MESSAGES: "Select a message to delete:",
  INVALID_COMMAND: `Please enter a valid command ${Object.values(MainCommands)}`
})

export const NotionApiConstants = Object.freeze({
  PAGE_SIZE: 5,
});

export const DatabaseSchema = Object.freeze({
  SENDER_COLUMN: "Sender",
  SENDER_COLUMN_TYPE: "rich_text",
  RECIPIENT_COLUMN: "Recipient",
  RECIPIENT_COLUMN_TYPE: "rich_text",
  MESSAGE_COLUMN: "Message",
  MESSAGE_COLUMN_TYPE: "title",
});

export const UserMessages = Object.freeze({
  WELCOME: "Welcome to NotionMail!",
  HELP: `Please select an option:\n- ${chalk.green("send")}: Send mail to a user.\n- ${chalk.green("read")}: Check a user's mail.\n- ${chalk.green("delete")}: delete mail for a user.\n- ${chalk.green("exit")}: exit program.`,
});
