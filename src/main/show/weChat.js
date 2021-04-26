import {
  getByUserIdAndContactsType,
  getByTalkerAndUserId
} from '../db//weChat/message'
import {
  getByUserIdAndUserName as getWeChatContactByUserIdAndUserName
} from '../db/weChat/contacts'
import { getById } from '../db/weChat/user'

const weChatMessageTips = {
  10000: [
    'xxx撤回了一条消息',
    'xxx与群里其他人都不是微信朋友关系，请注意隐私安全',
    '当前群聊人数较多，已显示群成员昵称，你可在聊天信息页中将其关闭。',
    'xxx完成了群公告',
    'xxx领取了xxx的红包'
  ],
  570425393: ['xxx已成为新群主', 'xxx邀请xxx加入了群聊', 'xxx修改群名为xxx'],
  889192497: 'xxx拍了拍xxx',
  922746929: 'xxx拍了拍xxx',
  64: ['xxx发起了语音通话', '语音通话已经结束']
}
// eslint-disable-next-line no-unused-vars
const weChatMessageType = {
  1: '文字',
  49: ['word文件', '公众号转发内容', 'xxx和xxx的聊天记录'],
  3: '图片',
  1048625: '表情包',
  47: '表情包',
  822083633: '引用',
  42: '名片',
  436207665: '普通红包',
  469762097: '拜年红包',
  43: '视频',
  48: '发送位置',
  34: '语音',
  805306417: '接龙',
  '-1879048186': '发起位置共享',
  50: '语音、视频通话',
  419430449: '转账',
  285212721: '公众号消息',
  318767153: '微信支付凭证、缴费结果通知'
}

