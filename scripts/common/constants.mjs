import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const serverlessDir = "serverless-functions";
export const serverlessSrc = `${serverlessDir}/src`;
export const flexConfigDir = "flex-config";
export const futureCCAppDir = "web-app-examples/twilio-future-cc-widget";
export const gitHubWorkflowDir = ".github/workflows";
export const defaultPluginDir = "flex-template-future-cc-demo";

const mappingDefinitionPath = "../config/mappings.json";
export const varNameMapping = JSON.parse(
  fs.readFileSync(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      mappingDefinitionPath
    )
  )
);
