package redis

import (
	// pointController "express/server/business/point/controller"
	"dmonitor/server/base"
	"fmt"
	"net/http"
	"strings"
)

func HandleApi(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")             //允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type") //header的类型
	w.Header().Set("Content-Type", "application/json")

	// 获取请求路径   strings.HasSuffix
	path := r.URL.Path
	fmt.Println("redis HandleApi path:", path)

	switch {
	case strings.Contains(path, "/listCacheName"):
		listCacheName(w, r)
	case strings.Contains(path, "/listCacheKey"):
		listCacheKey(w, r)
	case strings.Contains(path, "/getCacheValue"):
		getCacheValue(w, r)
	case strings.Contains(path, "/clearCacheName"):
		clearCacheName(w, r)
	case strings.Contains(path, "/clearCacheKey"):
		clearCacheKey(w, r)
	case strings.Contains(path, "/clearCacheAll"):
		clearCacheAll(w, r)
	default:
		http.NotFound(w, r)
	}

	// result := make(map[string]interface{})
	// result["cpu"] = cpuInfo

}

func listCacheName(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})
	// list = make([]*pointEntity.ExpressPoint, 0, 2)
	base.R(w).Ok(result)

}

func listCacheKey(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})

	base.R(w).Ok(result)
}

func getCacheValue(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})

	base.R(w).Ok(result)
}

func clearCacheName(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})

	base.R(w).Ok(result)
}

func clearCacheKey(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})

	base.R(w).Ok(result)
}

func clearCacheAll(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})

	base.R(w).Ok(result)
}
