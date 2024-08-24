import { notionClient, databaseId } from "../utils/notionClient.js";
import { buildProperties } from "../utils/requestFormatter.js";
import { DatabaseSchema } from "../utils/enum.js";

/**
 * Creates a new entry in the Notion Database representing a message from a given
 * sender, and recipient.
 *
 * @param {string} sender the sender of the message
 * @param {string} recipient the recipient of the message
 * @param {string} message the message
 * @returns {boolean} `true` if page was successfully deleted, `false` if not
 */
export default async function sendCommand(sender, recipient, message) {
  try {
    await notionClient.pages.create({
      parent: { database_id: databaseId },
      properties: buildProperties({
        [DatabaseSchema.SENDER_COLUMN]: sender,
        [DatabaseSchema.RECIPIENT_COLUMN]: recipient,
        [DatabaseSchema.MESSAGE_COLUMN]: message,
      }),
    });
    return true;
  } catch (error) {
    if (error.response) {
      // error response from the API
      console.error("Error:", error.response.data);
      console.error("Status Code:", error.response.status);
    } else if (error.request) {
      // no response received from the API
      console.error("No response received", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return false;
  }
}
