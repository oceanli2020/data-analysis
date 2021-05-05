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
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('show')
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
  computed: {
    ...mapState({
      talker: (state) => state.talker
    })
  },
  methods: {
    init() {
      const params = {
        userId: 1,
        contactsType: 2,
        type: 1,
        talker: this.talker
      }
      ipcRenderer.once('analysis:weChat:message:reply', (event, result) => {
        this.wordList = []
        this.wordList = result
        this.wordCloud()
        // console.log(result)
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
        // 背景颜色
        backgroundColor: '#fff',
        // 是否显示数据提示
        tooltip: {
          show: true
        },
        series: [
          {
            name: '', // 数据提示窗标题
            type: 'wordCloud',
            gridSize: 15, // 单词之间的间隔大小
            drawOutOfBound: false, //设置为true以允许部分在画布外部绘制单词
            sizeRange: [12, 60], // 最小字体和最大字体
            rotationRange: [0, 0], // 字体旋转角度的范围
            // triangle三角形，pentagon五角形，star五角星形,circle圆形
            shape: 'circle', // cardioid心形,diamond菱形,square正方形,triangle-forward指向右边的三角形,triangle-upright正三角形
            //跟随左/上/下/宽/高/右/下的位置来定位词云
            //默认放置在中间尺寸为75％x 80％，
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,
            layoutAnimation: true,
            textPadding: 0,
            autoSize: {
              enable: true,
              minSize: 6
            },
            textStyle: {
              // 词云的字体样式与echarts其他的图表设置字体样式类似
              normal: {
                // 随机生成每个单词的颜色
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
  height: calc(100vh - 125px);
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
