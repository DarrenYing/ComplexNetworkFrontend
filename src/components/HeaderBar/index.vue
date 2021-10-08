<template>
  <div>
    <el-row type="flex" align="middle" class="header-row" :gutter="10">
      <el-col :span="2">网络聚集系数：</el-col>
      <el-col :span="1" class="left">{{ clusteringCoefficient }}</el-col>
      <el-col :span="3">平均最短路径长度：</el-col>
      <el-col :span="1" class="left">{{ averageShortestPathLength }}</el-col>
      <el-col :span="2">网络核数：</el-col>
      <el-col :span="1" class="left">{{ coreness }}</el-col>
      <el-col :span="4" class="right button-group">
        <el-tooltip content="随机删除一个节点" placement="top-start">
          <el-button type="warning" style="margin-right: 2vw" @click="randomAttack">随机攻击</el-button>
        </el-tooltip>
        <el-tooltip content="删除度数最大的节点" placement="top-start">
          <el-button type="danger" @click="intentionalAttack">蓄意攻击</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" class="header-row" :gutter="10">
      <el-col :span="2" style="max-width: 100px">
<!--        <label class="label"></label>-->
        节点的度
      </el-col>
      <el-col :span="3">
        <el-input
          placeholder="min"
          suffix-icon="el-icon-arrow-down"
          v-model="form.minDegree">
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-input
          placeholder="max"
          suffix-icon="el-icon-arrow-up"
          v-model="form.maxDegree">
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-button type="primary" @click="submit">筛选</el-button>
      </el-col>
      <el-col :span="4" style="margin-left: 10vw">
        <el-select v-model="layout" placeholder="请选择" @change="setGraphLayout">
          <el-option
            v-for="item in layoutOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {getNetAttr} from "@/api/dashboard";
import RelationGraph from "@/global/graph";

export default {
  name: "index",
  data() {
    return {
      clusteringCoefficient: 0,
      averageShortestPathLength: 0,
      coreness: 0,

      form: {
        minDegree: '',
        maxDegree: '',
      },

      layout: 'circular-degree',
      layoutOptions: [
        {
          value: 'circular-degree',
          label: '环形布局-按度数排序',
        },
        {
          value: 'circular-topology',
          label: '拓扑环形布局',
        },
        {
          value: 'circular-degree-division',
          label: '环形布局-分成8组',
        },
        {
          value: 'circular-PI',
          label: '环形布局-半螺旋线',
        },
        {
          value: 'circular-2PI',
          label: '环形布局-满螺旋线',
        },
        {
          value: 'random',
          label: '随机布局',
        },
        {
          value: 'gForce',
          label: '力导向布局',
        },
        {
          value: 'circular',
          label: '重置布局',
        },
      ],
    }
  },
  methods: {
    fetchData() {
      getNetAttr().then(res => {
        let data = res.data
        this.clusteringCoefficient = data['net_clustering_coefficient']
        this.coreness = data['net_coreness']
        this.averageShortestPathLength = data['average_shortest_path_length']
      }).catch(err => {})
    },
    randomAttack() {
      console.log("randomly remove a node")
    },
    intentionalAttack() {
      console.log("remove the node with the biggest degree")
    },

    submit() {

    },

    // 更换图布局，由于参数不同，只给定有限的几种
    setGraphLayout(layout) {
      console.log(layout)
      const {graph} = RelationGraph;
      switch (layout) {
        case 'circular-topology':
          graph.updateLayout({
            type: 'circular',
            ordering: 'topology',
            divisions: 1,
            startAngle: 0,
            endAngle: Math.PI * 2,
          });
          break;
        case 'circular-degree':
          graph.updateLayout({
            type: 'circular',
            ordering: 'degree',
            divisions: 1,
            startAngle: 0,
            endAngle: Math.PI * 2,
          });
          break;
        case 'circular-degree-division':
          graph.updateLayout({
            type: 'circular',
            ordering: 'degree',
            divisions: 3,
            startAngle: 0,
            endAngle: Math.PI / 2,
          });
          break;
        case 'circular-PI':
          graph.updateLayout({
            type: 'circular',
            radius: null,
            ordering: 'degree',
            divisions: 1,
            startAngle: 0,
            endAngle: Math.PI,
          });
          break;
        case 'circular-2PI':
          graph.updateLayout({
            type: 'circular',
            ordering: 'degree',
            divisions: 1,
            startAngle: 0,
            endAngle: Math.PI * 2,
          });
          break;
        case 'random':
          graph.updateLayout({
            type: 'random',
          });
          break;
        case 'gForce':
          graph.updateLayout({
            type: 'gForce',
          });
          break;
        case 'circular':
          location.reload()
          graph.updateLayout({
            type: 'circular',
          });
          break;
      }
    },

  },

  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.header-row {
  margin: 10px 20px;
  width: 100%;
}

.left {
  alignment: left;
}

.right {
  alignment: right;
}

.button-group {
  margin: 10px 10vw;
}

.label {
  font-size: 16px;
}

</style>
