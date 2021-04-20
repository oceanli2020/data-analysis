let mainWin
const EventReply = async (mainWindow) => {
  mainWin = mainWindow 
}

export function sendProcess(message, percentage) {
  mainWin.webContents.send('extract:progress', { message, percentage })
}
export function sendEnd(status, message, percentage) {
  mainWin.webContents.send('extract:progress', { status, message, percentage })
}

export default EventReply
