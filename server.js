'use strict';
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const https = require('https');

/* NOTE: This server code was heavily cribbed from the following article:
 * https://medium.com/@svilen/auto-updating-apps-for-windows-and-osx-using-electron-the-complete-guide-4aa7a50b904c#.cxpp6v3q7
 */

// Force 200 OK (rather than 304 Not Modified)
app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();
});

app.use(require('morgan')('dev'));

app.use('/updates/releases', express.static(path.join(__dirname, 'releases')));

app.get('/updates/latest', (req, res) => {
  const latest = getLatestRelease();
  const clientVersion = req.query.v;

  if (clientVersion === latest) {
    console.log("Client is up to date");
    res.status(204).end();
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.status(200).json({
      url: `https://localhost:3002/releases/darwin/${latest}/${process.env.APP_NAME}.zip`,
    });
  }
});

let getLatestRelease = () => {
  const dir = `${__dirname}/releases/darwin`;

  const versionsDesc = fs.readdirSync(dir).filter((file) => {
    const filePath = path.join(dir, file);
    return fs.statSync(filePath).isDirectory();
  }).reverse();

  return versionsDesc[0];
}

var options = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
  requestCert: false,
  rejectUnauthorized: false,
};

http.createServer(app).listen(process.env.PORT, () => {
  console.log(`Express app listening for HTTP on port ${process.env.PORT}`);
});
https.createServer(options, app).listen(process.env.SECURE_PORT, () => {
  console.log(`Express app listening for HTTPS on port ${process.env.SECURE_PORT}`);
});
