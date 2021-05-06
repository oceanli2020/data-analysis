import Adb from '../utils/adb'
import { ipcMain } from 'electron'

const device = (mainWindow) => {
  const client = Adb.getInstance()

  ipcMain.on('device:list', (event) => {
    client.listDevices().then((devices) => {
      const deviceInfos = []
      const promises = []
      devices.forEach((device) => {
        deviceInfos.push({
          serial: device.id
        })
        promises.push(client.getProperties(device.id))
        Promise.all(promises).then((results) => {
          for (let index = 0; index < results.length; index++) {
            const result = results[index]
            Object.assign(deviceInfos[index], getDevice(result))
          }
          event.reply('device:list:reply', deviceInfos)
        })
      })
    })
  })
}
function getDevice(properties) {
  return {
    manufacturer: properties['ro.product.manufacturer'],
    model: properties['ro.product.model'],
    product: properties['ro.build.product'],
    os: properties['ro.build.version.release'],
    imei: properties['ro.ril.oem.imei'],
    imsi: properties['ril.slot0_imsi'],
    timezone: properties['persist.sys.timezone']
  }
}
export default device
