# IPC for Electron: Chokidar (NOT YET TESTED)

Allow the renderer to use [chokidar](https://www.npmjs.com/package/chokidar) (Minimal and efficient cross-platform file watching library)

NPM link: [@el3um4s/ipc-for-electron-chokidar](https://www.npmjs.com/package/@el3um4s/ipc-for-electron-chokidar)

Use [@el3um4s/ipc-for-electron](https://www.npmjs.com/package/@el3um4s/ipc-for-electron) and [@el3um4s/renderer-for-electron-chokidar](https://www.npmjs.com/package/@el3um4s/renderer-for-electron-chokidar) to allow communication between Electron and a web page

### Install and use the package

To use the package in a project:

```bash
npm i @el3um4s/ipc-for-electron @el3um4s/ipc-for-electron-chokidar @el3um4s/renderer-for-electron-chokidar
```

Then the `preload.ts` file:

```ts
import { generateContextBridge } from "@el3um4s/ipc-for-electron";
import chokidar from "@el3um4s/ipc-for-electron-chokidar";

const listAPI = [chokidar];

generateContextBridge(listAPI);
```

In the renderer file:

```ts
import chokidar from "@el3um4s/renderer-for-electron-chokidar";

chokidar.watchFolder({
  folderPath: "./documents",
  nameWatcher: "customNameWatcher",
  apiKey: "my-api-key",
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});

chokidar.on.folderChanged({
  apiKey: "my-api-key",
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});

chokidar.watchFile({
  filePath: "./documents/demo.txt",
  nameWatcher: "customNameWatcher",
});

chokidar.on.fileChanged({
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});
```

In the renderer you can use:

```ts
globalThis.ipc.chokidar.send("watchFolder", {
  folderPath: "./documents",
  nameWatcher: "customNameWatcher",
});

globalThis.ipc.chokidar.receive("folderChanged", (data) => {
  const { path, eventName, nameWatcher } = data;
  console.log(data);
});

globalThis.ipc.chokidar.send("watchFile", {
  filePath: "./documents/demo.txt",
  nameWatcher: "customNameWatcher",
});

globalThis.ipc.chokidar.receive("fileChanged", (data) => {
  const { path, eventName, nameWatcher } = data;
  console.log(data);
});
```

### API: Electron Side

- `watchFolder` - Watch a folder. The response is sent to the `folderChanged` channel. The response is a `Changed` object.
- `watchFile` - Watch a file. The response is sent to the `fileChanged` channel.The response is a `Changed` object.

### API: Renderer Side - Request

`watchFolder = async (options: { callback?: (arg0: Changed) => void; apiKey?: string; folderPath: string; nameWatcher: string; }): Promise<Changed>`

example:

```ts
import chokidar from "@el3um4s/renderer-for-electron-chokidar";

chokidar.watchFolder({
  folderPath: "./documents",
  nameWatcher: "customNameWatcher",
  apiKey: "ipc",
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});

chokidar.watchFolder({
  folderPath: "./downloads",
  nameWatcher: "customNameWatcher",
});
```

`watchFile = async (options: { callback?: (arg0: Changed) => void; apiKey?: string; folderPath: string; nameWatcher: string; }): Promise<Changed>`

example:

```ts
import chokidar from "@el3um4s/renderer-for-electron-chokidar";

chokidar.watchFile({
  filePath: "./documents/demo.txt",
  nameWatcher: "customNameWatcher",
  apiKey: "ipc",
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});

chokidar.watchFile({
  filePath: "./documents/list.csv",
  nameWatcher: "customNameWatcher",
});
```

### API: Renderer Side - Response

`on.folderChanged = async (options: { callback?: (arg0: Changed) => void; apiKey?: string; }): Promise<Changed>`

example:

```ts
import chokidar from "@el3um4s/renderer-for-electron-chokidar";

chokidar.watchFolder({
  folderPath: "./downloads",
  nameWatcher: "customNameWatcher",
});

chokidar.on.folderChanged({
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});
```

`on.fileChanged = async (options: { callback?: (arg0: Changed) => void; apiKey?: string; }): Promise<Changed>`

example:

```ts
import chokidar from "@el3um4s/renderer-for-electron-chokidar";

chokidar.watchFile({
  filePath: "./documents/list.csv",
  nameWatcher: "customNameWatcher",
});

chokidar.on.fileChanged({
  callback: (data) => {
    const { path, eventName, nameWatcher } = data;
    console.log(data);
  },
});
```

### Types

**Changed**

```ts
interface Changed {
  path: string;
  eventName: "add" | "change" | "unlink" | "addDir" | "unlinkDir";
  nameWatcher: string;
}
```

**DefaultApiKey**

```ts
type DefaultApiKey = "ipc";
```
