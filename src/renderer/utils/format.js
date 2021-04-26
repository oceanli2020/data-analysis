import moment from 'moment'

export function formatTime(time, str) {
  if (!time || time === 0) {
    return ''
  } else if (str) {
    return moment(time).format(str)
  } else {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }
}
export function formatDuration(duration) {
  if (duration === 0 || !duration) {
    return ''
  } else {
    const hours = moment.duration(duration).hours()
    const minutes = moment.duration(duration).minutes()
    const seconds = moment.duration(duration).seconds()
    let durationTime = ''
    if (hours !== 0) {
      durationTime += hours + 'h '
    }
    if (minutes !== 0) {
      durationTime += minutes + 'min '
    }
    if (seconds !== 0) {
      durationTime += seconds + 's '
    }
    return durationTime
  }
}

export function formatShowText(showText, keyList) {
  const keys = []
  for (let key of keyList) {
    keys.push(
      key.replace(/[`~!@#$%^&*()_\\\-+=<>?:"{}|,.;'/[\]]/g, '\\$&')
    )
  }
  const reg = keys.join('|')
  showText = showText.replace(
    RegExp(`(${reg})`, 'g'),
    '<span style="color:red;">$&</span>'
  )
  return showText
}


export function formatBytes(bytes, decimals = 2, type) {
  if (bytes === null || bytes === undefined || bytes === 0) return '-'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  if (type) {
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  } else {
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
}
