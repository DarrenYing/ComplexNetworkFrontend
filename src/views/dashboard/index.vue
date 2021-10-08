<template>
  <div class="dashboard-container">
    <!--顶部工具栏-->
    <div>
      <header-bar></header-bar>
    </div>
    <div class="main">
      <div id="mainGraph"></div>
      <!--右侧工具栏-->
      <div class="config">
        <config-panel v-if="isReady"/>
      </div>
    </div>

  </div>
</template>

<script>
import {getGraphData} from "@/api/dashboard";
import ConfigPanel from "@/components/ConfigPanel";
import HeaderBar from "@/components/HeaderBar";
import RelationGraph from "@/global/graph";

export default {
  name: 'Dashboard',
  components: {
    ConfigPanel,
    HeaderBar,
  },
  data() {
    return {
      isReady: false,
    }
  },
  computed: {
  },
  methods: {
    fetchData() {
      // 获取数据
      getGraphData().then(res => {
        let data = res.data;
        data['nodes'].forEach((item) => {
          item.id = String(item.id)
        })
        console.log(data)
        // this.initGraph(data);
        this.init(data);
      })
    },

    init(data) {
      this.graph = RelationGraph.init(data);
      this.graph.render();
      this.isReady = true;
    },

    resize(graph, container) {
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
      }
    }

  },

  mounted() {
    this.fetchData();
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }

}

.main {
  display: flex;
  align-items: flex-start;
  height: 80vh;
}

#mainGraph {
  width: 65vw;
  height: 100%;
  display: inline-block;
}

.config {
  //box-sizing: border-box;
  display: inline-block;
  width: 20vw;
  //height: 500px;
  padding: 0 10px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

</style>
