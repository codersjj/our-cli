#!/usr/bin/env node
const { program } = require('commander')
const helpOptions = require('./core/help-options')
const { createProjectAction } = require('./core/actions')

// 1. 配置所有的 options
helpOptions()

// 2. 增加一些具体的功能操作
// 比如使用此脚手架创建一个 Vue 项目的模板
// https://github.com/tj/commander.js#command-arguments
program
  .command('create <project> [others...]')
  .description('create a vue project to a directory，比如 my-cli create my-project')
  .action((project, others) => {
    console.log('创建一个项目', project, others)
    // 1. 将已经编写好的项目模板 clone 下来
    createProjectAction(project)
  })

// 让 commander 解析 process.argv 参数
// process.argv 可以省略，因为 program.parse() 的参数默认值就是 process.argv https://github.com/tj/commander.js#:~:text=program.parse(arguments)%20processes%20the%20arguments%2C%20leaving%20any%20args%20not%20consumed%20by%20the%20program%20options%20in%20the%20program.args%20array.%20The%20parameter%20is%20optional%20and%20defaults%20to%20process.argv.
program.parse(process.argv)

// 获取 option 的值
// const destination = program.opts().dest
// console.log('destination:', destination)