const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let pyProc = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Carga la app Flask en la ventana de Electron
  win.loadURL('http://127.0.0.1:5000');

  // Cierra Flask al cerrar la ventana
  win.on('closed', () => {
    if (pyProc) pyProc.kill();
    win = null;
  });
}

app.whenReady().then(() => {
  // Inicia Flask
  pyProc = exec('python app.py', (error, stdout, stderr) => {
    if (error) console.error(`Error al iniciar Flask: ${error.message}`);
    if (stderr) console.error(`Flask error: ${stderr}`);
    console.log(`Flask: ${stdout}`);
  });

  // Espera unos segundos para que Flask arranque antes de abrir la ventana
  setTimeout(createWindow, 3000);
});

app.on('window-all-closed', () => {
  // En Windows y Linux, cerrar todo al cerrar la ventana
  if (process.platform !== 'darwin') {
    if (pyProc) pyProc.kill();
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS, reabrir ventana si no hay ninguna
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
