<template>
  <div class="extract-data">
    <div class="extract-data-block">
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
// import { createNamespacedHelpers } from 'vuex'
// const { mapState, mapActions } = createNamespacedHelpers('show')
export default {
  name: 'ExtractData',
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
  computed: {
    // ...mapState({
    //   menuDisabled: (state) => state.menuDisabled
    // })
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
    // ...mapActions(['setMenuDisabled'])
  }
}
</script>
<style scoped>
.extract-data {
  text-align: center;
}
.extract-data-block {
  margin-top: 150px;
}
.title {
  color: #1890ff;
  margin-top: 10px;
  font-size: 18px;
}
</style>
