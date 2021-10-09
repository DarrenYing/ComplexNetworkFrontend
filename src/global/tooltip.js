// Tooltip设置
const G6 = require("@antv/g6");

const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 20,
  getContent(e) {
    const outDiv = document.createElement('div');
    if (e.item['_cfg'].type === 'node') {
      // console.log(e.item.getModel())
      outDiv.innerHTML = `
        <h4>${e.item.getModel()['node_name']}</h4>
        <span>${e.item.getModel()['node_degree']}</span>`
    } else if(e.item['_cfg'].type === 'edge') {
      outDiv.innerHTML = `
        <h4>relation-type: 关注</h4>
        <span>source: ${e.item.getModel()['source_name']}</span>
        <br />
        <span>target: ${e.item.getModel()['target_name']}</span>
      `
    }
    return outDiv
  },
  itemTypes: ['node', 'edge']
});

export default tooltip
