<template>
  <div class="main">
    <div class="block">
      <div ref="echartCloud" class="echarts"></div>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import Echarts from 'echarts'
import 'echarts-wordcloud'
export default {
  name: 'AnalysisData',
  data() {
    return {
      myChartCloud: {},
      wordList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const params = {
        userId: 1,
        contactsType: 0,
        type: 1
      }
      ipcRenderer.once('analysis:weChat:message:reply', (event, result) => {
        this.wordList = []
        this.wordList = result
        this.wordCloud()
      })
      ipcRenderer.send('analysis:weChat:message', params)
    },
    wordCloud() {
      let that = this
      let option = {
        title: {
          text: '',
          x: 'center',
          textStyle: {
            fontSize: 23
          }
        },
        backgroundColor: '#fff',
        // 是否显示数据提示
        tooltip: {
          show: true
        },
        series: [
          {
            name: '', // 数据提示窗标题
            type: 'wordCloud',
            drawOutOfBound: true,
            sizeRange: [12, 50], // 画布范围
            rotationRange: [0, 0], // 数据翻转范围
            shape: 'circle',
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            textStyle: {
              normal: {
                color: function() {
                  return (
                    'rgb(' +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(',') +
                    ')'
                  )
                }
              },
              // 鼠标光标移动到时的阴影
              emphasis: {
                shadowBlur: 1,
                shadowColor: '#333'
              }
            },
            data: this.wordList
          }
        ]
      }
      this.myChartCloud = Echarts.init(that.$refs.echartCloud)
      this.myChartCloud.setOption(option, true)
    }
  }
}
</script>

<style scoped>
.main {
  padding: 10px;
}
.block {
  text-align: center;
  border: 1px solid #cccccc;
  height: 400px;
  padding: 10px;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
