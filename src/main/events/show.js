import WeChat from '../show/weChat'
import { ipcMain } from 'electron'

const show = (mainWindow) => {
  const map = {
    'show:weChat:message:talkers': WeChat.handleWeChatMessageTalkers,
    'show:weChat:message': WeChat.handleWeChatMessage
  }
  Object.keys(map).forEach((key) => {
    ipcMain.on(key, (event, param) => {
      event.reply(`${key}:reply`, map[key](param))
    })
  })
}
export default show
