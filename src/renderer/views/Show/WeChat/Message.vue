<template>
  <el-container
    ><el-aside width="300px" class="aside">
      <el-menu
        :default-active="defaultActive"
        @select="selectMenuItem"
        class="menu"
      >
        <el-scrollbar
          :style="{
            height: 'calc(100vh - 120px)'
          }"
        >
          <el-menu-item
            :index="talker.username"
            v-for="(talker, i) in talkers"
            :key="i"
          >
            <el-avatar :size="32" :src="talker.avatar" @error="true"
              ><img :src="defaultAvatarUrl"
            /></el-avatar>
            <span style="margin-left:5px;">{{
              (talker.conRemark ? talker.conRemark : talker.nickname) +
                '(' +
                talker.count +
                ')'
            }}</span>
          </el-menu-item>
        </el-scrollbar>
      </el-menu></el-aside
    >
    <el-main class="main">
      <div class="main-block">
        <el-scrollbar
          ref="myScrollbar"
          :style="{
            height: 'calc(100vh - 165px)'
          }"
        >
          <div v-for="(message, index) in messageData" :key="index">
            <div>
              <div v-if="message.isTips" class="tips">
                <div class="tips-bubble">
                  <span>{{ message.content }}</span>
                </div>
                <div class="tips-time">
                  <span>{{ formatTime(message.createTime) }}</span>
                </div>
              </div>
              <el-row
                type="flex"
                justify="start"
                v-if="message.isSend === 0 && !message.isTips"
                class="chat-row"
              >
                <el-avatar
                  :size="40"
                  :src="
                    contactsType === 2 ? message.talker.avatar : talker.avatar
                  "
                  @error="true"
                  ><img :src="defaultAvatarUrl"
                /></el-avatar>
                <div class="chat-info">
                  <span>{{
                    contactsType === 2
                      ? message.talker.conRemark
                        ? message.talker.conRemark
                        : message.talker.nickname
                      : talker.displayName
                  }}</span>
                  <div class="bubble">
                    <bubble :message="message" />
                  </div>
                  <span class="chat-time">{{
                    formatTime(message.createTime)
                  }}</span>
                </div>
              </el-row>
              <el-row
                type="flex"
                justify="end"
                v-if="message.isSend === 1 && !message.isTips"
                class="chat-row-self"
              >
                <div class="chat-info-self">
                  <div class="chat-name-self">{{ self.nickname }}</div>
                  <div class="bubble-self">
                    <bubble :message="message" />
                  </div>
                  <div class="chat-time-self">
                    {{ formatTime(message.createTime) }}
                  </div>
                </div>
                <el-avatar :size="40" :src="self.avatar" @error="true"
                  ><img :src="defaultAvatarUrl"
                /></el-avatar>
              </el-row>
            </div>
          </div>
        </el-scrollbar>
        <div class="page-block">
          <el-pagination
            :small="true"
            background
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="sizes"
            :page-size="params.size"
            layout="prev, pager, next, jumper, sizes, total"
            :total="talker.count"
            :current-page="params.current"
            v-if="isPagination"
          ></el-pagination>
        </div>
      </div> </el-main
  ></el-container>
</template>

