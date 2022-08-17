import { NameAPI, DefaultApiKey, Changed } from "./interfaces";

const nameAPI: NameAPI = "chokidar";
const defaultApiKey: DefaultApiKey = "ipc";

const folderChanged = async (options: {
  callback?: (arg0: Changed) => void;
  apiKey?: string;
}): Promise<Changed> => {
  const { callback } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("folderChanged", (data: Changed) => {
      const { path, eventName, nameWatcher } = data;
      if (callback) {
        callback({ path, eventName, nameWatcher });
      }
      resolve({ path, eventName, nameWatcher });
    });
  });
};

const watchFolder = async (options: {
  callback?: (arg0: Changed) => void;
  apiKey?: string;
  folderPath: string;
  nameWatcher: string;
}): Promise<Changed> => {
  const { callback, folderPath, nameWatcher } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("watchFolder", { folderPath, nameWatcher });

  return folderChanged({ callback, apiKey });
};

const fileChanged = async (options: {
  callback?: (arg0: Changed) => void;
  apiKey?: string;
}): Promise<Changed> => {
  const { callback } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  return new Promise((resolve) => {
    api.receive("fileChanged", (data: Changed) => {
      const { path, eventName, nameWatcher } = data;
      if (callback) {
        callback({ path, eventName, nameWatcher });
      }
      resolve({ path, eventName, nameWatcher });
    });
  });
};

const watchFile = async (options: {
  callback?: (arg0: Changed) => void;
  apiKey?: string;
  folderPath: string;
  nameWatcher: string;
}): Promise<Changed> => {
  const { callback, folderPath, nameWatcher } = options;
  const apiKey = options?.apiKey || defaultApiKey;
  const api = globalThis[apiKey as keyof typeof globalThis][nameAPI];

  api.send("watchFile", { folderPath, nameWatcher });

  return fileChanged({ callback, apiKey });
};

const renderer = {
  watchFolder,
  watchFile,
  on: {
    folderChanged,
    fileChanged,
  },
};

export default renderer;
