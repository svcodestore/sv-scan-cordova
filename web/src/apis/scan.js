import request from '@/utils/request'

const apiPath = {
  test: '/'
}

export function test () {
  return request({
    url: apiPath.test,
    method: 'get'
  })
}
