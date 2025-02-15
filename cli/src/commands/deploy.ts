import { Command, Flags } from "@oclif/core";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { getConfigValue } from "../config.js";
import { BASE_API_URL, BASE_API_URL_STAGING } from "../const.js";

type DeployFlags = {
  plugin: string;
  pkg: string;
  app?: string;
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
    app: Flags.string({
      char: "a",
      description: "app ID to immediately configure this plugin with",
      required: false,
    }),
    manifest: Flags.string({
      char: "m",
      description: "manifest path",
      default: "plugin.asterai.proto",
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
  if (flags.app) {
    form.append("app_id", flags.app);
  }
  form.append("plugin.wasm", fs.readFileSync(flags.plugin));
  form.append("package.wasm", fs.readFileSync(flags.pkg));
  const baseApiUrl = flags.staging ? BASE_API_URL_STAGING : flags.endpoint;
  await axios({
    url: `${baseApiUrl}/app/plugin`,
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
