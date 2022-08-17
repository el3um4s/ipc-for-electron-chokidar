/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPC, SendChannels } from "@el3um4s/ipc-for-electron";
import { BrowserWindow } from "electron";
import Chokidar = require("chokidar");

import { toTry } from "@el3um4s/to-try";

import {
  NameAPI,
  WatchFolderMessage,
  WatchFileMessage,
  Changed,
} from "./interfaces";

const nameAPI: NameAPI = "chokidar";

// to Main
const validSendChannel: SendChannels = {
  watchFolder: watchFolder,
  watchFile: watchFile,
};

// from Main
const validReceiveChannel: string[] = ["folderChanged", "fileChanged"];

const chokidar = new IPC({
  nameAPI,
  validSendChannel,
  validReceiveChannel,
});

export default chokidar;

const sendMessage = (
  watcher: Chokidar.FSWatcher,
  mainWindow: BrowserWindow,
  nameMessage: string,
  message: Changed
) => {
  const [ok, ko] = toTry(() =>
    mainWindow.webContents.send(nameMessage, message)
  );
  if (ko) {
    watcher.close();
  }
};

async function watchFolder(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: WatchFolderMessage
) {
  const { folderPath, nameWatcher } = message;
  const watcher = Chokidar.watch(folderPath, {
    // eslint-disable-next-line no-useless-escape
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    ignoreInitial: true,
  });

  watcher
    .on("add", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "add",
        nameWatcher,
      })
    )
    .on("change", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "change",
        nameWatcher,
      })
    )
    .on("unlink", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "unlink",
        nameWatcher,
      })
    )
    .on("addDir", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "addDir",
        nameWatcher,
      })
    )
    .on("unlinkDir", (path) =>
      sendMessage(watcher, mainWindow, "folderChanged", {
        path,
        eventName: "unlinkDir",
        nameWatcher,
      })
    );
}

function watchFile(
  mainWindow: BrowserWindow,
  event: Electron.IpcMainEvent,
  message: WatchFileMessage
) {
  const { filePath, nameWatcher } = message;
  const watcher = Chokidar.watch(filePath, { ignoreInitial: true });

  watcher
    .on("add", (path) =>
      sendMessage(watcher, mainWindow, "fileChanged", {
        path,
        eventName: "add",
        nameWatcher,
      })
    )
    .on("change", (path) =>
      sendMessage(watcher, mainWindow, "fileChanged", {
        path,
        eventName: "change",
        nameWatcher,
      })
    )
    .on("unlink", (path) =>
      sendMessage(watcher, mainWindow, "fileChanged", {
        path,
        eventName: "unlink",
        nameWatcher,
      })
    );
}
