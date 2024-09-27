// 控制应用程序生命周期和创建本地浏览器窗口的模块
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow () {
  // 创建浏览器窗口。
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载应用的 index.html。
  mainWindow.loadFile('index.html')

  // 打开开发者工具。
  // mainWindow.webContents.openDevTools()
}

// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法。
// 一些 API 只能在此事件发生后使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 在 macOS 上，通常在应用的 dock 图标被点击且没有其他窗口打开时重新创建窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出，除了 macOS。在 macOS 上，应用程序及其菜单栏通常保持活动状态，直到用户显式使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在此文件中，您可以包含应用特定的主进程代码。
// 您也可以将它们放在单独的文件中并在此处引入。
