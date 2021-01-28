<template>
  <div>
    <TitleBar />
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
    return {}
  }
}
</script>

<style scoped></style>
