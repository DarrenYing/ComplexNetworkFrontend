<template>
  <div>
    <el-row align="middle" class="component-group" :gutter="10">
      <el-col :span="6">边的介数：</el-col>
      <el-col :span="18">{{ edgeBetweenness }}</el-col>
    </el-row>
  </div>
</template>

<script>
import {getEdgeAttr} from "@/api/dashboard";
import Bus from "@/utils/bus";

export default {
  name: "edgeConfig",
  props: {
    id: {
      type: String,
      default: null,
      required: true,
    }
  },
  data() {
    return {
      edgeBetweenness: 0,
    }
  },
  methods: {
    getAttrs(payload) {
      let params = {
        'edge_id': this.id,
        ...payload
      };
      console.log(params)
      getEdgeAttr(params).then(res => {
        let data = res.data;
        this.edgeBetweenness = data['edge_betweenness']
      }).catch(err => {})
    }
  },
  mounted() {
    Bus.$on('edge:get-attr', this.getAttrs);
  }
}
</script>

<style scoped>
.component-group {
  margin-top: 10px;
}
</style>
