<template>
  <div class="content">
    <div class="divCard">
      <div class="myDiv">
        <div ref="echartCloud" class="echarts"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Echarts from 'echarts'
import 'echarts-wordcloud'
export default {
  name: 'Card',
  data() {
    return {
      myChartCloud: {},
      word_list: [
        { name: '修改', value: 5902 },
        { name: '需求', value: 4444 },
        { name: '阿萨德', value: 5902 },
        { name: '辅导费', value: 5902 },
        { name: '儿去', value: 5902 },
        { name: '好好干', value: 5902 }
      ]
    }
  },
  mounted() {
    this.wordCloud()
  },
  methods: {
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
            data: this.word_list
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
.divCard {
  padding: 0 10px;
  margin: 10px 5px;
}
.myDiv {
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
