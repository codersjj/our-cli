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
    console.log("🚀 ~ file: actions.js ~ result:", result)

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
    console.log(message)
  }
  // 遍历填充多个模板
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#:~:text=forEach()%20expects%20a%20synchronous%20function%20%E2%80%94%20it%20does%20not%20wait%20for%20promises.%20Make%20sure%20you%20are%20aware%20of%20the%20implications%20while%20using%20promises%20(or%20async%20functions)%20as%20forEach%20callbacks.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#composition:~:text=Sequential%20composition%20can%20also%20be%20done%20more%20succinctly%20with%20async/await%3A
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#composition:~:text=However%2C%20before%20you%20compose%20promises%20sequentially%2C%20consider%20if%20it%27s%20really%20necessary%20%E2%80%94%20it%27s%20always%20better%20to%20run%20promises%20concurrently%20so%20that%20they%20don%27t%20unnecessarily%20block%20each%20other%20unless%20one%20promise%27s%20execution%20depends%20on%20another%27s%20result.
  // for (const templateFile of templateFiles) {
  //   await handleFile(templateFile)
  // }

  const handleFileFns = templateFiles.map(item => handleFile(item))
  await Promise.allSettled(handleFileFns)

  console.log('after loop')
}

module.exports = {
  createProjectAction,
  addComponentAction
}