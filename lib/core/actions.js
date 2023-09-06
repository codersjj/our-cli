const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const { program } = require('commander')
const { red, green, lightBlue, bold } = require('kolorist')
const prompts = require('prompts');

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
    console.log(green('download success'))

    const response = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Automatically installing dependencies and running the project?',
      initial: true
    })

    console.log('')
    if (!response.value) {
      console.log(bold(green(`  cd ${dest}`)))
      console.log(bold(green('  npm install')))
      console.log(bold(green('  npm run dev')))
    } else {
      // 帮助自动执行 npm install
      const cwd = `./${dest}`
      // 注意：Windows 平台用的是 npm.cmd
      // https://github.com/nodejs/node/issues/3675#issuecomment-154264390
      const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
      console.log(lightBlue(`cd ${cwd}`))
      console.log(lightBlue('npm install'))
      await execCommand(command, ['install'], { cwd })

      // 帮助自动执行 npm run dev
      console.log(lightBlue('npm run dev'))
      await execCommand(command, ['run', 'dev'], { cwd })
    }

  } catch (err) {
    console.log(red('download failed o(╥﹏╥)o'), err)
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
  let templateFiles = []
  switch (type) {
    case 'vue':
      templateFiles.push('component.vue.ejs')
      break
    case 'react':
      templateFiles.push('Component.jsx.ejs', 'style.js.ejs')
      break
    default:
      templateFiles.push('component.vue.ejs')
  }

  async function handleFile(templateFile) {
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

    const templateFileNameFragments = templateFile.split('.')
    const ext = templateFileNameFragments[1]
    const fileName = type === 'vue'
      ? cpnName
      : templateFileNameFragments[0] === 'style'
        ? 'style'
        : 'index'

    await writeFile(`${dest}/${fileName}.${ext}`, result)

    const desc = templateFileNameFragments[0] === 'style' ? '样式文件' : '组件'
    const message = `${desc} ${fileName}.${ext} 创建成功，路径为：${dest}/${fileName}.${ext}`
    console.log(green(message))
  }

  const handleFileFns = templateFiles.map(item => handleFile(item))
  await Promise.allSettled(handleFileFns)
}

module.exports = {
  createProjectAction,
  addComponentAction
}