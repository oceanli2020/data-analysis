<template>
  <div class="home">
    <TitleBar />
    <div class="home-block">
      <div>
        <span class="title">hello! ocean li</span>
      </div>
      <div class="start-block">
        <el-link style="font-size:20px;" type="primary" @click="start"
          >start</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import TitleBar from '../components/TitleBar'
export default {
  name: 'HomePage',
  components: {
    TitleBar
  },
  data() {
    return {}
  },
  methods: {
    start() {
      this.$router.push('/show')
    }
  }
}
</script>

<style scoped>
.home-block {
  text-align: center;
  margin-top: 270px;
}
.title {
  font-size: 30px;
}
.start-block {
  margin-top: 10px;
}
</style>
