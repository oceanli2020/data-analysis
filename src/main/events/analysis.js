import { ipcMain } from 'electron'
import nodejieba from 'nodejieba'
import { getByUserIdAndSensitive, getByUserId } from '../db/weChat/message'

const analysis = (mainWindow) => {
  ipcMain.on('analysis:weChat:message', (event, params) => {
    const messages = getByUserId(params)
    let sensitives = []
    messages.forEach((message) => {
      sensitives = sensitives.concat(nodejieba.cut(message.content))
    })
    params['sensitives'] = sensitives
    const list = getByUserIdAndSensitive(params)
    const wordList = []
    list.forEach((item) => {
      wordList.push({ name: item.sensitive, value: item.count })
    })
    event.reply('analysis:weChat:message:reply', wordList)
  })
}
export default analysis
