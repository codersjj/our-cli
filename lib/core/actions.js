const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const { program } = require('commander')
const { VUE3_TEMPLATE_REPO } = require('../config/repo')
const execCommand = require('../utils/exec-command')
const compileEjs = require('../utils/compile-ejs')
const { writeFile } = require('../utils/file')

async function createProjectAction(dest) {
  try {
    // 1. 将编写好的项目模板 clone 下来
    // https://gitlab.com/flippidippi/download-git-repo#:~:text=Using%20git%20clone%20from%20direct%20url%20at%20my%2Dbranch.
    // https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilpromisifyoriginal
    await download(VUE3_TEMPLATE_REPO, dest, { clone: true })
    console.log('download success')

    // 2. 很多脚手架，都是在这里给予提示
    // console.log('')
    // console.log(`cd ${dest}`)
    // console.log('npm install')
    // console.log('npm run dev')

    // 3. 帮助自动执行 npm install
    // 注意：Windows 平台用的是 npm.cmd
    // https://github.com/nodejs/node/issues/3675#issuecomment-154264390
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    await execCommand(command, ['install'], { cwd: `./${dest}` })

    // 4. 帮助自动执行 npm run dev
    await execCommand(command, ['run', 'dev'], { cwd: `./${dest}` })

  } catch (err) {
    console.log('download failed o(╥﹏╥)o', err)
  }
}

/**
 * 添加组件
 * @param {string} cpnName 组件名称
 * @param {string} type 组件类型，可选的值有 vue、react
 * @return {Promise<void>} a promise that resolves when the component is added
 */
async function addComponentAction(cpnName) {
  const type = program.opts().type || 'vue'
  let templateFile = ''
  switch (type) {
    case 'vue':
      templateFile = 'component.vue.ejs'
      break
    case 'react':
      templateFile = 'Component.jsx.ejs'
      break
    default:
      templateFile = 'component.vue.ejs'
  }

  // 1. 给组件模板填充数据，并获取填充后的文件内容
  const result = await compileEjs(
    templateFile,
    {
      name: cpnName,
      lowerCaseName: cpnName.toLowerCase()
    }
  )

  // 2. 将结果写入到对应的文件夹中
  // 获取目标路径
  const dest = program.opts().dest || 'src/components'
  const ext = type === 'vue' ? 'vue' : 'jsx'
  const fileName = type === 'vue' ? cpnName : 'index'
  await writeFile(`${dest}/${fileName}.${ext}`, result)
  console.log(`组件 ${fileName}.${ext} 创建成功，所在路径：${dest}/${fileName}.${ext}`)
}

module.exports = {
  createProjectAction,
  addComponentAction
}