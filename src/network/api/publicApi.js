import { request } from '../request'

export function downloadImage(data) {
  return request({
    url: '/api/v1/public/downloadImage',
    method: 'get',
    params: data,
    responseType: 'blob',
  });
}