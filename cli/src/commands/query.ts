import { Flags, Command } from "@oclif/core";
import readline from "node:readline";
import { AsteraiClient, QueryArgs } from "@asterai/client";
import { v4 as uuidv4 } from "uuid";

const ANSI_COLORS = {
  reset: "\x1b[0m",
  bold: "\u001b[1m",
};

const USER_PREFIX = `${ANSI_COLORS.bold}user: ${ANSI_COLORS.reset}`;
const ASSISTANT_PREFIX = `${ANSI_COLORS.bold}assistant: ${ANSI_COLORS.reset}`;

export default class Query extends Command {
  static args = {};

  static description = "query an asterai app interactively";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    app: Flags.string({
      char: "a",
      required: true,
    }),
    key: Flags.string({
      char: "k",
      required: true,
      description: "app query key",
    }),
  };

  async run(): Promise<void> {
    console.clear();
    const { flags } = await this.parse(Query);
    let output = "";
    const addToOutput = (v: string) => {
      output += v;
    };
    const client = new AsteraiClient({
      appId: flags.app,
      queryKey: flags.key,
    });
    const conversationId = uuidv4();
    // Configure STDIN for when raw mode is enabled.
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", key => {
      if (key.toString() === "\u0003") {
        process.stdout.write("\n");
        process.exit();
      }
    });
    const getUserInput = async () => {
      addToOutput(USER_PREFIX);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const input: string = await new Promise(resolve =>
        rl.question(USER_PREFIX, i => resolve(i)),
      );
      rl.close();
      // Enable raw mode to prevent STDIN from echoing in STDOUT.
      process.stdin.setRawMode(true);
      addToOutput(`${input}\r\n${ASSISTANT_PREFIX}`);
      console.clear();
      process.stdout.write(output);
      const query: QueryArgs = {
        query: input,
        conversationId,
      };
      const response = await client.query(query);
      response.onToken(token => {
        addToOutput(token);
        process.stdout.write(token);
      });
      return new Promise(resolve => {
        response.onEnd(() => {
          addToOutput("\n");
          process.stdout.write("\n");
          // Disable raw mode to prepare for next user input.
          process.stdin.setRawMode(false);
          resolve(undefined);
        });
      });
    };
    while (true) {
      await getUserInput();
    }
  }
}
