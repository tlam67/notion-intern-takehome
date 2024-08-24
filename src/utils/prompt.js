import { MainCommands, CommandPrompts } from "./enum.js";

// use dependency injection for better testing. We are injecting input from @inquirer/prompts during normal execution

/***********************************
 * PUBLIC METHODS
 **********************************/

/**
 * Prompts the user for a command. Valid commands are defined in {@link MainCommands}
 *
 * @param {Function} inputFunction - function to prompt for input
 * @returns {Promise<string>} a `Promise` that resolves to a `string` representing the cleaned, validated input
 */
export default async function getCommand(inputFunction) {
  return await promptInputClean(inputFunction, CommandPrompts.GET_COMMAND, validationFunction);
}

/**
 * Prompts the user for the sender of a message.
 *
 * @param {Function} inputFunction - function to prompt for input
 * @returns {Promise<string>} a `Promise` that resolves to a `string` representing the cleaned input
 */
export async function getSender(inputFunction) {
  return await promptInputClean(inputFunction, CommandPrompts.GET_SENDER);
}

/**
 * Prompts the user for the recipient of a message.
 *
 * @param {Function} inputFunction - function to prompt for input
 * @returns {Promise<string>} a `Promise` that resolves to a `string` representing the cleaned input
 */
export async function getRecipient(inputFunction) {
  return await promptInputClean(inputFunction, CommandPrompts.GET_RECIPIENT);
}

/**
 * Prompts the user for a message. Input is not cleaned.
 *
 * @param {Function} inputFunction - function to prompt for input
 * @returns {Promise<string>} a `Promise` that resolves to a `string` representing the input
 * @todo support multiline messages
 */
export async function getMessage(inputFunction) {
  // don't clean the message
  return await inputFunction({
    message: CommandPrompts.GET_MESSAGE,
  });
}

/***********************************
 * PRIVATE METHODS
 **********************************/

/**
 * Validates that the command entered belongs to one of the commands defined in {@link MainCommands}
 *
 * Visible for testing
 * 
 * @param {string} answer input to validate
 * @returns {boolean | string} `true` if the input is valid and an error message if it is invalid
 */
export const validationFunction = (answer) => {
  if (Object.values(MainCommands).includes(cleanInput(answer))) {
    return true;
  }
  return CommandPrompts.INVALID_COMMAND;
};

/**
 * Prompts the user for input by displaying the given message and validating the input using the
 * given validation function. If no validation function is given all input is accepted.
 * 
 * Visible for testing
 *
 * @param {Function} inputFunction - function to prompt for input
 * @param {string} message the message to prompt the user
 * @param {Function} [validate] function accepting a single `string` argument and returning a `boolean` whether the input is valid
 * @returns {string} the cleaned and validated input
 */
export async function promptInputClean(
  inputFunction,
  message,
  validate = (ans) => {
    return true;
  }
) {
  return await inputFunction({
    message: message,
    validate: validate,
  }).then((answer) => cleanInput(answer));
}

/**
 * Cleans the input string by trimming whitespace and converting to lowercase.
 *
 * Visible for testing
 * 
 * @param {string} input the string to clean
 * @returns {string} cleaned version of the string
 */
export function cleanInput(input) {
  return input.trim().toLowerCase();
}
