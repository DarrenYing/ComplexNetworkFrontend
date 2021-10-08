// 创建图

import G6 from "@antv/g6";
import tooltip from "@/global/tooltip";
import Bus from "@/utils/bus";

export default class RelationGraph {
  static init(graphData) {
    const container = document.getElementById('mainGraph');
    const width = container.scrollWidth;
    console.log(container.scrollHeight)
    const height = container.scrollHeight || 500;
    this.graph = new G6.Graph({
      container: container,
      width: width,
      height,
      plugins: [tooltip],
      modes: {
        default: [
          'drag-canvas',
          'drag-node',
          'zoom-canvas',
        ],
      },
      layout: {
        type: 'circular',
        ordering: 'degree',
      },
      animate: true,
      // 默认节点样式
      defaultNode: {
        size: 4,
        style: {},
      },
      // 默认边的样式
      defaultEdge: {
        style: {
          stroke: '#000',
          lineWidth: 2,
          lineAppendWidth: 6,
          endArrow: true,
        }
      },
      // 节点不同状态下的样式集合
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: 'lightsteelblue',
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        click: {
          stroke: '#000',
          lineWidth: 3,
        },
      },
      // 边不同状态下的样式集合
      edgeStateStyles: {
        // 鼠标进入边，即 active 状态为 true 时的样式
        active: {
          stroke: 'red',
          lineWidth: 3,
        },
        // 鼠标点击边，即 selected 状态为 true 时的样式
        selected: {
          stroke: 'steelblue',
          lineWidth: 4,
        },
      },
      // 适配画布
      fitView: true,
      fitViewPadding: [100, 50, 100, 50],

    });
    this.initGraphData(graphData);  // 初始化图数据
    this.initEvent(); // 初始化图绑定事件
    return this.graph
  }

  static initEvent() {
    const {graph} = this;
    // 监听鼠标进入节点
    graph.on('node:mouseenter', (e) => {
      const nodeItem = e.item;
      // 设置目标节点的 hover 状态 为 true
      graph.setItemState(nodeItem, 'hover', true);
    });
    // 监听鼠标离开节点
    graph.on('node:mouseleave', (e) => {
      const nodeItem = e.item;
      // 设置目标节点的 hover 状态 false
      graph.setItemState(nodeItem, 'hover', false);
    });
    // 监听鼠标点击节点
    graph.on('node:click', (e) => {
      // 先将所有当前有 click 状态的节点的 click 状态置为 false
      const clickNodes = graph.findAllByState('node', 'click');
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, 'click', false);
      });
      const nodeItem = e.item;
      // 设置目标节点的 click 状态 为 true
      graph.setItemState(nodeItem, 'click', true);
      // 存储当前节点的id到vuex
      // this.$store.commit("graph/setCurNodeId", nodeItem['_cfg'].id);
    });

    // 点击时选中，再点击时取消
    graph.on('edge:click', (ev) => {
      // 先将所有当前有 selected 状态的边的 selected 状态置为 false
      const clickEdges = graph.findAllByState('edge', 'selected');
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, 'selected', false);
      });
      const edge = ev.item;
      graph.setItemState(edge, 'selected', !edge.hasState('selected')); // 切换选中
      // 存储当前边的id到vuex
      // this.$store.commit("graph/setCurEdgeId", edge['_cfg'].id);
    });

    graph.on('edge:mouseenter', (ev) => {
      const edge = ev.item;
      graph.setItemState(edge, 'active', true);
    });

    graph.on('edge:mouseleave', (ev) => {
      const edge = ev.item;
      graph.setItemState(edge, 'active', false);
    });

    // 监听布局切换，切换后自动fitview
    graph.on('afterlayout', e => {
      graph.fitView(0);
    })

  }

  static initGraphData(data) {
    this.graph.data(data);
  }

  static destroy() {
    this.graph.destroy();
  }

}
