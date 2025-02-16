import { Command, Flags } from "@oclif/core";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { getConfigValue } from "../config.js";
import { BASE_API_URL, BASE_API_URL_STAGING } from "../const.js";
import path from "path";

// If the input file doesn't exist, try looking into this dir.
const RETRY_FIND_FILE_DIR = "build/";

type DeployFlags = {
  plugin: string;
  pkg: string;
  agent?: string;
  endpoint: string;
  staging: boolean;
};

export default class Deploy extends Command {
  static args = {};

  static description = "uploads a plugin to asterai";

  static examples = [
    `<%= config.bin %> <%= command.id %> --app 66a46b12-b1a7-4b72-a64a-0e4fe21902b6`,
  ];

  static flags = {
    agent: Flags.string({
      char: "a",
      description: "agent ID to immediately activate this plugin for",
      required: false,
    }),
    endpoint: Flags.string({
      char: "e",
      default: BASE_API_URL,
    }),
    staging: Flags.boolean({
      char: "s",
    }),
    plugin: Flags.string({
      description: "plugin WASM path",
      default: "plugin.wasm",
    }),
    pkg: Flags.string({
      description: "package WASM path",
      default: "package.wasm",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Deploy);
    await deploy(flags);
  }
}

const deploy = async (flags: DeployFlags) => {
  const form = new FormData();
  if (flags.agent) {
    form.append("agent_id", flags.agent);
  }
  const plugin = readFile(flags.plugin);
  const pkg = readFile(flags.pkg);
  form.append("plugin.wasm", plugin);
  form.append("package.wasm", pkg);
  const baseApiUrl = flags.staging ? BASE_API_URL_STAGING : flags.endpoint;
  await axios({
    url: `${baseApiUrl}/v1/plugin`,
    method: "put",
    data: form,
    headers: {
      Authorization: getConfigValue("key"),
      ...form.getHeaders(),
    },
  })
    .then(() => console.log("done"))
    .catch(logRequestError);
};

const logRequestError = (e: any) => {
  const info = e.response?.data ?? e;
  console.log("request error:", info);
};

const readFile = (relativePath: string): Buffer => {
  if (fs.existsSync(relativePath)) {
    return fs.readFileSync(relativePath);
  }
  const retryPath = path.join(RETRY_FIND_FILE_DIR, relativePath);
  if (fs.existsSync(retryPath)) {
    return fs.readFileSync(retryPath);
  }
  throw new Error(`file not found: ${relativePath}`);
};
