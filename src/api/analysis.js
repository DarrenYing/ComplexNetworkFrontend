import request from '@/utils/request'

export function getChartData() {
  return request({
    url: '/network/node-distribution',
    method: 'get',
    // baseURL: 'https://www.fastmock.site/mock/8b12587a257ad528246ccd0ac318778e/api',
  })
}

export function getInfluenceChartData(data) {
  return request({
    url: '/network/influence-comparison',
    method: 'post',
    data
  })
}

export function getCommunityChartData() {
  return request({
    url: '/network/community-evaluation',
    method: 'get',
  })
}
