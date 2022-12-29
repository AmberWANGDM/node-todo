// home路径,系统默认
const userHomeDir = require('os').homedir()
// 环境变量,用户自己可以设置的
const home = process.env.HOME || userHomeDir
// 拼接文件路径 因为各个系统的/方向不一致,借助node模块
const path = require('path')
// 存放任务的数据库 [{},{}...]
const dbPath = path.join(home, '.todo')
const fs = require('fs')

const db = {
  // 读文件
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (error, data) => {
        if (error) {
          return reject(error)
        }
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (error2) {
          list = []
        }
        resolve(list)
      })
    })
  },

  // 写文件
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string, (error) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  },
}

module.exports = db
