import { notionClient } from "../utils/notionClient.js";

/**
 * Deletes a message from the Notion database.
 *
 * @param {string} messageId the Notion page ID representing the message in the database to delete
 * @returns {boolean} `true` if page was successfully deleted, `false` if not
 */
export default async function deleteCommand(messageId) {
  try {
    await notionClient.pages.update({
      page_id: messageId,
      archived: true,
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
