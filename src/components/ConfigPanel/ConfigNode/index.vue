<template>
  <div>
    <el-row align="middle" class="component-group" :gutter="10">
      <el-col :span="6">节点的度：</el-col>
      <el-col :span="18">{{ nodeDegree }}</el-col>
    </el-row>
    <el-row align="middle" class="component-group" :gutter="10">
      <el-col :span="6">聚集系数：</el-col>
      <el-col :span="18">{{ nodeClusteringCoefficient }}</el-col>
    </el-row>
    <el-row align="middle" class="component-group" :gutter="10">
      <el-col :span="6">节点介数：</el-col>
      <el-col :span="18">{{ nodeBetweenness }}</el-col>
    </el-row>
    <el-row align="middle" class="component-group" :gutter="10">
      <el-col :span="6">节点核数：</el-col>
      <el-col :span="18">{{ nodeCoreness }}</el-col>
    </el-row>
  </div>
</template>

<script>
import {getNodeAttr} from "@/api/dashboard";
import Bus from "@/utils/bus";

export default {
  name: "nodeConfig",
  props: {
    id: {
      type: String,
      default: null,
      required: true,
    }
  },
  data() {
    return {
      nodeDegree: 0,
      nodeClusteringCoefficient: 0,
      nodeBetweenness: 0,
      nodeCoreness: 0,
    }
  },

  methods: {
    getAttrs() {
      console.log(this.id)
      let params = {
        'node_id': this.id,
      };
      getNodeAttr(params).then(res => {
        let data = res.data;
        this.nodeDegree = data['node_degree'];
        this.nodeClusteringCoefficient = data['node_clustering_coefficient']
        this.nodeBetweenness = data['node_betweenness']
        this.nodeCoreness = data['node_coreness']
      }).catch(err => {})
    },

  },
  mounted() {
    Bus.$on('node:get-attr', this.getAttrs);
  }
}
</script>

<style scoped>
.component-group {
  margin-top: 10px;
}
</style>
