import { Args, Command } from "@oclif/core";
import path from "path";
import fs from "fs";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const SOURCE_DIR = path.join(__dirname, "../../init/typescript");

export default class Codegen extends Command {
  static args = {
    outDir: Args.string({
      default: "plugin",
    }),
  };

  static description = "Initialise a new plugin project";

  static examples = [`<%= config.bin %> <%= command.id %> project-name`];

  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(Codegen);
    const outDir = path.resolve(args.outDir);
    fs.cpSync(SOURCE_DIR, outDir, { recursive: true });
  }
}
