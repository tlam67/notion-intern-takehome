import { jest } from "@jest/globals";
import getCommand, {
  getSender,
  getMessage,
  getRecipient,
  validationFunction,
  promptInputClean,
  cleanInput,
} from "../src/utils/prompt.js";
import { CommandPrompts, MainCommands } from "../src/utils/enum.js";

describe("Prompt Functions", () => {
  let inputMock;
  beforeEach(() => {
    // mock input function for dependency injection before tests
    inputMock = jest.fn();
  });

  describe("getCommand", () => {
    it("Valid command", async () => {
      // mock input
      const mockInput = "  ReAd  ";
      const invalidCommand = CommandPrompts.INVALID_COMMAND;
      const validCommand = cleanInput(mockInput);

      // get result of validating the input
      const mockInputResponse =
        validationFunction(mockInput) === true ? mockInput : invalidCommand;
      inputMock.mockResolvedValue(mockInputResponse);

      // simulate the command and verify results
      const result = await getCommand(inputMock);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_COMMAND,
        validate: validationFunction,
      });
      expect(result).toBe(validCommand);
    });

    it("Invalid command", async () => {
      // we clean the invalid command because cleaning will be applied when we mock
      // the @inquirer/prompts input. This is expected and won't happen in the actual
      // execution because inquirer will simply output the invalid message if validation
      // function fails
      const mockInput = "  InValiD CommAnd  ";
      const invalidCommand = cleanInput(CommandPrompts.INVALID_COMMAND);

      // get result of validating the input
      const mockInputResponse =
        validationFunction(mockInput) === true ? mockInput : invalidCommand;
      inputMock.mockResolvedValue(mockInputResponse);

      const result = await getCommand(inputMock);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_COMMAND,
        validate: validationFunction,
      });
      expect(result).toBe(invalidCommand);
    });
  });

  describe("getSender", () => {
    it("No whitespace no caps", async () => {
      const mockAnswer = "tristan";
      const expected = cleanInput(mockAnswer);
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getSender(inputMock);
      expect(result).toBe(expected);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_SENDER,
        validate: expect.any(Function),
      });
    });

    it("Capitalized", async () => {
      const mockAnswer = "TrIsTAn";
      const expected = cleanInput(mockAnswer);
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getSender(inputMock);
      expect(result).toBe(expected);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_SENDER,
        validate: expect.any(Function),
      });
    });

    it("Capitalized and whitespace", async () => {
      const mockAnswer = "  TrI  sTAn     ";
      const expected = cleanInput(mockAnswer);
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getSender(inputMock);
      expect(result).toBe(expected);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_SENDER,
        validate: expect.any(Function),
      });
    });
  });

  describe("getRecipient", () => {
    it("No whitespace no caps", async () => {
      const mockAnswer = "hank";
      const expected = cleanInput(mockAnswer);
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getRecipient(inputMock);
      expect(result).toBe(expected);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_RECIPIENT,
        validate: expect.any(Function),
      });
    });

    it("Capitalized", async () => {
      const mockAnswer = "hAnK";
      const expected = cleanInput(mockAnswer);
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getRecipient(inputMock);
      expect(result).toBe(expected);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_RECIPIENT,
        validate: expect.any(Function),
      });
    });

    it("Capitalized and whitespace", async () => {
      const mockAnswer = "  hAn  K     ";
      const expected = cleanInput(mockAnswer);
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getRecipient(inputMock);
      expect(result).toBe(expected);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_RECIPIENT,
        validate: expect.any(Function),
      });
    });
  });

  describe("getMessage", () => {
    it("Standard message", async () => {
      const mockAnswer = "im a cool guy i swear :)";
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getMessage(inputMock);
      expect(result).toBe(mockAnswer);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_MESSAGE,
      });
    });

    it("Leading and trailing whitespace", async () => {
      const mockAnswer = "  ooohhhh im a ghossttt  ";
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getMessage(inputMock);
      expect(result).toBe(mockAnswer);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_MESSAGE,
      });
    });

    it("Empty message", async () => {
      const mockAnswer = "   ";
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getMessage(inputMock);
      expect(result).toBe(mockAnswer);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_MESSAGE,
      });
    });

    it("Special characters", async () => {
      const mockAnswer = "~!!@#@#$%@^&$(^&*)_+P{}:?><'';/.][=-0123456789";
      inputMock.mockResolvedValue(mockAnswer);

      const result = await getMessage(inputMock);
      expect(result).toBe(mockAnswer);
      expect(inputMock).toHaveBeenCalledWith({
        message: CommandPrompts.GET_MESSAGE,
      });
    });
  });

  describe("validationFunction", () => {
    it("Valid command", () => {
      const answer = MainCommands.EXIT_COMMAND;
      const expected = true;

      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });

    it("Valid comand with whitespace", () => {
      const answer = "  " + MainCommands.EXIT_COMMAND;
      const expected = true;

      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });

    it("Valid command with whitespace and caps", () => {
      // example: "  exIT  " cleaned to "exit" which is validated
      const command = MainCommands.EXIT_COMMAND;
      const middleIndex = Math.floor(command.length / 2);
      const firstHalf = command.slice(0, middleIndex);
      const secondHalf = command.slice(middleIndex);
      const answer = "  " + firstHalf + secondHalf.toUpperCase() + "  ";
      const expected = true;

      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });

    it("Invalid command", () => {
      const command = MainCommands.EXIT_COMMAND;
      const answer = "INVALID" + command;

      const expected = CommandPrompts.INVALID_COMMAND;
      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });

    it("Invalid command with whitespace and caps", () => {
      // example: "  ex  IT  " cleaned to "exit" which is validated
      const command = MainCommands.EXIT_COMMAND;
      const middleIndex = Math.floor(command.length / 2);
      const firstHalf = command.slice(0, middleIndex);
      const secondHalf = command.slice(middleIndex);
      const answer = "  " + firstHalf + "  " + secondHalf.toUpperCase() + "  ";

      // no need to clean, happens higher on the call stack after validation returns
      const expected = CommandPrompts.INVALID_COMMAND;

      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });

    it("Empty command", () => {
      const answer = "";
      const expected = CommandPrompts.INVALID_COMMAND;
      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });

    it("Whitespace only", () => {
      const answer = "          ";
      const expected = CommandPrompts.INVALID_COMMAND;
      const result = validationFunction(answer);
      expect(result).toBe(expected);
    });
  });

  describe("cleanInput", () => {
    it("Clean leading/trailing whitespace and capitals", () => {
      const input = "  Hello World!  ";
      const expected = "hello world!";

      const result = cleanInput(input);

      expect(result).toBe(expected);
    });

    it("Input that is already clean", () => {
      const input = "already clean";
      const expected = input;

      const result = cleanInput(input);

      expect(result).toBe(expected);
    });

    it("Mixed capitlization", () => {
      const input = "MiXed CaSe InPut";
      const expected = "mixed case input";

      const result = cleanInput(input);

      expect(result).toBe(expected);
    });

    it("Whitespace only", () => {
      const input = "   ";
      const expected = "";

      const result = cleanInput(input);

      expect(result).toBe(expected);
    });

    it("Empty input", () => {
      const input = "";
      const expected = "";

      const result = cleanInput(input);

      expect(result).toBe(expected);
    });
  });

  describe("promptInputClean", () => {
    it("Validation passes", async () => {
      const rawInput = "  Test Input  ";
      const expected = "test input";
      const message = CommandPrompts.GET_SENDER;
      const mockResponse = Promise.resolve(rawInput);
      inputMock.mockReturnValue(mockResponse);

      const result = await promptInputClean(inputMock, message);

      expect(inputMock).toHaveBeenCalledWith({
        message: message,
        validate: expect.any(Function),
      });
      expect(result).toBe(expected);
    });

    it("Validation passes and cleans", async () => {
      const rawInput = "Valid Input";
      const expected = "valid input";
      const message = CommandPrompts.GET_SENDER;
      const mockResponse = Promise.resolve(rawInput);
      inputMock.mockReturnValue(mockResponse);

      const customValidate = (input) => true;

      const result = await promptInputClean(
        inputMock,
        message,
        customValidate
      );

      expect(inputMock).toHaveBeenCalledWith({
        message: message,
        validate: customValidate,
      });
      expect(result).toBe(expected);
    });
  });
});
