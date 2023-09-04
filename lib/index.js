#!/usr/bin/env node
const { program } = require('commander')

// 随便打印点东西
console.log('my cli code executed~')

// console.log(process.argv)
// 处理 --version 的操作
// program.version('1.0.1', '-v --version')
const version = require('../package.json').version
program.version(version, '-v --version')
// 让 commander 解析 process.argv 参数
program.parse(process.argv)