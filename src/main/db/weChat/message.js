import DB from '../../utils/database'

export function save(message) {
  const sql =
    'insert into weChatMessage ' +
    '(msgId, type, isSend, createTime, talker, content, imgPath, userId) values ' +
    '(@msgId, @type, @isSend, @createTime, @talker, @content, @imgPath, @userId)'
  return DB.getInstance()
    .prepare(sql)
    .run(message)
}

export function getByUserIdAndContactsType(message) {
  const sql =
    'SELECT c.*, max(m.createTime) time,  COUNT(*) count from weChatMessage m ' +
    'INNER JOIN  weChatContacts c on m.talker = c.username and c.userId = @userId and c.type = @contactsType WHERE m.userId = @userId ' +
    'GROUP BY c.username ORDER BY time DESC'
  return DB.getInstance()
    .prepare(sql)
    .all(message)
}

export function getByTalkerAndUserId(message) {
  const sql =
    'select m.talker, m.isSend, m.createTime, m.content, m.type, m.imgPath from weChatMessage m  where m.userId = @userId and m.talker = @talker ' +
    'order by m.createTime asc LIMIT @size offset (@current - 1) * @size'
  return DB.getInstance()
    .prepare(sql)
    .all(message)
}
