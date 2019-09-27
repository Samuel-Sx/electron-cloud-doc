const { app, BrowserWindow } = require('electron')

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        width: 1600,
        height: 1200,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL('http://localhost:3000')
})