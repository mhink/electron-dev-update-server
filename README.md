# electron-dev-update-server

This is an example of the development-mode Electron release server I'm trying to use, which is currently NOT working. It's heavily cribbed from the article [Auto-updating apps for Windows and OSX using Electron: The complete guide](https://medium.com/@svilen/auto-updating-apps-for-windows-and-osx-using-electron-the-complete-guide-4aa7a50b904c#.3qxxfwmiu) It contains:

* `server.js`, an Express server
* `releases`, an example directory structure which usually contains my builds
* `ssl`, a directory which usually contains an SSL certificate and key

As of right now, the auto-updating code in my Electron main process script looks something like this:

```javascript
import { autoUpdater } from 'electron';
const APP_VERSION = "1.0.0";

app.on('ready', () => {
  autoUpdater.setFeedURL(`https://localhost:3002/updates/latest?v=${APP_VERSION}`);
  autoUpdater.on('error', (event) => {
    console.error("An error happened, boo");
    console.error(event);
  });
  autoUpdater.on('updates-available', () => {
    console.log("Updates are available- hooray!");
  });
  autoUpdater.checkForUpdates();
});

/* ...more code which starts the app */
```

When I compile and package this, I get an error of the following form:
...actually, I don't get an error.

Weird. Never mind, then.
