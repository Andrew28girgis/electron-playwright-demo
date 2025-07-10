// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const playwright = require('playwright');

app.commandLine.appendSwitch('remote-debugging-port', '9222');

let mainWin;
async function createWindow() {
  mainWin = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      webviewTag: true
    }
  });
  await mainWin.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('run-playwright-demo', async () => {
  const send = msg => mainWin.webContents.send('playwright-step', msg);

  send('Step 1/4: Connecting to Chromium (CDP)…');
  const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');

  send('Step 2/4: Picking the first context & page…');
  const context = browser.contexts()[0];
  const page = context.pages()[0];

  send('Step 3/4: Navigating to example.org…');
  await page.goto('https://google.com');
  await page.waitForTimeout(1000);              // pause so you can see it

  send('Step 4/4: Taking screenshot…');
  await page.screenshot({ path: 'demo-screenshot.png' });
  await page.waitForTimeout(500);

  await browser.close();
  send('✅ Demo complete — screenshot saved to demo-screenshot.png');

  return;
});
