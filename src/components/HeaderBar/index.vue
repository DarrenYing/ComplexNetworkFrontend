<template>
  <div>
    <el-row type="flex" align="middle" class="header-row" :gutter="10">
      <el-col :span="2">网络聚集系数：</el-col>
      <el-col :span="1" class="left">{{ clusteringCoefficient }}</el-col>
      <el-col :span="3">平均最短路径长度：</el-col>
      <el-col :span="1" class="left">{{ averageShortestPathLength }}</el-col>
      <el-col :span="3">网络核数：</el-col>
      <el-col :span="1" class="left">{{ coreness }}</el-col>
      <el-col :span="10" class="right button-group">
        <label class="label">请输入攻击数量:</label>
        <el-input v-model="attacked_times" class="inline-input"></el-input>
        <el-tooltip content="随机删除一个节点" placement="top-start">
          <el-button type="warning" style="margin-right: 1vw" @click="attack('random')">随机攻击</el-button>
        </el-tooltip>
        <el-tooltip content="删除度数最大的节点" placement="top-start">
          <el-button type="danger" style="margin-right: 1vw" @click="attack('intention')">蓄意攻击</el-button>
        </el-tooltip>
        <el-tooltip content="恢复初始图数据" placement="top-start">
          <el-button type="success" @click="retrieve">重置</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" class="header-row" :gutter="10">
      <el-tooltip content="最大连通子图中节点的个数占原先最大连通子图节点个数的比例" placement="top-start">
        <el-col :span="2">鲁棒性分析：</el-col>
      </el-tooltip>
      <el-col :span="1" class="left">{{ connectionRatio }}</el-col>
      <el-col :span="2">被攻击节点：</el-col>
      <el-col :span="2" class="left">{{ attackedNode.name }}</el-col>
      <el-col :span="2">被攻击节点度数：</el-col>
      <el-col :span="1" class="left">{{ attackedNode.degree }}</el-col>
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
<!--    <el-row type="flex" align="middle" class="header-row" :gutter="10">-->
<!--      <el-col :span="2" style="max-width: 100px">-->
<!--&lt;!&ndash;        <label class="label"></label>&ndash;&gt;-->
<!--        节点的度-->
<!--      </el-col>-->
<!--      <el-col :span="3">-->
<!--        <el-input-->
<!--          placeholder="min"-->
<!--          suffix-icon="el-icon-arrow-down"-->
<!--          v-model="form.minDegree">-->
<!--        </el-input>-->
<!--      </el-col>-->
<!--      <el-col :span="3">-->
<!--        <el-input-->
<!--          placeholder="max"-->
<!--          suffix-icon="el-icon-arrow-up"-->
<!--          v-model="form.maxDegree">-->
<!--        </el-input>-->
<!--      </el-col>-->
<!--      <el-col :span="1"></el-col>-->
<!--      <el-col :span="2">-->
<!--        <el-button type="primary" @click="submit">筛选</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import {attackNetwork, getNetAttr, retrieveNetwork} from "@/api/dashboard";
import RelationGraph from "@/global/graph";
import Bus from "@/utils/bus";

export default {
  name: "index",
  data() {
    return {
      clusteringCoefficient: 0,
      averageShortestPathLength: 0,
      coreness: 0,

      // attack
      connectionRatio: 1, // 最大连通子图中节点的个数占原先最大连通子图节点个数的比例
      attacked_times: 1,  // 攻击次数
      attackedNode: {
        degree: '',
        name: '',
      },   // 被攻击删除的节点

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

    attack(method) {
      let params = {
        'method': method,
        'attacked_times': this.attacked_times,
      }
      attackNetwork(params).then(res => {
        let data = res.data
        console.log(data)
        this.clusteringCoefficient = data['new_network']['net_clustering_coefficient']
        this.coreness = data['new_network']['net_coreness']
        this.averageShortestPathLength = data['new_network']['average_shortest_path_length']
        this.connectionRatio = data['robust_evaluation']['connection_ratio']
        // 赋值前先重置
        this.attackedNode = {
          degree: '',
          name: '',
        };
        let nodes = data['robust_evaluation']['attacked_nodes']
        nodes.forEach(node => {
          this.attackedNode.name += node['attacked_node_name'] + ', '
          this.attackedNode.degree += node['attacked_node_degree'] + ', '
        })
        // this.attackedNode.name = data['robust_evaluation']['attacked_nodes'][0]['attacked_node_name']
        // this.attackedNode.degree = data['robust_evaluation']['attacked_nodes'][0]['attacked_node_degree']
        // 重新获取图数据
        Bus.$emit('fetch-graph-data');
        // 重新绑定事件
        // setTimeout(() => {
        //   Bus.$emit('bound-event');
        // }, 200);
      })
    },

    retrieve() {
      retrieveNetwork().then(res => {
        // 重新获取图数据
        Bus.$emit('fetch-graph-data');
        // 重新获取参数
        this.fetchData();
        // 重置攻击相关参数
        this.reset();
      }).catch(err => {console.log(err)})
    },

    reset() {
      this.attackedNode = {
        degree: '',
        name: '',
      };
      this.connectionRatio = 1;
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
  font: inherit;
  margin-right: 10px;
}

.inline-input {
  width: 80px;
  margin-right: 1vw;
}

</style>
