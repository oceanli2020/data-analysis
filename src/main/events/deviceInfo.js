import Adb from '@common/utils/adb'
import { ipcMain } from 'electron'
import Promise from 'bluebird'
import { getByDeviceSerial } from '@common/db/inspection'

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

function formatStorage(storageStr) {
  const unit = storageStr.substr(storageStr.length - 1)
  const value = storageStr.substr(0, storageStr.length - 1)
  switch (unit) {
    case 'G':
      return Number(value)
    case 'M':
      return Math.round(Number(value) / 1024)
    case 'K':
      return Math.round(Number(value) / 1024 / 1024)
    default:
      return Math.round(Number(storageStr) / 1024 / 1024)
  }
}

const deviceInfo = mainWindow => {
  const client = Adb.getInstance()

  client.trackDevices().then(tracker => {
    tracker.on('add', device => {
      client
        .getProperties(device.id)
        .then(properties => {
          const deviceInfo = {
            serial: device.id
          }
          Object.assign(deviceInfo, getDevice(properties))
          mainWindow.webContents.send('device:add', deviceInfo)
        })
        .catch(err => {
          mainWindow.webContents.send('device:add:error', {
            serial: device.id,
            error: err
          })
        })
    })
    tracker.on('remove', device => {
      mainWindow.webContents.send('device:remove', {
        serial: device.id
      })
    })
    Adb.setTracker(tracker)
  })

  ipcMain.on('device:list', (event, arg) => {
    client.listDevices().then(devices => {
      const promises = []
      const deviceInfos = []
      devices.forEach(device => {
        deviceInfos.push({
          serial: device.id
        })
        promises.push(client.getProperties(device.id))
      })
      Promise.allSettled(promises).then(results => {
        for (let index = 0; index < results.length; index++) {
          const result = results[index]
          if (result.isFulfilled()) {
            const properties = result.value()
            Object.assign(deviceInfos[index], getDevice(properties))
          }
        }
        event.reply('device:list:reply', deviceInfos)
      })
    })
  })

  ipcMain.on('device:storage', (event, serial) => {
    client
      .shell(serial, 'df /data')
      .then(Adb.getAdbkit().util.readAll)
      .then(result => {
        const resStr = result.toString('utf-8')
        const resArr = resStr.trim().split(/[(\r\n)\r\n]+/)
        if (resArr.length >= 2) {
          const storageArr = resArr[1].replace(/\s+/g, ' ').split(' ')

          event.reply('device:storage:reply', {
            internalTotalStorage: formatStorage(storageArr[1]),
            internalUsedStorage: formatStorage(storageArr[2]),
            internalFreeStorage: formatStorage(storageArr[3])
          })
        }
      })
    // TODO sdCard大小
  })

  ipcMain.on('device:subject', (event, serial) => {
    const inspection = getByDeviceSerial({
      deviceSerial: serial
    })
    if (inspection) {
      event.reply('device:subject:reply', {
        name: inspection.subjectName,
        phone: inspection.subjectPhone,
        unit: inspection.subjectUnit,
        idCard: inspection.subjectIdCard
      })
    } else {
      event.reply('device:subject:reply', null)
    }
  })

  ipcMain.on('device:meid', (event, serial) => {
    client
      .shell(
        serial,
        "service call iphonesubinfo 1 | cut -c 52-66 | tr -d '.[:space:]'"
      )
      .then(Adb.getAdbkit().util.readAll)
      .then(result => {
        event.reply('device:meid:reply', {
          meid: result.toString('utf8')
        })
      })
  })
}

export default deviceInfo
