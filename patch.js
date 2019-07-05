const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
const f2 = 'node_modules/@ionic/core/dist/collection/components/app/app.scss';
const scss_data = `
  html.plt-mobile ion-app {
    // user-select: none;
    -webkit-user-select: text!important;
    -moz-user-select: text!important;
    -ms-user-select: text!important;
    user-select: text!important;
  }

  ion-app.force-statusbar-padding {
    --ion-safe-area-top: 20px;
  }

  body {
    -webkit-user-select: text!important;
    -moz-user-select: text!important;
    -ms-user-select: text!important;
    user-select: text!important;
  }
  `;


fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

fs.writeFile(f2, scss_data, 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
    throw err;
  }

  console.log("Patch for app.scss");

})
