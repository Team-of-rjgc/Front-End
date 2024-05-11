import { request } from '../request'

export function publish(data) {
  return request({
    url: '/api/v1/user/pub',
    method: 'post',
    data
  })
}

