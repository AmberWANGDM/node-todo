#!/usr/bin/env node
const { Command } = require('commander')
const program = new Command()
const pkg = require('./package.json')

// api
const api = require('./index')

// 定义选项 options
program.version(pkg.version)

// 定义命令 commands
program
  .command('add <taskName...>')
  .description('add a task')
  .action((title) => {
    api.add(title).then(
      () => {
        console.log('添加成功')
      },
      (error) => {
        console.log('添加失败' + error)
      }
    )
  })
program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear()
  })

program.parse(process.argv)

if (process.argv.length === 2) {
  api.showAll()
}
