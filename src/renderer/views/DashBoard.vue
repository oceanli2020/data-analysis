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
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/TitleBar'
export default {
  name: 'DashBoard',
  components: {
    TitleBar
  },
  data() {
    return {
      menuDisabled: false,
      activeIndex: '0',
      menuItemList: ['数据提取', '数据展示', '数据分析'],
      menuRouterMap: {
        0: '/extractData',
        1: '/showData',
        2: '/analysisData'
      }
    }
  },
  methods: {
    handleSelect(key) {
      this.$router.push(this.menuRouterMap[key])
    }
  }
}
</script>

<style scoped></style>
