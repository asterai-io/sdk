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
  wit?: string;
};

export type PkgOutput = {
  outputFile: string;
  witPath: string;
};

export default class Pkg extends Command {
  static args = {
    input: Args.string({
      default: "plugin.wit",
      description: "path to the plugin's WIT file",
    }),
  };

  static flags = {
    output: Flags.string({
      char: "o",
      default: "package.wasm",
      description: "output file name for the binary WASM package",
    }),
    wit: Flags.string({
      char: "w",
      default: "package.wit",
      description: "output package converted to the WIT format",
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
  }).catch(catchAxiosError);
  validateResponseStatus(response.status);
  await fs.writeFile(outputFile, Buffer.from(response.data), {
    encoding: "binary",
  });
  if (flags.wit) {
    await wasm2wit(flags.endpoint, outputFile, path.join(baseDir, flags.wit));
  }
  return {
    outputFile,
    witPath,
  };
};

const wasm2wit = async (
  endpoint: string,
  inputFilePath: string,
  outputFilePath: string,
) => {
  const form = new FormData();
  form.append("package.wasm", await fs.readFile(inputFilePath));
  const response = await axios({
    url: `${endpoint}/v1/wasm2wit`,
    method: "post",
    data: form,
    headers: {
      Authorization: getConfigValue("key"),
      ...form.getHeaders(),
    },
    responseType: "text",
  });
  validateResponseStatus(response.status);
  await fs.writeFile(outputFilePath, response.data, { encoding: "utf8" });
};

const validateResponseStatus = (status: number): void => {
  if (status < 200 || status >= 300) {
    throw new Error("request failed");
  }
};

const catchAxiosError = (error: any) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorMessage = error.response.data.toString().replace(/\\n/g, "\n");
    throw new Error(`Request failed: ${errorMessage}`);
  }
  throw new Error("Request failed");
};
