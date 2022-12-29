const db = require('./db')
const inquirer = require('inquirer')

/* 添加任务 */
module.exports.add = async (title) => {
  // 读取之前的任务
  const list = await db.read()
  // 添加新任务
  list.push({ title: title, done: false })
  // 写入文件
  await db.write(list)
}

/* 清空任务 */
module.exports.clear = async () => {
  await db.write([])
}

function askForCreateTask(list) {
  // 创建任务
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '请输入任务标题',
    })
    .then((answer) => {
      list.push({ title: answer.title, done: false })
      db.write(list)
    })
}
function removeTask(list, index) {
  list.splice(index, 1)
  db.write(list)
}
function updateTitle(list, index) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '请输入新的标题',
      default: list[index].title,
    })
    .then((answer) => {
      list[index].title = answer.title
      db.write(list)
    })
}
function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}
function markAsUndone(list, index) {
  list[index].done = false
  db.write(list)
}
function askForActions(list, index) {
  const actions = { markAsDone, markAsUndone, updateTitle, removeTask }

  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [
        { name: '退出', value: 'quit' },
        { name: '已完成', value: 'markAsDone' },
        { name: '未完成', value: 'markAsUndone' },
        { name: '编辑', value: 'updateTitle' },
        { name: '删除', value: 'removeTask' },
      ],
    })
    .then((answer) => {
      const action = actions[answer.action]
      action && action(list, index)
    })
}

function printTasks(list) {
  // 打印任务
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务',
      choices: [
        { name: '退出', value: '-1' },
        ...list.map((task, index) => {
          return {
            name: `${task.done ? '[x]' : '[_]'}${index + 1} - ${task.title}`,
            value: index.toString(), // 必须是字符串
          }
        }),
        { name: '+ 创建任务', value: '-2' },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForActions(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}

/* 展示任务 */
module.exports.showAll = async () => {
  // 读取之前的任务
  const list = await db.read()
  printTasks(list)
}
