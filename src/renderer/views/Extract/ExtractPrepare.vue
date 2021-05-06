<template>
  <div class="extract-prepare">
    <div class="extract-prepare-block">
      <el-form>
        <el-form-item
          ><el-select v-model="device" placeholder="请连接手机">
            <el-option
              v-for="(item, index) in deviceList"
              :key="index"
              :label="item.manufacturer + ' ' + item.model"
              :value="item.serial"
            >
            </el-option> </el-select
        ></el-form-item>
        <el-form-item
          ><el-button @click="extractData('weChat')" class="extract-button"
            >提取微信数据</el-button
          ></el-form-item
        >
        <el-form-item
          ><el-button @click="extractData('qq')" class="extract-button"
            >提取QQ数据</el-button
          ></el-form-item
        >
      </el-form>
      <data-dialog ref="dataDialog" :type="type"></data-dialog>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import DataDialog from './components/DataDialog'
export default {
  name: 'ExtractPrepare',
  components: { DataDialog },
  data() {
    return {
      type: '',
      deviceList: [],
      device: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      ipcRenderer.once('device:list:reply', (event, result) => {
        this.deviceList = result
        this.device = result[0]
      })
      ipcRenderer.send('device:list')
    },
    extractData(type) {
      this.type = type
      this.$refs.dataDialog.toOpen()
    }
  }
}
</script>

<style scoped>
.extract-prepare {
  text-align: center;
}
.extract-prepare-block {
  margin-top: 200px;
}
.extract-button {
  width: 217px;
}
</style>
