import Adb from './adb'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import find from './findPromise'
import tar from 'tar'
import { decodeBackup as decodeHuaweiBackup } from './huawei/decode'
import { decodeBackupFile } from './xiaomi/decode'
import { inspection } from './global'
import cpFile from 'cp-file'
import unpackBackup from './unpackBackup'
import { transfer as copyFile } from '@common/utils/common'
import { exec } from 'child_process'
import util from 'util'
import { getExecPath } from './format'

const TAG = 'utils.decode'

export function decodeBackup(
  type: string,
  serial: string,
  destPath: string,
  password?: string
) {
  if (type === 'huawei') {
    return decodeBackupHuawei(serial, destPath, password).catch(error => {
      console.debug(TAG, error)
      throw Error('decodeBackupError')
    })
  } else if (type === 'xiaomi') {
    return decodeBackupXiaomi(serial, destPath).catch(error => {
      console.debug(TAG, error)
      throw Error('decodeBackupError')
    })
  } else if (type === 'vivo') {
    return decodeBackupVivo(destPath).catch(error => {
      console.debug(TAG, error)
      throw Error('decodeBackupError')
    })
  } else if (type === 'meizu') {
    return decodeBackupMeizu(serial, destPath).catch(error => {
      console.debug(TAG, error)
      throw Error('decodeBackupError')
    })
  }
}

async function decodeBackupHuawei(
  serial: string,
  destPath: string,
  password?: string
) {
  const destFolderPath = path.join(destPath, 'backup')
  const destDecodeFolderPath = path.join(destPath, 'decode')
  let isExistDestPath = false
  try {
    await fs.promises.access(destPath)
    isExistDestPath = true
  } catch (error) {
    isExistDestPath = false
  }
  if (isExistDestPath) {
    return password ? destDecodeFolderPath : destFolderPath
  }

  if (password) {
    const folder = await getEncodeFolder()
    await copyLocalFolder(folder, destFolderPath)
  } else {
    const adb = Adb.getInstance()
    const orgBackupPath1 = '/sdcard/Huawei/Backup/backupFiles1'
    const orgBackupPath2 = '/sdcard/Huawei/Backup/backupFiles'
    const backupFolders1 = await adb.readdir(serial, orgBackupPath1)
    const backupFolders2 = await adb.readdir(serial, orgBackupPath2)
    const length1 = backupFolders1.length
    const tmp1 = backupFolders1.sort((a, b) => a.mtime - b.mtime)
    const folder1 = tmp1[length1 - 1]
    const length2 = backupFolders2.length
    const tmp2 = backupFolders2.sort((a, b) => a.mtime - b.mtime)
    const folder2 = tmp2[length2 - 1]
    let folder = null
    if (
      (folder1 && folder2 && folder1.mtime - folder2.mtime > 0) ||
      (folder1 && !folder2)
    ) {
      folder = `${orgBackupPath1}/${folder1}`
    } else {
      folder = `${orgBackupPath2}/${folder2}`
    }

    await mkdirp(destPath)
    await copyFolder(adb, serial, folder, destFolderPath)
    try {
      await adb.shell(serial, `rm -r ${folder}`)
    } catch (error) {
      console.error(TAG, 'rm backup folder failed')
    }
  }

  if (!password) {
    return destFolderPath
  }

  await decodeHuaweiBackup(destFolderPath, destDecodeFolderPath, password)
  return destDecodeFolderPath
}

async function decodeBackupXiaomi(serial: string, destPath: string) {
  let isExistDestPath = false
  try {
    await fs.promises.access(destPath)
    isExistDestPath = true
  } catch (error) {
    isExistDestPath = false
  }

  if (isExistDestPath) {
    return destPath
  }

  const adb = Adb.getInstance()
  const orgRootPath = '/sdcard/MIUI/backup/AllBackup'
  const backupFolders = await adb.readdir(serial, orgRootPath)
  if (backupFolders.length === 0) {
    return
  }
  const length = backupFolders.length
  const folder =
    orgRootPath +
    '/' +
    backupFolders.sort((a, b) => a.mtime - b.mtime)[length - 1].name

  await mkdirp(destPath)
  await copyFolder(adb, serial, folder, destPath)

  try {
    await adb.shell(serial, `rm -r ${folder}`)
  } catch (error) {
    console.error(TAG, 'rm backup folder failed')
  }
  const files = await find.file(/.*\.bak$/, destPath)
  for (const file of files) {
    const destFolder = path.dirname(file)
    const basename = path.basename(file, path.extname(file))
    const destTarPath = `${destFolder}/${basename}.tar`
    await decodeBackupFile(file, destTarPath)
    await tar.extract({
      cwd: destFolder,
      file: destTarPath
    })
  }
  return destPath
}

