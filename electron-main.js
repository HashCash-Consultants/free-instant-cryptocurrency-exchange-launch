const { app, BrowserWindow, shell, dialog,globalShortcut,ipcMain, session } = require('electron')
const fs = require('fs');
const FB = require('fb');
const path = require('path')
const express = require('express');
const server = express();
const url = require('url');


// var Env = JSON.parse(fs.readFileSync(`${__dirname}/env.json`));

let mainWindow;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
    app.setAsDefaultProtocolClient('electron-fiddle')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })


  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    createWindow()
  })
  
  app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
  })
}

function createWindow () {
  // Create the browser window.
  var iconData
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 850,
    icon: __dirname + '/src/assets/paybito.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  mainWindow.setMenuBarVisibility(false)

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize()
})


    mainWindow.webContents.on('did-fail-load', () => {
    // app.relaunch();
    // app.exit();
  })

  session.defaultSession.clearStorageData(null, (error) => {
    // in our case we need to restart the application
    // app.relaunch();
    // app.exit();
  });

  let currentURL = mainWindow.webContents.getURL();

  mainWindow.webContents.on("did-navigate-in-page", function(event ,url, isMainFrame, ) {
    // console.log('test url new',url );
    // console.log('test url new mainss',isMainFrame );


  })
  

  mainWindow.webContents.on("new-window", function(event, url) {

    //  console.log('url', url)
   

    if(url.includes('https://www.facebook.com/sharer/sharer.php') > 0){
    //  console.log('open in new')

      event.preventDefault();
      shell.openExternal(url);
    }

    if(url.includes('https://twitter.com/') > 0){
      //  console.log('open in new')
  
        event.preventDefault();
        shell.openExternal(url);
      }
      if(url.includes('https://www.linkedin.com/') > 0){
      //  console.log('open in new')
  
        event.preventDefault();
        shell.openExternal(url);
      }
      if(url.includes('whatsapp.com/') > 0){
      //  console.log('open in new')
  
        event.preventDefault();
        shell.openExternal(url);
      }

    else{
      // console.log('nothing to do')

    }



  });

  
  
  server.use('/', express.static(__dirname));
  const infos = server.listen(4200, 'localhost', () => mainWindow.loadURL(`http://localhost:${infos.address().port}/dist/Digital/index.html`)
  );
  
 
}

app.commandLine.appendSwitch('ignore-certificate-errors')

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})




// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('file://', pageDirectory, 'index.html')
  shell.openExternal(pagePath)
})



