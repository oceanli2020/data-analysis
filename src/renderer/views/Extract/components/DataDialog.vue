<template>
  <div>
    <el-dialog :visible.sync="dialog" width="520px" top="200px">
      <div slot="title">选择文件</div>
      <el-form
        :model="dataForm"
        ref="dataForm"
        label-width="80px"
        size="medium"
      >
        <el-form-item label="文件路径" prop="path">
          <el-input
            v-model="dataForm.path"
            :style="{ width: pathLoading ? '268px' : '287px' }"
            :readonly="true"
          ></el-input>
          <el-button
            plain
            size="medium"
            @click="getExportPath"
            :loading="pathLoading"
            >浏览</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel" plain :loading="pathLoading"
          >取 消</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="determine"
          :loading="pathLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'DataDialog',
  props: {
    type: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      pathLoading: false,
      dialog: false,
      dataForm: {
        path: ''
      }
    }
  },
  methods: {
    toOpen() {
      this.dialog = true
    },
    cancel() {
      this.dialog = false
      this.dataForm.path = ''
    },
    determine() {
      this.dialog = false
      this.dataForm['type'] = this.type
      this.$router.push({
        name: 'ExtractProcess',
        query: this.dataForm
      })
    },
    getExportPath() {
      this.pathLoading = true
      ipcRenderer.once('dialog:file:open:reply', (event, result) => {
        if (result[0]) {
          this.dataForm.path = result[0]
        }
        this.pathLoading = false
      })
      ipcRenderer.send('dialog:file:open')
    }
  }
}
</script>

<style scoped></style>
