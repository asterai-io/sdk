import { Args, Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { BASE_API_URL } from "../const.js";
import axios from "axios";
import FormData from "form-data";
import { getConfigValue } from "../config.js";

export type PkgArgs = {
  input: string;
};

export type PkgFlags = {
  endpoint: string;
  output: string;
};

export type PkgOutput = {
  outputFile: string;
  witPath: string;
};

export default class Pkg extends Command {
  static args = {
    input: Args.string({
      default: "package.wit",
      description: "path to the WIT file",
    }),
  };

  static flags = {
    output: Flags.string({
      char: "o",
      default: "package.wasm",
      description: "output file name for the binary WASM package",
    }),
    endpoint: Flags.string({
      char: "e",
      default: BASE_API_URL,
    }),
  };

  static description = "bundles the WIT into a binary WASM package";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Pkg);
    await pkg(args, flags);
  }
}

export const pkg = async (
  args: PkgArgs,
  flags: PkgFlags,
): Promise<PkgOutput> => {
  const witPath = path.resolve(args.input);
  if (!fsSync.existsSync(witPath)) {
    throw new Error(`WIT file not found at ${witPath}`);
  }
  const baseDir = path.dirname(witPath);
  const outputFile = path.join(baseDir, flags.output);
  const form = new FormData();
  form.append("package.wit", await fs.readFile(witPath));
  const response = await axios({
    url: `${flags.endpoint}/v1/pkg`,
    method: "post",
    data: form,
    headers: {
      Authorization: getConfigValue("key"),
      ...form.getHeaders(),
    },
    responseType: "arraybuffer",
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error("request failed");
  }
  await fs.writeFile(outputFile, Buffer.from(response.data), {
    encoding: "binary",
  });
  return {
    outputFile,
    witPath,
  };
};
