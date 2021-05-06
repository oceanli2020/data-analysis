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
    'select talker, isSend, createTime, content, type, imgPath from weChatMessage  where userId = @userId and talker = @talker ' +
    'order by createTime asc LIMIT @size offset (@current - 1) * @size'
  return DB.getInstance()
    .prepare(sql)
    .all(message)
}

export function getByUserId(message) {
  const sql =
    'select m.talker, m.isSend, m.createTime, m.content, m.type, m.imgPath from weChatMessage m '+
    'INNER JOIN  weChatContacts c on m.talker = c.username and c.userId = @userId  ' +
    `where m.userId = @userId and m.type = @type and m.talker = @talker`
  return DB.getInstance()
    .prepare(sql)
    .all(message)
}

export function getByUserIdAndSensitive(message) {
  const bindParam = message.sensitives.join('|')
  const sql =
    `select matches(m.content, '${bindParam}') as sensitive, count(*) as count from weChatMessage m ` +
    'INNER JOIN  weChatContacts c on m.talker = c.username and c.userId = @userId and c.type = @contactsType ' +
    `where m.userId = @userId and m.type = @type and m.content REGEXP '${bindParam}' group by sensitive`
  const prepare = DB.getInstance().prepare(sql)
  return prepare.all(message)
}
