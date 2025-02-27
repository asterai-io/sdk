import { Args, Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const SOURCE_DIR_TYPESCRIPT = path.join(__dirname, "../../init/typescript");
const SOURCE_DIR_RUST = path.join(__dirname, "../../init/rust");

export type InitFlags = {
  rust?: boolean;
  typescript?: boolean;
};

export default class Codegen extends Command {
  static args = {
    outDir: Args.string({
      default: "plugin",
    }),
  };

  static description = "Initialise a new plugin project";

  static examples = [`<%= config.bin %> <%= command.id %> project-name`];

  static flags = {
    typescript: Flags.boolean({
      default: undefined,
      description: "init a the plugin project in typescript",
    }),
    rust: Flags.boolean({
      default: false,
      description: "init a the plugin project in rust",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Codegen);
    assertOneLanguageFlag([flags.typescript, flags.rust]);
    const outDir = path.resolve(args.outDir);
    const sourceDir = getSourceDirByFlag(flags);
    fs.cpSync(sourceDir, outDir, { recursive: true });
  }
}

const assertOneLanguageFlag = (flags: boolean[]) => {
  const undefinedCount = flags.reduce(
    (acc, curr) => (curr === undefined ? acc + 1 : acc),
    0,
  );
  const trueCount = flags.reduce((acc, curr) => (curr ? acc + 1 : acc), 0);
  if (trueCount === 0 && undefinedCount !== 1) {
    throw new Error("one language flag must be set");
  }
  if (trueCount > 1) {
    throw new Error("only one language flag can be set");
  }
};

const getSourceDirByFlag = (flags: InitFlags): string => {
  if (flags.rust) {
    return SOURCE_DIR_RUST;
  }
  // Typescript is the default option.
  if (flags.typescript === true || flags.typescript === undefined) {
    return SOURCE_DIR_TYPESCRIPT;
  }
  throw new Error("Invalid flags configuration.");
};
