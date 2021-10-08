import request from '@/utils/request'

export function getChartData() {
  return request({
    url: '/wyy/node-distribution',
    method: 'get',
    baseURL: 'https://www.fastmock.site/mock/8b12587a257ad528246ccd0ac318778e/api',
  })
}