const weChat = {
  handleWeChatMessageTalkers: (params) => {
    const talkers = getByUserIdAndContactsType(params)
    const user = getById({ id: params.userId })
    return { talkers, user }
  },
  handleWeChatMessage: (params) => {
    let messages = getByTalkerAndUserId(params)
    var parseString = require('xml2js').parseString
    messages.forEach((message) => {
      let isTips = weChatMessageTips.hasOwnProperty(message.type)
      if (!isTips) {
        if (
          (params.contactsType === 2 && message.isSend === 0) ||
          message.type === 43 ||
          message.type === 34
        ) {
          let index = message.content.indexOf(':')
          message.talker = getWeChatContactByUserIdAndUserName({
            userId: params.userId,
            username: message.content.substring(0, index)
          })
          message.content = message.content.substring(index + 1)
        }
        if (message.type === 49) {
          parseString(message.content, function(err, result) {
            let appname = ''
            if (result.msg.appinfo) {
              appname = result.msg.appinfo[0].appname[0]
            }
            let title = result.msg.appmsg[0].title[0]
            let des = result.msg.appmsg[0].des[0]
            message.content = {
              appname: appname,
              title: title,
              des: des
            }
            if (result.msg.appmsg[0].appattach[0].totallen) {
              Object.assign(message.content, {
                totallen: result.msg.appmsg[0].appattach[0].totallen[0]
              })
            }
            if (result.msg.appmsg[0].sourcedisplayname) {
              Object.assign(message.content, {
                sourceDisplayName: result.msg.appmsg[0].sourcedisplayname[0]
              })
            }
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 822083633) {
          parseString(message.content, function(err, result) {
            let title = result.msg.appmsg[0].title[0]
            let displayName = result.msg.appmsg[0].refermsg[0].displayname
            let content = result.msg.appmsg[0].refermsg[0].content[0]
            message.content = {
              title: title,
              displayName: displayName,
              content: content
            }
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 42) {
          parseString(message.content, function(err, result) {
            let nickname = result.msg.$.nickname
            let headImgUrl = result.msg.$.bigheadimgurl
            message.content = {
              nickname: nickname,
              headImgUrl: headImgUrl
            }
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 436207665 || message.type === 469762097) {
          parseString(message.content, function(err, result) {
            let senderTitle = result.msg.appmsg[0].wcpayinfo[0].sendertitle[0]
            let title = result.msg.appmsg[0].title[0]
            message.content = {
              senderTitle: senderTitle,
              title: title
            }
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 48) {
          parseString(message.content, function(err, result) {
            let label = result.msg.location[0].$.label
            let poiName = result.msg.location[0].$.poiname
            let longitude = result.msg.location[0].$.y
            let latitude = result.msg.location[0].$.x
            message.content = {
              label: label,
              poiName: poiName,
              latitude: latitude,
              longitude: longitude
            }
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 805306417) {
          parseString(message.content, function(err, result) {
            message.content = result.msg.appmsg[0].title[0]
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === -1879048186) {
          parseString(message.content, function(err, result) {
            message.content = result.msg.appmsg[0].title[0]
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 419430449) {
          parseString(message.content, function(err, result) {
            let type = result.msg.appmsg[0].wcpayinfo[0].paysubtype[0]
            let title = result.msg.appmsg[0].title[0]
            let money = result.msg.appmsg[0].wcpayinfo[0].feedesc[0]
            message.content = {
              type: type,
              title: title,
              money: money
            }
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 318767153) {
          parseString(message.content, function(err, result) {
            let title = result.msg.appmsg[0].title[0]
            let des = result.msg.appmsg[0].des[0]
            message.content = {
              title: title,
              des: des
            }
            if (err) {
              console.log(err)
            }
          })
        }
      } else {
        if (message.type === 570425393) {
          let index = message.content.indexOf(':')
          message.content = message.content.substring(index + 1)
          parseString(message.content, function(err, result) {
            let str =
              result.sysmsg.sysmsgtemplate[0].content_template[0].template[0]
            let links =
              result.sysmsg.sysmsgtemplate[0].content_template[0].link_list[0]
                .link
            links.forEach((link) => {
              let replaceStr = link.$.name
              if (link.$.type === 'link_profile') {
                let members = link.memberlist[0].member
                let separator = '、'
                if (link.hasOwnProperty('separator')) {
                  separator = link.separator
                }
                let nicknameStr = ''
                members.forEach((member) => {
                  let nickname = member.nickname[0]
                  nicknameStr += nickname + separator
                })
                str = str.replace(
                  '$' + replaceStr + '$',
                  nicknameStr.substr(0, nicknameStr.length - 1)
                )
              } else if (link.$.type === 'link_plain') {
                let plain = link.plain[0]
                str = str.replace('$' + replaceStr + '$', plain)
              }
            })
            message.content = str
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 889192497) {
          parseString(message.content, function(err, result) {
            let str = result.patMsg.records[0].record[0].template[0]
            let fromUserName = result.patMsg.records[0].record[0].fromUser[0]
            let pattedUserName =
              result.patMsg.records[0].record[0].pattedUser[0]
            let fromUser = getWeChatContactByUserIdAndUserName({
              userId: params.userId,
              username: fromUserName
            })
            let pattedUser = getWeChatContactByUserIdAndUserName({
              userId: params.userId,
              username: pattedUserName
            })
            str = str.replace(
              '${' + fromUserName + '}',
              fromUser.conRemark ? fromUser.conRemark : fromUser.nickname
            )
            str = str.replace(
              '${' + pattedUserName + '}',
              pattedUser.conRemark ? pattedUser.conRemark : pattedUser.nickname
            )
            message.content = str
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 922746929) {
          parseString(message.content, function(err, result) {
            let str =
              result.msg.appmsg[0].patMsg[0].records[0].record[0].template[0]
            let fromUserName =
              result.msg.appmsg[0].patMsg[0].records[0].record[0].fromUser[0]
            let pattedUserName =
              result.msg.appmsg[0].patMsg[0].records[0].record[0].pattedUser[0]
            let fromUser = getWeChatContactByUserIdAndUserName({
              userId: params.userId,
              username: fromUserName
            })
            let pattedUser = getWeChatContactByUserIdAndUserName({
              userId: params.userId,
              username: pattedUserName
            })
            str = str.replace(
              '${' + fromUserName + '}',
              fromUser.conRemark ? fromUser.conRemark : fromUser.nickname
            )
            str = str.replace(
              '${' + pattedUserName + '}',
              pattedUser.conRemark ? pattedUser.conRemark : pattedUser.nickname
            )
            message.content = str
            if (err) {
              console.log(err)
            }
          })
        } else if (message.type === 10000) {
          let index = message.content.indexOf('<_wc_custom_link_ href')
          let redPacketIndex = message.content.indexOf(
            '<_wc_custom_link_ color'
          )
          if (index !== -1) {
            message.content = message.content.substring(0, index) + '群公告'
          } else if (redPacketIndex !== -1) {
            message.content =
              message.content.substring(
                '<img src="SystemMessages_HongbaoIcon.png"/>'.length,
                redPacketIndex
              ) + '红包'
          }
        }
        Object.assign(message, { isTips: isTips })
      }
    })
    return messages
  }
}
export default weChat
