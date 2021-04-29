import Database from 'better-sqlite3'
import { app } from 'electron'
import mkdirp from 'mkdirp'
import fs from 'fs'
import path from 'path'
export default class DB {
  static instance

  static getInstance() {
    if (!this.instance) {
      this.instance = DB.createDb()
    }
    return this.instance
  }

  static createDb() {
    const dbPath = path.resolve(
      app.getPath('userData'),
      './data/demo/Database.db'
    )
    const isDbExist = fs.existsSync(dbPath)

    if (!isDbExist) {
      mkdirp.sync(path.dirname(dbPath))
    }

    const dataBase = new Database(dbPath)

    if (!isDbExist) {
      dataBase.exec(fs.readFileSync(__static + '/demo.sql', 'utf8'))
    }

    dataBase.function('regexp', (pattern, text) => {
      const regex = new RegExp(pattern)
      return Number(regex.test(text))
    })

    dataBase.function('matches', (text, pattern) => {
      const regex = new RegExp(pattern, 'i')
      const result = regex.exec(text)
      if (result) {
        return result[0]
      }
      return null
    })

    // ?
    dataBase.pragma('journal_mode = WAL')
    // 数据库区分大小写
    dataBase.pragma('case_sensitive_like=ON')

    return dataBase
  }
}
