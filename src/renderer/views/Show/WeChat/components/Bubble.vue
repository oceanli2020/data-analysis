<template>
  <div>
    <img
      :src="message.imgPath"
      class="messageImg"
      v-if="
        message.type === 3 || message.type === 1048625 || message.type === 47
      "
      @error="handleError"
    />
    <div v-else>
      <div v-if="message.type === 1" class="content">
        {{ message.content }}
      </div>
      <div v-if="message.type === 42">
        <el-avatar
          style="float:left;margin-right:10px"
          :size="40"
          :src="message.content.headImgUrl"
          @error="handleErrorAvatar"
        ></el-avatar>
        <span style="font-size: 14px;color: #333333;line-height:40px">
          {{ message.content.nickname }}
        </span>
        <p class="tip">公众号名片</p>
      </div>
      <div v-if="message.type === 49">
        <p class="content">
          {{ message.content.title }}
        </p>
        <p
          v-if="
            message.content.des &&
              (!message.content.totallen || message.content.totallen === '0')
          "
          class="tip"
        >
          {{ message.content.des }}
        </p>
        <p
          v-if="message.content.totallen && message.content.totallen !== '0'"
          class="tip"
        >
          {{ formatBytes(message.content.totallen) }}
        </p>
        <p v-if="message.content.appname" class="tip ">
          {{ message.content.appname }}
        </p>
        <p
          v-if="!message.content.appname && message.content.sourceDisplayName"
          class="tip"
        >
          {{ message.content.sourceDisplayName }}
        </p>
      </div>
      <div v-if="message.type === 822083633">
        <p class="content">
          {{ message.content.title }}
        </p>
        <p class="tip">
          {{ message.content.displayName + ':' + message.content.content }}
        </p>
      </div>
      <div v-if="message.type === 436207665 || message.type === 469762097">
        <span class="red_packet_content">
          <svg-icon
            icon-class="red_packet"
            style="width:40px;height:40px;margin-right:5px"
          />
          {{ message.content.senderTitle }}
        </span>
        <p class="tip">{{ message.content.title }}</p>
      </div>
      <div v-if="message.type === 43">
        <svg-icon icon-class="video" style="width:40px;height:40px" />
        <p class="video_tip ">{{ formatSeconds(message.content) }}</p>
      </div>
      <div v-if="message.type === 48">
        <p class="content">
          {{ message.content.poiName }}
        </p>
        <p class="tip">{{ message.content.label }}</p>
        <p class="tip">
          {{
            formatGps(message.content.latitude) +
              'N' +
              '  ' +
              formatGps(message.content.longitude) +
              'E'
          }}
        </p>
      </div>
      <div v-if="message.type === 34 && message.isSend === 0">
        <span class="voice_content">
          <svg-icon icon-class="voice" style="width:20px;height:20px;" />
          {{ Math.round(message.content / 1000) + '"' }}
        </span>
      </div>
      <div v-if="message.type === 34 && message.isSend === 1">
        <span class="voice_content">
          {{ Math.round(message.content / 1000) + '"' }}
          <svg-icon icon-class="voice" style="width:20px;height:20px;" />
        </span>
      </div>
      <div v-if="message.type === 805306417">
        <p class="content">
          {{ message.content }}
        </p>
      </div>
      <div v-if="message.type === -1879048186">
        <span class="location_content"
          >{{ message.content }}
          <svg-icon
            icon-class="location"
            style="width:20px;height:20px;margin-left:5px"
        /></span>
      </div>
      <div v-if="message.type === 50">
        <span
          v-if="message.content === 'voip_content_video'"
          class="chat_content"
          >视频聊天
          <svg-icon
            icon-class="videoChat"
            style="width:20px;height:20px;margin-left:5px"
        /></span>
        <span v-else class="chat_content"
          >语音聊天
          <svg-icon
            icon-class="voiceChat"
            style="width:20px;height:20px;margin-left:5px"
        /></span>
      </div>
      <div v-if="message.type === 419430449">
        <div class="money_content">
          <svg-icon
            icon-class="money"
            style="width:40px;height:40px;margin-right:5px"
          />
          <span>{{
            message.content.money + ' ' + moneyType[message.content.type]
          }}</span>
        </div>
        <p class="tip">{{ message.content.title }}</p>
      </div>
      <div v-if="message.type === 285212721">
        <span class="content">{{
          getStrContent(message.content, strs.titleStr)
        }}</span>
        <span
          class="content"
          style="margin-top:10px;"
          v-if="message.content.indexOf(strs.titleStr1) !== -1"
          >{{ getStrContent(message.content, strs.titleStr1) }}</span
        >
      </div>
      <div v-if="message.type === 318767153">
        <p class="content">{{ message.content.title }}</p>
        <p style="font-size: 14px;color: #333333;white-space: pre-line;">
          {{ message.content.des }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatBytes } from '../../../../utils/format'
export default {
  name: 'Bubble',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImgUrl: require('../../../../assets/image.png'),
      defaultAvatarUrl: require('../../../../assets/avatar/people.png'),
      moneyType: {
        1: '已被领取',
        3: '已收款'
      },
      officialAccountsMessage: {
        title: '',
        url: '',
        title1: '',
        url1: ''
      },
      strs: {
        titleStr1: '.msg.appmsg.mmreader.category.item1.title',
        titleStr: '.msg.appmsg.mmreader.category.item.title',
        urlStr: '.msg.appmsg.mmreader.category.item.url',
        urlStr1: '.msg.appmsg.mmreader.category.item1.url'
      }
    }
  },
  methods: {
    formatBytes,
    getStrContent(xml, str) {
      let index = xml.indexOf(str)
      let content = ''
      for (let i = index + str.length + 2; i < xml.length; i++) {
        if (xml.charCodeAt(i).toString(16) === '0') {
          break
        }
        content += xml[i]
      }
      return content
    },
    handleError(error) {
      error.srcElement.src = this.defaultImgUrl
    },
    handleErrorAvatar(error) {
      error.srcElement.src = this.defaultAvatarUrl
    },
    formatSeconds(seconds) {
      let h = parseInt(seconds / 3600)
      let m = parseInt((seconds % 3600) / 60)
      let s = Math.ceil(seconds % 60)
      return h + ':' + m + ':' + s
    },
    formatGps(itude) {
      let d = parseInt(itude)
      let m = parseInt((itude - d) * 60)
      let s = (((itude - d) * 60 - m) * 60).toFixed(2)
      return d + '°' + m + "'" + s + '"'
    }
  }
}
</script>

<style scoped>
.content {
  /* font-size: 14px;
  color: #333333; */
}
.tip {
  font-size: 12px;
  color: #707070;
  margin-top: 5px;
}
.video_tip {
  font-size: 12px;
  color: #707070;
  margin-top: 5px;
  text-align: center;
}
.messageImg {
  max-width: 330px;
}
.red_packet_content {
  font-size: 14px;
  color: #333333;
  display: flex;
  line-height: 40px;
}
.voice_content {
  font-size: 14px;
  color: #333333;
  display: flex;
  line-height: 20px;
}
.location_content {
  font-size: 14px;
  color: #333333;
  display: flex;
  line-height: 20px;
}
.chat_content {
  font-size: 14px;
  color: #333333;
  display: flex;
  line-height: 20px;
}
.money_content {
  font-size: 14px;
  color: #333333;
  line-height: 40px;
  display: flex;
}
</style>
