<template>
  <div class="extract-process">
    <div class="extract-process-block">
      <div>
        <el-progress
          type="circle"
          :percentage="percentage"
          :width="250"
          :stroke-width="8"
        ></el-progress>
      </div>
      <div class="title">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'ExtractProcess',
  data() {
    return {
      params: {
        path: '',
        type: ''
      },
      percentage: 0,
      message: ''
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    ipcRenderer.removeAllListeners('extact:progress')
  },
  methods: {
    init() {
      this.params = this.$route.query
      ipcRenderer.once('extract:data:reply', (event, result) => {
        console.log(result)
      })
      ipcRenderer.send('extract:data', this.params)
      ipcRenderer.on('extract:progress', (event, result) => {
        this.percentage = result.percentage
        this.message = result.message
      })
    }
  }
}
</script>
<style scoped>
.extract-process {
  text-align: center;
}
.extract-process-block {
  margin-top: 150px;
}
.title {
  color: #1890ff;
  margin-top: 10px;
  font-size: 18px;
}
</style>
