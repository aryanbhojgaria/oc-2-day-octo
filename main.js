const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const fs = require('fs');

// Serve the exported Next.js static build in the "out" directory
const loadURL = serve({ directory: 'out' });

// __dirname always refers to the directory containing main.js
const backendPath = path.join(__dirname, 'backend');
const dbPath = path.join(backendPath, 'dev.db');

// Important: Configure the backend environment variables before requiring it.
// This ensures Prisma uses the correct SQLite database path when packaged.
process.env.DATABASE_URL = `file:${dbPath}`;
process.env.PORT_BACKEND = "4000";

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Since we use static export, we always load the "out" directory
    loadURL(mainWindow);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    // Start the Express backend server by requiring it directly in the Main process
    try {
        console.log(`Starting backend from: ${backendPath}`);
        require(path.join(backendPath, 'dist', 'index.js'));
    } catch (error) {
        console.error("Failed to start backend inside Electron:", error);
    }

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
