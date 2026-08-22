import { readFile, writeFile } from "ags/file";
import GLib from "gi://GLib";

export function readJSONFile(filePath: string): unknown {
  const data = readFile(filePath);
  if (!data || !data.trim()) return {};
  return JSON.parse(data);
}

export function writeJSONFile(filePath: string, data: unknown) {
  const dir = filePath.substring(0, filePath.lastIndexOf("/"));
  GLib.mkdir_with_parents(dir, 0o755);
  writeFile(filePath, JSON.stringify(data, null, 4));
}