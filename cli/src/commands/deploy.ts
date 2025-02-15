import { Command, Flags } from "@oclif/core";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import { getConfigValue } from "../config.js";

const PRODUCTION_ENDPOINT = "https://api.asterai.io/app/plugin";
const STAGING_ENDPOINT = "https://staging.api.asterai.io/app/plugin";

type DeployFlags = {
  plugin: string;
  pkg: string;
  app: string;
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
      required: true,
    }),
    manifest: Flags.string({
      char: "m",
      description: "manifest path",
      default: "plugin.asterai.proto",
    }),
    endpoint: Flags.string({
      char: "e",
      default: PRODUCTION_ENDPOINT,
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
  form.append("app_id", flags.app);
  form.append("plugin.wasm", fs.readFileSync(flags.plugin));
  form.append("package.wasm", fs.readFileSync(flags.pkg));
  const url = flags.staging ? STAGING_ENDPOINT : flags.endpoint;
  await axios({
    url,
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

export const mergeProtoImports = (
  proto: string,
  protoPath: string,
  excludeSdk = true,
  excludeSyntaxDefinition = true,
  n = 0,
): string => {
  let mergedManifestString = "";
  const lines = proto.split("\n");
  for (let line of lines) {
    line = line.trim();
    const isSyntaxLine = line.startsWith("syntax");
    if (isSyntaxLine && (excludeSyntaxDefinition || n > 1)) {
      continue;
    }
    const isImportLine = line.startsWith("import");
    if (!isImportLine) {
      mergedManifestString = `${mergedManifestString}\n${line}`;
      continue;
    }
    const importLine = line.replaceAll("'", '"');
    const pathStart = importLine.indexOf('"') + 1;
    const pathEnd = importLine.lastIndexOf('"');
    const pathRelative = importLine.substring(pathStart, pathEnd);
    const isSdkImport = pathRelative.startsWith("node_modules/@asterai/sdk");
    if (isSdkImport && excludeSdk) {
      // Asterai protobuf definitions should not be uploaded
      // as part of the plugin manifest.
      continue;
    }
    const pathAbsolute = path.join(path.dirname(protoPath), pathRelative);
    const importProto = fs.readFileSync(pathAbsolute, { encoding: "utf8" });
    const importProtoMerged = mergeProtoImports(
      importProto,
      pathAbsolute,
      excludeSdk,
      excludeSyntaxDefinition,
      n + 1,
    );
    mergedManifestString = `${mergedManifestString}\n${importProtoMerged}`;
  }
  return mergedManifestString.trim();
};

const logRequestError = (e: any) => {
  const info = e.response?.data ?? e;
  console.log("request error:", info);
};
