const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const notifier = require('node-notifier');
const path = require('path');
let mainWindow;
let tray = null;

const noti = () => {
  // 使用 node-notifier 发送美化的通知
  notifier.notify({
    title: '欢迎使用我的应用',
    message: '这是一个美化的消息通知示例。',
    icon: 'public/icon.png', // 替换为你的图标路径
    sound: true, // 是否播放声音
    wait: false, // 等待用户响应
  });
}


ipcMain.on('send_noti', () => {
  noti()
});



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'public/icon.png', // 替换为你的图标路径
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  // 处理关闭事件
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) { // 检查是否是通过托盘退出
      event.preventDefault(); // 阻止默认关闭行为
      if (mainWindow) { // 确保 mainWindow 存在
        mainWindow.hide(); // 隐藏窗口
      }
    }
  });

  // 监听窗口被销毁事件
  mainWindow.on('closed', () => {
    mainWindow = null; // 清空引用
  });
}

app.on('ready', () => {
  createWindow();

  // 创建系统托盘图标
  tray = new Tray('public/icon.png'); // 替换为你的图标路径
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', click: () => { app.isQuiting = true; app.quit(); } }
  ]);
  tray.setToolTip('electron_demo');
  tray.setContextMenu(contextMenu);

  // 点击托盘图标时恢复窗口
  tray.on('click', () => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) {
        mainWindow.show(); // 显示窗口
        mainWindow.focus(); // 确保窗口获得焦点
      }
    }
  });


});

// 处理应用退出
app.on('before-quit', () => {
  app.isQuiting = true; // 设置退出标志
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