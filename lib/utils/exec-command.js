const { spawn } = require('child_process')

function execCommand(...args) {
  // 异步操作，想把结果告诉调用者，最好放到 promise 中
  return new Promise((resolve) => {
    console.log('execCommand ~ args:', args)
    // 1. 使用给定的命令（command）生成一个新的进程
    // https://nodejs.org/api/child_process.html#child_processspawncommand-args-options
    const childProcess = spawn(...args)

    // 2. 获取子进程（即上面的新进程）的输出和错误信息
    // 把子进程的输出通过管道放到当前进程的输出中
    childProcess.stdout.pipe(process.stdout)
    // 把子进程的错误信息通过管道放到当前进程的错误信息中
    childProcess.stderr.pipe(process.stderr)

    // 3. 监听子进程执行结束，编写关闭掉时的回调函数
    // https://nodejs.org/api/child_process.html#event-close
    childProcess.on('close', () => {
      console.log('子进程执行结束')
      resolve()
    })
  })
}

module.exports = execCommand