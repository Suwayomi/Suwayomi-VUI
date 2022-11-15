/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { contextBridge } from 'electron';
import { BrowserWindow } from '@electron/remote';

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow()?.minimize();
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow();

    if (win?.isMaximized()) {
      win?.unmaximize();
    } else {
      win?.maximize();
    }
  },

  close() {
    BrowserWindow.getFocusedWindow()?.close();
  }
});

const win = BrowserWindow.getFocusedWindow();
win?.webContents.send('full-screen', win?.fullScreen || false);
win?.addListener('enter-full-screen', () => {
  const event = new CustomEvent('full-screen', { detail: true });
  window.dispatchEvent(event);
});
win?.addListener('leave-full-screen', () => {
  const event = new CustomEvent('full-screen', { detail: false });
  window.dispatchEvent(event);
});
