const path = require('path')
const ejs = require('ejs')

function compileEjs(templateFileName, data) {
  return new Promise((resolve, reject) => {
    // 1. 获取当前模板的路径
    const templateFilePath = `../template/${templateFileName}`
    // 需要使用绝对路径
    const absolutePath = path.resolve(__dirname, templateFilePath)

    // 2. 使用 ejs 模板引擎编译模板
    ejs.renderFile(absolutePath, data, (err, result) => {
      if (err) {
        console.log('编译模板失败', err)
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

module.exports = compileEjs