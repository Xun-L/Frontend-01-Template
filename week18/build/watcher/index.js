const fs = require('fs');
const { exec } = require('child_process');

exec('http-server');

fs.watch('./src', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(Uint8ArrayToString(filename), eventType);
    // Prints: <Buffer ...>
  }
  exec('webpack');
});

function Uint8ArrayToString(fileData) {
  var dataString = '';
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString;
}
