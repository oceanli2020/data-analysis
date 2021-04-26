import DB from '../../utils/database'

export function save(contacts) {
  const sql =
    'insert into weChatContacts ' +
    '(username, alias, nickname, avatar, conRemark, type, userId) values ' +
    '(@username, @alias, @nickname, @avatar, @conRemark, @type, @userId)'
  return DB.getInstance()
    .prepare(sql)
    .run(contacts)
}

export function getByUserIdAndUserName(contacts) {
  const sql =
    'select * from weChatContacts where userId = @userId and username = @username '
  return DB.getInstance()
    .prepare(sql)
    .get(contacts)
}
