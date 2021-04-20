<template>
  <div>
    <TitleBar />
    <el-menu
      mode="horizontal"
      :default-active="activeIndex"
      @select="handleSelect"
      ><el-menu-item
        :index="index.toString()"
        v-for="(item, index) in menuItemList"
        :key="index"
        :disabled="menuDisabled"
        >{{ item }}</el-menu-item
      ></el-menu
    >
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/TitleBar'
export default {
  name: 'Show',
  components: {
    TitleBar
  },
  data() {
    return {
      menuDisabled: false,
      activeIndex: '0',
      menuItemList: ['数据提取', '数据展示', '数据分析'],
      menuRouterMap: {
        0: 'ExtractData',
        1: 'ShowData',
        2: 'AnalysisData'
      }
    }
  },
  methods: {
    handleSelect(key) {
      this.$router.push({ name: this.menuRouterMap[key] })
    }
  }
}
</script>

<style scoped></style>
