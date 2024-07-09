import request from '@/utils/request'

// [{cacheName: "login_tokens", cacheKey: "", cacheValue: "", remark: "用户信息"}]
export const listCacheName = () => {
  return request({
    url: '/redis/listCacheName',
    method: 'get'
  })
}

// ["dsfadfd"]
export const listCacheKey = () => {
  return request({
    url: '/redis/listCacheKey',
    method: 'get'
  })
}

// {cacheKey: "43d0e2cb-5de4-",cacheName: "login_tokens",cacheValue: "cser@df4ae5e",remark: ""}
export const getCacheValue = () => {
  return request({
    url: '/redis/getCacheValue',
    method: 'get'
  })
}


export const clearCacheName = () => {
  return request({
    url: '/redis/clearCacheName',
    method: 'get'
  })
}


export const clearCacheKey = () => {
  return request({
    url: '/redis/clearCacheKey',
    method: 'get'
  })
}


export const clearCacheAll = () => {
  return request({
    url: '/redis/clearCacheAll',
    method: 'get'
  })
}