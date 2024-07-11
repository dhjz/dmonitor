import request from '@/utils/request'

export const listKey = () => {
  return request({
    url: '/redis/listKey',
    method: 'get'
  })
}

export const getByKey = (params) => {
  return request({
    url: '/redis/getByKey',
    method: 'get',
    params
  })
}

// host password port
export const initRedis = (params) => {
  return request({
    url: '/redis/initRedis',
    method: 'get',
    params
  })
}

export const pingRedis = (params) => {
  return request({
    url: '/redis/pingRedis',
    method: 'get',
    params
  })
}

export const getRedisDbInfo = (params) => {
  return request({
    url: '/redis/getRedisDbInfo',
    method: 'get',
    params
  })
}

export const changeRedisDb = (params) => {
  return request({
    url: '/redis/changeRedisDb',
    method: 'get',
    params
  })
}
