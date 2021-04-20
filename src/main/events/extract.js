import { ipcMain } from 'electron'
import WeChatXiaomi from '../extract/weChat/xiaomi'

const extract = (mainWindow) => {
  ipcMain.on('extract:data', (event, param) => {
    new WeChatXiaomi().execExtract(param.path)
    event.reply('extract:data:reply', 'success')
  })
}
export default extract
