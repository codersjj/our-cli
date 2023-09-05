const { program } = require('commander')

function helpOptions() {
  // 1. 处理 --version 的操作
  const version = require('../../package.json').version
  program.version(version, '-v --version')

  // 2. 增加其它的 options 操作
  program.option('-m --my', 'a my-cli program~')
  program.option('-d, --dest <destination>', 'the destination directory，例如：-d src/components')

  program.on('--help', () => {
    // console.log('自己添加的打印的内容')
    console.log('')
    console.log('others')
    console.log('  xxx')
    console.log('  yyy')
  })
}

module.exports = helpOptions