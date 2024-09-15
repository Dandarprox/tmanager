import { faFile, faFileExcel, faFileText, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { FileTreeFile } from "./file-tree";

export const FileExtensionMapping = {
  'doc': faFileWord,
  'docx': faFileWord,
  'pdf': faFileWord,
  'txt': faFileText,
  'xlsx': faFileExcel,
  '_file': faFile,
}

export function getIconForFile<
  Key extends keyof typeof FileExtensionMapping = keyof typeof FileExtensionMapping
>(file: FileTreeFile): (typeof FileExtensionMapping)[Key] {
  const extension  = file.name.split('.').pop() as Key;
  const icon = FileExtensionMapping[extension];

  return icon || faFile;
}