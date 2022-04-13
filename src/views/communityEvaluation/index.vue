<template>
  <div class="app-container">
    <el-header class="title">{{ title }}</el-header>
    <div
      v-loading="loading"
      element-loading-text="别催了别催了，在画了..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="echarts-canvas"
      id="communityLineChart">
    </div>
  </div>
</template>

<script>
import {getCommunityChartData} from "@/api/analysis";
import cache from "@/utils/cache";

export default {
  name: "CommunityEvaluation",
  data() {
    return {
      title: '社区划分的质量评估',
      // echarts相关
      xAxisLabel: [],
      graphData: [],
      xAxisName: '',
      yAxisName: '',
      legend: [],
      // 加载
      loading: false,
    }
  },
  mounted() {
    this.loading = true
    if(cache['data']) {
      console.log(cache['data'])
      this.receiveData(cache['data'])
      this.initChart()
      this.loading = false
    }
    else{
      getCommunityChartData().then(res => {
        let data = res.data
        this.setData(data)
        this.receiveData(data)
        this.initChart()
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$message.warning('请重试~')
      })
    }
  },
  methods: {

    receiveData(data) {
      this.xAxisLabel = data['x_axis_label']
      this.xAxisName = data['x_axis_name']
      this.yAxisName = data['y_axis_name']
      this.legend = data['legend']
      this.graphData = data['graph_data']
    },

    setData(data) {
      cache['data'] = data
    },

    initChart() {
      let chartId = 'communityLineChart';
      let chartContainer = document.getElementById(chartId)
      if (document.getElementById(chartId) == null) {
        console.log('该chart元素不存在');
        return
      }
      this.$echarts.dispose(chartContainer); // 需要销毁原来的dom
      let myChart = this.$echarts.init(chartContainer);
      //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
      let resizeMainContainer = function () {
        //div大小
        chartContainer.style.width = '80vw';
        chartContainer.style.height = '80vh';
      };

      window.onresize = () => {
        //屏幕大小自适应，重置容器高宽
        resizeMainContainer();
        myChart.resize();
      };

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: this.legend,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          name: this.xAxisName,
          nameGap: 25,
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 18,
          },
          data: this.xAxisLabel,
        },
        yAxis: {
          type: 'value',
          name: this.yAxisName,
          nameTextStyle: {
            fontSize: 18,
          },
        },
      };
      let series = this.graphData
      option['series'] = series;

      myChart.setOption(option);

    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 20px;
}

.header-row {
  margin: 10px 20px;
  width: 100%;
}

.label {
  font: inherit;
  margin-right: 10px;
}

.inline-input {
  width: 100px;
  margin-right: 1vw;
}

#communityLineChart {
  width: 80vw;
  height: 60vh;
}

</style>
