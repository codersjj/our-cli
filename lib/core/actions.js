const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const { VUE3_TEMPLATE_REPO } = require('../config/repo')

async function createProjectAction(dest) {
  try {
    // https://gitlab.com/flippidippi/download-git-repo#:~:text=Using%20git%20clone%20from%20direct%20url%20at%20my%2Dbranch.
    // https://nodejs.org/dist/latest-v18.x/docs/api/util.html#utilpromisifyoriginal
    await download(VUE3_TEMPLATE_REPO, dest, { clone: true })
    console.log('Success')
  } catch (err) {
    console.log('download failed o(╥﹏╥)o', err)
  }
}

module.exports = {
  createProjectAction
}