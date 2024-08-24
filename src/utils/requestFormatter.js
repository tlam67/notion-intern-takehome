import { DatabaseSchema } from "./enum.js";

/**
 * Builds the properties object for a Notion API request based on the provided data
 *
 * @param {Object.<string, string>} data - An object containing the data for each property
 * @param {string} [data.sender] - The sender's name (optional)
 * @param {string} [data.recipient] - The recipient's name (optional)
 * @param {string} [data.message] - The message content (optional)
 * @returns {Object} The formatted properties object for the Notion API request
 */
export function buildProperties(data) {
  const properties = {};

  for (const key of Object.keys(DatabaseSchema)) {
    // check if the schema is properly defined
    if (
      key.endsWith("COLUMN") &&
      key.replace("COLUMN", "COLUMN_TYPE") in DatabaseSchema
    ) {
      const column = DatabaseSchema[key];
      const type = DatabaseSchema[key.replace("COLUMN", "COLUMN_TYPE")];

      // Only add the property if the data for it is provided
      if (data[column]) {
        properties[column] = {
          [type]: [{ text: { content: data[column] } }],
        };
      }
    }
  }

  return properties;
}

/**
 * Builds a single filter object for a Notion database query request.
 *
 * @param {string} property - The property name to filter on
 * @param {string} operator - The operator to use (e.g., 'equals', 'contains', 'greater_than')
 * @param {string|number} value - The value to filter against
 * @returns {Object} The single filter object for the Notion database query request.
 * @todo support multiple filters
 */
export function buildFilter(property, operator, value) {
  return {
    property: property,
    rich_text: {
      [operator]: value,
    },
  };
}
