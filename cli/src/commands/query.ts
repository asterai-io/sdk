import { Flags, Command } from "@oclif/core";
import readline from "node:readline";
import { AsteraiClient, QueryArgs } from "@asterai/client";
import { v4 as uuidv4 } from "uuid";

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
    const getUserInput = async () => {
      addToOutput("user: ");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const input: string = await new Promise(resolve =>
        rl.question("user: ", i => resolve(i)),
      );
      rl.close();
      addToOutput(`${input}\r\nassistant: `);
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
          resolve(undefined);
        });
      });
    };
    while (true) {
      await getUserInput();
    }
  }
}
