<template>
  <div class="config">
    <config-node v-show="type === 'node'" :id="id" />
    <config-edge v-show="type === 'edge'" :id="id" />
  </div>
</template>

<script>
import RelationGraph from "@/global/graph";
import Bus from "@/utils/bus";
import ConfigNode from "./ConfigNode";
import ConfigEdge from "./ConfigEdge";

export default {
  name: 'Index',
  components: {
    ConfigNode,
    ConfigEdge,
  },
  data() {
    return {
      id: '',
      type: '',
    }
  },
  methods: {
    boundEvent() {
      const {graph} = RelationGraph;
      graph.on('node:click', (e) => {
        this.id = e.item['_cfg'].id;
        this.type = 'node';
        setTimeout(() => {
          Bus.$emit('node:get-attr');
        }, 200) // set a delay
      });

      graph.on('edge:click', (e) => {
        let sourceId = e.item['_cfg']['source']['_cfg']['id']
        let targetId = e.item['_cfg']['target']['_cfg']['id']
        this.id = e.item['_cfg'].id
        this.type = 'edge';
        let payload = {
          'source_id': sourceId,
          'target_id': targetId,
        }
        setTimeout(() => {
          Bus.$emit('edge:get-attr', payload);
        }, 200) // set a delay
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this.boundEvent();
    }, 200)
  },
}
</script>

<style lang="scss" scoped>
.config {
  line-height: 32px;
  margin: 8px 0;
}

</style>

