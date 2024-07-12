package redis

import (
	// pointController "express/server/business/point/controller"
	"context"
	"dmonitor/server/base"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func HandleApi(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")             //允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type") //header的类型
	w.Header().Set("Content-Type", "application/json")

	// 获取请求路径   strings.HasSuffix
	path := r.URL.Path
	fmt.Println("redis HandleApi path:", path)

	switch {
	case strings.Contains(path, "/getRedisDbInfo"):
		getRedisDbInfo(w, r)
	case strings.Contains(path, "/changeRedisDb"):
		changeRedisDb(w, r)
	case strings.Contains(path, "/pingRedis"):
		pingRedis(w, r)
	case strings.Contains(path, "/initRedis"):
		initRedis(w, r)
	case strings.Contains(path, "/listKey"):
		listKey(w, r)
	case strings.Contains(path, "/getByKey"):
		getByKey(w, r)
	default:
		http.NotFound(w, r)
	}

	// result := make(map[string]interface{})
	// result["cpu"] = cpuInfo

}

func changeRedisDb(w http.ResponseWriter, r *http.Request) {
	index, err := strconv.Atoi(r.URL.Query().Get("index"))
	if err != nil {
		base.R(w).FailMsg("请传入正确的DB库")
		return
	}
	base.R(w).Ok(changeDb(index))
}

func getRedisDbInfo(w http.ResponseWriter, r *http.Request) {
	base.R(w).Ok(getDbInfo())
}

func pingRedis(w http.ResponseWriter, r *http.Request) {
	host := r.URL.Query().Get("host")
	password := r.URL.Query().Get("password")
	port, err := strconv.Atoi(r.URL.Query().Get("port"))
	if err != nil {
		base.R(w).FailMsg("请传入正确的端口号")
		return
	}

	result := pingDb(host, port, password)

	base.R(w).Ok(result)
}

func initRedis(w http.ResponseWriter, r *http.Request) {
	result := make(map[string]interface{})
	ctx := context.Background()
	host := r.URL.Query().Get("host")
	password := r.URL.Query().Get("password")
	port, err := strconv.Atoi(r.URL.Query().Get("port"))
	if err != nil {
		base.R(w).FailMsg("请传入正确的端口号")
		return
	}
	fmt.Printf("initRedis parameter: %s:%d, pwd: %s", host, port, password)
	createDb(host, port, password)

	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("连接Redis出错")
		base.R(w).FailMsg("连接Redis出错")
		return
	}
	fmt.Println("Ping Redis success: ", pong)
	result["currDb"] = currDb
	result["redisInfo"] = getRedisInfo()
	base.R(w).Ok(result)
}

func listKey(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	keys, err := rdb.Keys(ctx, "*").Result()
	if err != nil {
		base.R(w).Ok([]string{})
		return
	}
	fmt.Println("Keys in db0 len: ", len(keys))
	base.R(w).Ok(keys)

}

func getByKey(w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")
	ctx := context.Background()
	val, err := rdb.Get(ctx, key).Result()
	if err != nil {
		base.R(w).Ok("")
		return
	}
	fmt.Println(val)
	var exp int = 0
	// 获取key的有效期（TTL）
	ttl, err := rdb.TTL(ctx, key).Result()
	if err != nil {
		panic(err)
	} else {
		if ttl == time.Duration(-2) {
			fmt.Printf("Key %s does not exist or has no associated expiration\n", key)
		} else if ttl == time.Duration(-1) {
			fmt.Printf("Key %s exists but has no expiration set\n", key)
			exp = 0
		} else {
			fmt.Printf("Key %s -> TTL: %s\n", key, ttl)
			exp = int(ttl.Seconds())
		}
	}

	result := make(map[string]interface{})
	result["value"] = val
	result["expire"] = exp
	result["key"] = key

	base.R(w).Ok(result)
}
