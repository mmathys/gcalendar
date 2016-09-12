'use strict';

var _ = require('lodash');
const {
	app,
	BrowserWindow,
	crashReporter,
	ipcMain
} = require('electron')
const path = require('path')

// ####################################################
// ####################################################

// Report crashes to our server.
crashReporter.start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
  autoSubmit: true
})

var mainWindow = null;
var options = {
	"debug": true,
	"version": "1.0.1",
	"views_dir": "dist/views",
	"root_view": "index.html"
};

options = _.extend({
	// ADDITIONAL CUSTOM SETTINGS
}, options);

// ############################################################################################
// ############################################################################################

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') { app.quit(); }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL(path.join('file://', __dirname, options.views_dir, options.root_view));
  if(options.debug) { mainWindow.openDevTools(); }
  mainWindow.on('closed', function() { mainWindow = null; });

	ipcMain.on('electron-msg', (event, msg) => {
    //handle incoming message here
    console.log(msg);

    //message can be an Object
    if (msg.username == 'dude') {
      console.log(msg.access_level);
    }
  });
	setInterval(function() {
		mainWindow.webContents.send('electron-msg', "hi there from host");
	}, 5000);

});

// ############################################################################################
// ############################################################################################
