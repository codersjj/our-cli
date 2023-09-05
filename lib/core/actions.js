const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const { VUE3_TEMPLATE_REPO } = require('../config/repo')
const execCommand = require('../utils/exec-command')

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
    console.log('platform:', process.platform)
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    await execCommand(command, ['install'], { cwd: `./${dest}` })

    // 4. 帮助自动执行 npm run dev
    await execCommand(command, ['run', 'dev'], { cwd: `./${dest}` })

  } catch (err) {
    console.log('download failed o(╥﹏╥)o', err)
  }
}

module.exports = {
  createProjectAction
}