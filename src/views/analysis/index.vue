<template>
  <div class="app-container">
    <el-header class="title">{{ title }}</el-header>
    <div class="echarts-canvas" id="barChart"></div>
  </div>
</template>

<script>
import {getChartData} from "@/api/analysis";

export default {
  name: "NodeDegreeDistribution",
  data() {
    return {
      title: '节点度分布图',
      xAxisLabel: [],
      graphData: [],
      xAxisName: '',
      yAxisName: '',
      legend: [],
    }
  },
  mounted() {
    getChartData().then(res => {
      let data = res.data;
      this.xAxisLabel = data['x_axis_label'];
      this.graphData = data['graph_data'];
      this.xAxisName = data['x_axis_name'];
      this.yAxisName = data['y_axis_name'];
      this.initChart();
    })
  },

  methods: {
    initChart() {
      let chartId = 'barChart';
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
          data: this.legend
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
      let series = [
        {
          data: this.graphData,
          type: 'bar',
          label: {
            show: true,
            formatter: function (params) {
              if (params.value > 0) {
                return params.value;
              } else {
                return '';
              }
            },
          },
          barMaxWidth: '25%',
        }
      ];
      option['series'] = series;

      myChart.setOption(option);

    }
  },


}
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 20px;
}

#barChart {
  width: 80vw;
  height: 60vh;
}
</style>

