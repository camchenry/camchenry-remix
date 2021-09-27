import fs from "../fs";
import path from "../path";
import { notNullOrUndefined } from "./posts";

/**
 * Returns a list of tool names (ID only).
 */
export async function getTools(): Promise<string[]> {
  const toolsPath = path.join(__dirname, "../../app/routes/tools");
  const entries = fs.readdirSync(toolsPath);
  const tools = entries.filter((entry) =>
    fs.statSync(path.join(toolsPath, entry)).isDirectory()
  );
  const filtered = tools.filter(notNullOrUndefined);
  return filtered;
}
