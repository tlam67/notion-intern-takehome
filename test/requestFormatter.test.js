import { buildProperties, buildFilter } from "../src/utils/requestFormatter";
import { DatabaseSchema } from "../src/utils/enum";

describe("requestFormatter", () => {
  describe("buildProperties", () => {
    it("builds correctly formatted Notion query property argument", () => {
      const data = {
        Sender: "hank",
        Recipient: "tristan",
        Message: "come work at notion trust me bro",
      };

      // correctly built object
      const expectedProperties = {
        [DatabaseSchema.SENDER_COLUMN]: {
          [DatabaseSchema.SENDER_COLUMN_TYPE]: [
            { text: { content: data.Sender } },
          ],
        },
        [DatabaseSchema.RECIPIENT_COLUMN]: {
          [DatabaseSchema.RECIPIENT_COLUMN_TYPE]: [
            { text: { content: data.Recipient } },
          ],
        },
        [DatabaseSchema.MESSAGE_COLUMN]: {
          [DatabaseSchema.MESSAGE_COLUMN_TYPE]: [
            { text: { content: data.Message } },
          ],
        },
      };

      expect(buildProperties(data)).toEqual(expectedProperties);
    });

    it("builds only the given properties", () => {
      const data = {
        Sender: "Alice",
        // recipient missing
        // message missing
      };

      // correctly built object
      const expectedProperties = {
        [DatabaseSchema.SENDER_COLUMN]: {
          [DatabaseSchema.SENDER_COLUMN_TYPE]: [
            { text: { content: data.Sender } },
          ],
        },
      };

      expect(buildProperties(data)).toEqual(expectedProperties);
    });

    it("builds empty object on no input", () => {
      const data = {};

      // empty object
      const expectedProperties = {};

      expect(buildProperties(data)).toEqual(expectedProperties);
    });
  });

  describe("buildFilter", () => {
    it("builds correctly formatted Notion query property argument", () => {
      const property = "Message";
      const operator = "does_not_equal";
      const value = "google docs > microsoft word > notion"; // note that we ignore these messages

      const expectedFilter = {
        property: property,
        rich_text: {
          [operator]: value,
        },
      };

      expect(buildFilter(property, operator, value)).toEqual(expectedFilter);
    });

    it("builds with different property, operator, and value values", () => {
      const property = "Sender";
      const operator = "equals";
      const value = "Hank";

      const expectedFilter = {
        property: property,
        rich_text: {
          [operator]: value,
        },
      };

      expect(buildFilter(property, operator, value)).toEqual(expectedFilter);
    });

    it("builds with numerical data correctly", () => {
      const currentNotionEngineers = 250;
      const property = "notionEngineers";
      const operator = "greater_than_or_equal_to";
      const value = currentNotionEngineers + 1; // thats me

      const expectedFilter = {
        property: property,
        rich_text: {
          [operator]: value,
        },
      };

      expect(buildFilter(property, operator, value)).toEqual(expectedFilter);
    });
  });
});
