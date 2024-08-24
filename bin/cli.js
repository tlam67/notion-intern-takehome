#!/usr/bin/env node

import { program } from "commander";
import commandHandler from "../src/utils/commandHandler.js";
import getCommand from "../src/utils/prompt.js";
import { UserMessages } from "../src/utils/enum.js";
import { input, select } from "@inquirer/prompts";

program.version("1.0.0").description("Mail App CLI");

/**
 * Entry point for the program
 */
async function main() {
  // display welcome and command options
  console.log(UserMessages.WELCOME);
  console.log(UserMessages.HELP);

  // program loop - get commands until exit
  let hasExited = false;
  while (!hasExited) {
    const command = await getCommand(input);

    hasExited = await commandHandler(input, select, command);
  }
}

// shouldn't need to await, but better to be safe
await main();
