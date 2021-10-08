import service from '@/utils/request'

export function getGraphData() {
  return service.request({
    url: '/network/graph-data',
    method: 'get',
    // baseURL: 'https://www.fastmock.site/mock/8b12587a257ad528246ccd0ac318778e/api',
  })
}

export function getNetAttr() {
  return service.request({
    url: '/network/network-attr',
    method: 'get',
    // baseURL: 'https://www.fastmock.site/mock/8b12587a257ad528246ccd0ac318778e/api',
  })
}

export function getNodeAttr(data) {
  return service.request({
    url: '/network/node-attr',
    method: 'post',
    data,
    // baseURL: 'https://www.fastmock.site/mock/8b12587a257ad528246ccd0ac318778e/api',
  })
}

export function getEdgeAttr(data) {
  return service.request({
    url: '/network/edge-attr',
    method: 'post',
    data,
    // baseURL: 'https://www.fastmock.site/mock/8b12587a257ad528246ccd0ac318778e/api',
  })
}

