const download = require('download-git-repo')
const { VUE3_TEMPLATE_REPO } = require('../config/repo')

function createProjectAction(dest) {
  // https://gitlab.com/flippidippi/download-git-repo#:~:text=Using%20git%20clone%20from%20direct%20url%20at%20my%2Dbranch.
  download(VUE3_TEMPLATE_REPO, dest, { clone: true }, (err) => {
    if (err) {
      console.log('download failed o(╥﹏╥)o', err)
    } else {
      console.log('Success')
    }
  })
}

module.exports = {
  createProjectAction
}