<script>
import { ipcRenderer } from 'electron'
import { formatTime } from '../../../utils/format'
import Bubble from './components/Bubble'
export default {
  name: 'WeChatMessage',
  components: { Bubble },
  data() {
    return {
      sizes: [10, 20, 30, 40, 100],
      defaultActive: '',
      messageData: [],
      talkers: [],
      talker: {
        name: '',
        avatar: '',
        displayName: '',
        count: 0
      },
      self: '',
      isPagination: false,
      defaultAvatarUrl: require('../../../assets/avatar/people.png'),
      weChatUserId: '',
      contactsType: 0, //0为好友，3为公众号，2为群聊
      params: { userId: '', talker: '', contactsType: '', size: 10, current: 1 }
    }
  },
  watch: {
    '$route.query': {
      handler: function(val) {
        this.init()
      },
      deep: true
    },
    params: {
      handler: function() {
        this.$refs.myScrollbar.wrap.scrollTop = 0
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    formatTime,
    init() {
      this.weChatUserId = 1
      const talkerParams = {
        userId: this.weChatUserId,
        contactsType: this.contactsType
      }
      ipcRenderer.once('show:weChat:message:talkers:reply', (event, result) => {
        this.self = result.user
        this.talkers = result.talkers
        if (this.talkers.length > 0) {
          this.isPagination = true
          this.$nextTick(() => {
            this.defaultActive = this.talkers[0].username
          })
          this.selectMenuItem(this.talkers[0].username)
        } else {
          this.isPagination = false
          this.defaultActive = ''
          this.messageData = []
          this.talker = {
            name: '',
            avatar: '',
            displayName: '',
            count: 0
          }
        }
        this.getMessage()
      })
      ipcRenderer.send('show:weChat:message:talkers', talkerParams)
    },
    selectMenuItem(username) {
      this.talker.name = username
      for (let i = 0; i < this.talkers.length; i++) {
        if (this.talkers[i].username === this.talker.name) {
          this.talker.displayName = this.talkers[i].conRemark
            ? this.talkers[i].conRemark
            : this.talkers[i].nickname
          this.talker.avatar = this.talkers[i].avatar
          this.talker.count = this.talkers[i].count
          break
        }
      }
      this.params.current = 1
      this.params.size = 10
      this.getMessage()
    },
    getMessage() {
      this.params.userId = this.weChatUserId
      this.params.talker = this.talker.name
      this.params.contactsType = this.contactsType
      ipcRenderer.once('show:weChat:message:reply', (event, result) => {
        this.messageData = result
      })
      ipcRenderer.send('show:weChat:message', this.params)
    },
    handleCurrentChange(val) {
      this.params.current = val
      this.getMessage()
    },
    handleSizeChange(val) {
      this.params.size = val
      this.params.current = 1
      this.getMessage()
    },
    handleErrorAvatar(error) {
      error.srcElement.src = this.defaultAvatarUrl
    }
  }
}
</script>

<style scoped>
.aside {
  margin: 0px 10px 0px 0px;
}
.main {
  display: flex;
  padding: 0px;
}
.main-block {
  padding: 10px 0px 5px 0px;
  background-color: #f6f6f6;
  border: dashed 1px #cccccc;
  width: calc(100vw - 300px);
}
.page-block {
  text-align: center;
  margin-top: 2px;
}
.el-menu {
  border-right: 0 !important;
}
.el-menu-item {
  height: 42px;
  line-height: 42px;
}

.tips {
  margin: 0px 10px 20px 10px;
  text-align: center;
}
.tips-bubble {
  word-break: break-all;
  border-radius: 4px;
  background-color: #ffff;
  font-size: 14px;
  color: #333333;
  padding: 10px 15px;
  display: inline-block;
}
.tips-time {
  font-size: 12px;
  color: #999999;
}
.bubble {
  font-size: 14px;
  color: #333333;
  word-break: break-all;
  max-width: 330px;
  top: 10px;
  left: 20px;
  border-radius: 0px 4px 4px 4px;
  position: relative;
  background-color: #ffff;
  padding: 10px 15px;
  width: fit-content;
}
.bubble::before {
  content: '';
  width: 0;
  height: 0;
  border: 10px solid;
  border-left: 20px solid;
  position: absolute;
  top: 0px;
  left: -20px;
  border-color: #ffff #ffff transparent transparent;
}

.bubble-self {
  font-size: 14px;
  color: #ffff;
  word-break: break-all;
  max-width: 330px;
  border-radius: 4px 0px 4px 4px;
  position: relative;
  background-color: #1890ff;
  padding: 10px 15px;
  margin-right: 20px;
  display: inline-flex;
}
.bubble-self::before {
  content: '';
  width: 0;
  height: 0;
  border: 10px solid;
  border-right: 20px solid;
  position: absolute;
  top: 0px;
  right: -20px;
  border-color: #1890ff transparent transparent #1890ff;
}
.bubble-self > div {
  text-align: start;
}
.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
.chat-name-self {
  margin-bottom: 10px;
}
.chat-info {
  font-size: 14px;
  margin-top: 5px;
  margin-left: 10px;
}
.chat-info-self {
  font-size: 14px;
  margin-top: 5px;
  margin-right: 10px;
  text-align: end;
}
.chat-row {
  margin-left: 10px;
  margin-bottom: 27px;
}
.chat-row-self {
  margin-right: 10px;
  margin-bottom: 20px;
  position: relative;
}
.chat-time {
  font-size: 12px;
  color: #999999;
  margin-left: 20px;
  position: relative;
  top: 10px;
}
.chat-time-self {
  font-size: 12px;
  color: #999999;
  margin-right: 20px;
}
</style>
