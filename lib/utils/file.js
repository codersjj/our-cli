const fs = require('fs')
const path = require('path')

function writeFile(path, content) {
  // 先确保文件所在路径的目录存在
  ensureDirectoryExistence(path)
  // 再将内容写入该文件
  // https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
  return fs.promises.writeFile(path, content)
}

/**
 * Ensures that the directory for the given file path exists.
 *
 * @param {string} filePath - The path to the file.
 * @return {boolean} Returns true if the directory exists or is created successfully.
 */
function ensureDirectoryExistence(filePath) {
  // 获取文件所在目录的路径
  const dirname = path.dirname(filePath)
  // 检查目录是否已存在，如果已存在，返回 true
  if (fs.existsSync(dirname)) {
    return true
  }
  // 目录不存在，则递归调用 ensureDirectoryExistence 函数以创建上级目录
  console.log(`========== ${dirname} 目录不存在 ==========`)
  ensureDirectoryExistence(dirname)
  console.log(`========== 创建 ${dirname} 目录... ==========`)
  // 创建目录
  fs.mkdirSync(dirname)
}

module.exports = {
  writeFile
}