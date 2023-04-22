import { app, BrowserWindow, IpcMainEvent } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'

declare const MAIN_WINDOW_WEBPACK_ENTRY: any
declare const USERS_WEBPACK_ENTRY: any
declare const PROFILE_WEBPACK_ENTRY: any

type Window = BrowserWindow | null
let shouldOpenProfileWin = true
let shouldRefreshUserList = false

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
   app.quit()
}

const createWindow = (): void => {
   // const Store = require('electron-store')
   // Store.initRenderer()
   // Create the browser window.
   
   // Create the browser window.
   let mainWindow: Window = new BrowserWindow({
      width: 460,
      height: 720,
      frame: false,
      webPreferences: {
         nodeIntegration: true,
         enableRemoteModule: true,
         webSecurity: false,
      },
   })
   
   let usersWin: Window = new BrowserWindow({
      width: 300,
      height: 700,
      parent: mainWindow,
      frame: false,
      webPreferences: {
         nodeIntegration: true,
         webSecurity: false,
         enableRemoteModule: true,
      },
      show: false,
   })
   
   let profileWin: Window = new BrowserWindow({
      width: 460,
      height: 456,
      parent: mainWindow,
      frame: false,
      resizable: false,
      webPreferences: {
         nodeIntegration: true,
         webSecurity: false,
         enableRemoteModule: true,
      },
      show: false,
   })
   
   // and load the index.html of the app.
   mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
   profileWin.loadURL(PROFILE_WEBPACK_ENTRY)
   usersWin.loadURL(USERS_WEBPACK_ENTRY)
   
   // Open the DevTools.
   mainWindow.webContents.once('dom-ready', () => {
      mainWindow?.webContents.openDevTools()
   })
   
   profileWin.on('close', (e: Event) => {
      e.preventDefault()
      profileWin?.close()
   })
   
   usersWin.on('close', (e) => {
      e.preventDefault()
      usersWin?.hide()
   })
   
   usersWin.on('show', () => {
      while (shouldRefreshUserList) {
         usersWin?.loadURL(USERS_WEBPACK_ENTRY)
         shouldRefreshUserList = false
      }
   })
   
   
   // Events
   const electron = require('electron')
   const ipcMain = electron.ipcMain
   
   ipcMain.on('user-signed-out', () => {
      shouldRefreshUserList = true
      usersWin?.hide()
      profileWin?.hide()
      
      // usersWin?.loadURL(USERS_WEBPACK_ENTRY)
   })
   
   ipcMain.on('user-logged-in', () => {
      usersWin?.webContents.send('refresh-since-user-logged-in')
   })
   
   ipcMain.on('toggle-userlist', () => {
      
      
      usersWin?.isVisible() ? usersWin?.hide() : usersWin?.show()
   })
   
   ipcMain.on('should-open-profile-win', (event: IpcMainEvent, args: any) => {
      shouldOpenProfileWin = args.flag
   })
   
   ipcMain.on('open-profile', (event: IpcMainEvent, arg: any) => {
      if (shouldOpenProfileWin) profileWin?.show()
   })
   
   ipcMain.on('close-profile', () => {
      profileWin?.hide()
   })
   
   ipcMain.on('header', (event: IpcMainEvent, arg: any) => {
      let w
      switch (arg.window) {
         case 'userList':
            w = usersWin
            break
         case 'main':
            w = mainWindow
            break
         case 'profile':
            w = profileWin
            break
      }
      
      if (arg.event === 'close') w?.close()
      if (arg.event === 'minimize') w?.minimize()
      if (arg.event === 'maximize') mainWindow?.maximize()
   })
   
   
   ipcMain.on('select-user', (event: IpcMainEvent, arg: any) => {
      console.log(arg)
      mainWindow?.webContents.send('selected-user', arg.user)
      profileWin?.webContents.send('selected-user', arg.user)
   })
   
}

app.whenReady().then(() => {
   installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
   installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit()
   }
})

app.on('activate', () => {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
   }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
