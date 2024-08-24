import { notionClient, databaseId } from "../utils/notionClient.js";
import { DatabaseSchema, NotionApiConstants } from "../utils/enum.js";
import { buildFilter } from "../utils/requestFormatter.js";

/**
 * Sends a database query to the Notion Database API to fetch messages for the
 * given recipient. Returns paginated results, to get more this function must be
 * called again with the correct start cursor.
 *
 * @param {string} recipient the recipient to filter messages by
 * @param {string | undefined} startCursor the cursor to start the query results from
 * @returns {QueryDatabaseResponse | null} `QueryDatabaseResponse` the query result or `null` if there is an error
 * @see {@link NotionApiConstants} for API configs like page size
 */
export default async function readCommand(recipient, startCursor = undefined) {
  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      filter: buildFilter(DatabaseSchema.RECIPIENT_COLUMN, "equals", recipient),
      page_size: NotionApiConstants.PAGE_SIZE,
    });

    return response;
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
    return null;
  }
}
