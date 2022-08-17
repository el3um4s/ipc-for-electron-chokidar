export type NameAPI = "chokidar";
export type DefaultApiKey = "ipc";

export interface WatchFolderMessage {
  folderPath: string;
  nameWatcher: string;
}

export interface WatchFileMessage {
  filePath: string;
  nameWatcher: string;
}
