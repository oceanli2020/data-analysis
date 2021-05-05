import { ipcMain } from 'electron'
import nodejieba from 'nodejieba'
import { getByUserId } from '../db/weChat/message'

const analysis = (mainWindow) => {
  ipcMain.on('analysis:weChat:message', (event, params) => {
    const messages = getByUserId(params)
    const wordMap = {}
    messages.forEach((message) => {
      const words = nodejieba.cut(message.content)
      words.forEach((word) => {
        wordMap[word] = wordMap[word] ? wordMap[word] + 1 : 1
      })
    })
    const wordList = []
    Object.keys(wordMap).forEach((word) => {
      if (wordMap[word] > 1 && word.length > 1) {
        wordList.push({ name: word, value: wordMap[word] })
      }
    })
    event.reply('analysis:weChat:message:reply', wordList)
  })
}
export default analysis
