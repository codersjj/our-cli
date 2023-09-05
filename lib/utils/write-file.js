const fs = require('fs')

function writeFile(path, content) {
  // https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
  return fs.promises.writeFile(path, content)
}

module.exports = writeFile