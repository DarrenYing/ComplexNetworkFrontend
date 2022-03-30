<template>
  <div class="app-container">
    <el-header class="title">{{ title }}</el-header>
    <el-row type="flex" align="middle" class="header-row" :gutter="10">
      <el-col :span="4" style="height: 40px; line-height: 40px;">
        <el-radio v-model="isWeighted" label="unweighted">无权重</el-radio>
        <el-radio v-model="isWeighted" label="weighted">有权重</el-radio>
      </el-col>
      <el-col :span="4" style="height: 40px">
        <label class="label">概率:</label>
        <el-input v-model="possibility" class="inline-input" :disabled="isWeighted === 'weighted'"></el-input>
      </el-col>
      <el-col :span="6" style="height: 40px">
        <label class="label">模拟次数:</label>
        <el-input-number v-model="epochs" :step="1" :min="3" :max="30"></el-input-number>
      </el-col>
      <el-col :span="4">
        <el-button type="success" size="middle" @click="submit">提交</el-button>
      </el-col>
    </el-row>
    <div
      v-loading="loading"
      element-loading-text="别催了别催了，在画了..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="echarts-canvas"
      id="lineChart">
    </div>
  </div>
</template>

<script>
import {getInfluenceChartData} from "@/api/analysis";

export default {
  name: "InfluenceMaximization",
  data() {
    return {
      title: '影响力最大化分析',
      // 配置参数
      isWeighted: 'unweighted',
      possibility: '0.5',
      epochs: 5,
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

  },
  methods: {
    submit() {
      let p = this.possibility === '' ? '0.5' : this.possibility
      let params = {
        'is_weighted': this.isWeighted,
        'possibility': p,
        'epochs': this.epochs,
      }
      this.loading = true
      getInfluenceChartData(params).then(res => {
        let data = res.data
        this.xAxisLabel = data['x_axis_label']
        this.xAxisName = data['x_axis_name']
        this.yAxisName = data['y_axis_name']
        this.legend = data['legend']
        this.graphData = data['graph_data']
        this.initChart()
        this.loading = false
      })
    },

    initChart() {
      let chartId = 'lineChart';
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

#lineChart {
  width: 80vw;
  height: 60vh;
}

</style>