async function decodeBackupVivo(destPath: string) {
  let isExist = false
  const appFolderPath = path.join(destPath, 'apps')
  try {
    await fs.promises.access(appFolderPath)
    isExist = true
  } catch (error) {
    isExist = false
  }

  if (isExist) {
    return destPath
  }

  const files = await find.file(/.*\.zip$/, destPath)
  for (const file of files) {
    const destFolder = path.dirname(file)
    const basename = path.basename(file, path.extname(file))
    const destTarPath = `${destFolder}/${basename}.tar`
    await unpackBackup(file, destTarPath)
    await tar.extract({
      cwd: destFolder,
      file: destTarPath
    })
  }
  return destPath
}

async function decodeBackupMeizu(serial: string, destPath: string) {
  let isExistDestPath = false
  try {
    await fs.promises.access(destPath)
    isExistDestPath = true
  } catch (error) {
    isExistDestPath = false
  }

  if (isExistDestPath) {
    return destPath
  }

  const adb = Adb.getInstance()
  const orgRootPath = '/sdcard/backup'
  const backupFiles = (await adb.readdir(serial, orgRootPath)).filter(file =>
    file.name.includes('.zip')
  )
  if (backupFiles.length === 0) {
    return
  }
  const length = backupFiles.length
  const sortBackupFiles = backupFiles.sort((a, b) => a.mtime - b.mtime)
  const backupFileName = sortBackupFiles[length - 1].name
  const backupFilePath = orgRootPath + '/' + backupFileName

  await mkdirp(destPath)
  const transfer = await adb.pull(serial, backupFilePath)
  const destFilePath = path.join(destPath, backupFileName)
  await copyFile(transfer, destFilePath)

  try {
    await adb.shell(serial, `rm -r ${backupFilePath}`)
  } catch (error) {
    console.warn(TAG, 'rm backup file failed')
  }
  await unzip(destFilePath, destPath)

  const folder = path.basename(destFilePath, '.zip')
  const zipsPath = path.join(destPath, folder, 'App')

  // 为了和小米目录结构一致
  const unzipDestPath = path.join(destPath, 'apps')
  await mkdirp(unzipDestPath)

  const files = await find.file(/.*\.zip$/, zipsPath)
  for (const file of files) {
    await unzip(file, unzipDestPath)
  }
  return destPath
}

async function copyFolder(
  adb,
  serial: string,
  orgFolder: string,
  destPath: string
) {
  await mkdirp(destPath)
  const backupFiles = await adb.readdir(serial, orgFolder)
  const sync = await adb.syncService(serial)

  for (const backupFile of backupFiles) {
    const backupFilePath = `${orgFolder}/${backupFile.name}`
    const transfer = sync.pull(backupFilePath)
    const destFilePath = path.join(destPath, backupFile.name)
    await copyFile(transfer, destFilePath)
  }
  sync.end()
}

async function copyLocalFolder(orgFolder: string, destPath: string) {
  await mkdirp(destPath)
  const files = await find.file(/.*/, orgFolder)
  for (const file of files) {
    const destFilePath = path.join(destPath, path.basename(file))
    await cpFile(file, destFilePath)
  }
}

async function getEncodeFolder() {
  const backupPath = path.join(inspection.filePath, 'ZFMSIS', 'Huawei/Backup')
  let folders = await find.dir(
    process.platform === 'win32'
      ? /\\HUAWEI.*\\backupFiles1\\(\d)+/
      : /\/HUAWEI.*\/backupFiles1\/(\d)+/,
    backupPath
  )
  if (folders.length === 0) {
    throw new Error('search backup folder failed')
  }
  // const orgPath = path.join(folders[0], 'backupFiles1')
  // folders = await find.dir(orgPath)
  // console.log(folders)
  // folders = folders.filter(folder => !path.basename(folder).startsWith('.temp'))

  // if (folders.length === 0) {
  //   throw new Error('search backup folder failed')
  // }

  return folders[0]
}

async function unzip(zipFile: string, dist: string) {
  const execPromise = util.promisify(exec)
  const zipExec = process.platform === 'win32' ? '7zg.exe' : '7z'
  const adbPath = path.join(
    getExecPath(),
    'bin',
    process.env.NODE_ENV === 'development'
      ? `${process.platform}/${zipExec}`
      : `${zipExec}`
  )
  try {
    await execPromise(`"${adbPath}" x -y "${zipFile}" -o"${dist}"`)
  } catch (error) {
    console.warn(TAG, error)
  }
}
