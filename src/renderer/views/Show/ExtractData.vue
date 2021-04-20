<template>
  <div class="card">
    <div class="card-block">
      <el-form>
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
import DataDialog from './components/DataDialog'
export default {
  name: 'ExtractData',
  components: { DataDialog },
  data() {
    return {
      type: ''
    }
  },
  methods: {
    extractData(type) {
      this.type = type
      this.$refs.dataDialog.toOpen()
    }
  }
}
</script>

<style scoped>
.card {
  text-align: center;
}
.card-block {
  margin-top: 200px;
}
.extract-button {
  width: 150px;
}
</style>
