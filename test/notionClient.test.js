import { jest } from "@jest/globals";

// Mock Notion Client
const mockClientConstructor = jest.fn();
jest.mock("@notionhq/client", () => ({
  Client: mockClientConstructor,
}));

// two references to notionClient to check singleton behaviour
let notionClient1;
let notionClient2;

beforeAll(async () => {
  // import singleton twice
  jest.resetModules();

  import("../src/utils/notionClient").then(({ notionClient }) => {
    notionClient1 = notionClient;
  });

  import("../src/utils/notionClient").then(({ notionClient }) => {
    notionClient2 = notionClient;
  });
});

describe("notionClient Singleton Behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create only one instance of Client", () => {
    // constructor called once
    expect(mockClientConstructor).toHaveBeenCalledTimes(1);

    // singleton instance
    expect(notionClient1).toBe(notionClient2);
  });

  it("should create call Notion Client to create instance", () => {
    // check that they called Notion Client constructor (mocked version)
    expect(notionClient1).toBeInstanceOf(mockClientConstructor);
    expect(notionClient2).toBeInstanceOf(mockClientConstructor);
  });
});
