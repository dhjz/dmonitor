import request from '@/utils/request'

export const getInfo = () => {
  return request({
    url: 'info',
    method: 'get'
  })
}