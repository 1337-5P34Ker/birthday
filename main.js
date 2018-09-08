const {
  app,
  BrowserWindow,
  Menu
} = require('electron')
const ipc = require('electron').ipcMain

// Behalten Sie eine globale Referenz auf das Fensterobjekt. 
// Wenn Sie dies nicht tun, wird das Fenster automatisch geschlossen, 
// sobald das Objekt dem JavaScript-Garbagekollektor übergeben wird.

let win

function createWindow() {

  // Erstellen des Browser-Fensters.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    frame: false,
    transparent: true,
    resizable: true,
    movable: false
  })



  // und Laden der index.html der App.
  win.loadFile('src/index.html');


  // Öffnen der DevTools.
  win.webContents.openDevTools();
  process.env.NODE_ENV = 'production';

  // Ausgegeben, wenn das Fenster geschlossen wird.
  win.on('closed', () => {
    // Dereferenzieren des Fensterobjekts, normalerweise würden Sie Fenster
    // in einem Array speichern, falls Ihre App mehrere Fenster unterstützt. 
    // Das ist der Zeitpunkt, an dem Sie das zugehörige Element löschen sollten.
    win = null
  })

  var menu = Menu.buildFromTemplate([{
      label: 'Spiel',
      submenu: [{
        label: 'Beenden',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }]
    },
    {
      label: 'Info',
      submenu: [{
        label: 'Version 1.0'
      }]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on('ready', () => {
  createWindow();

})

// Verlassen, wenn alle Fenster geschlossen sind.
app.on('window-all-closed', () => {
  // Unter macOS ist es üblich für Apps und ihre Menu Bar
  // aktiv zu bleiben bis der Nutzer explizit mit Cmd + Q die App beendet.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
  if (win === null) {
    createWindow();
  }
})

ipc.on('quit', function (event, path) {
  app.quit()
})