package redis

import (
	"context"
	"fmt"
	"strings"

	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var currDb int
var link string

func getDb() *redis.Client {
	return rdb
}

func createDb(host string, port int, pwd string) *redis.Client {
	linktemp := fmt.Sprintf("%s_%d_%s", host, port, pwd)
	if rdb != nil {
		if linktemp == link {
			fmt.Println("redis db  has created...return old")
			return rdb
		}
		rdb.Close()
		rdb = nil
	}
	fmt.Printf("createDb Redis: %s:%d, pwd: %s", host, port, pwd)
	rdb = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", host, port),
		Password: pwd,
		DB:       0, // 默认DB 0
	})
	link = linktemp
	fmt.Println("redis db created...")
	return rdb
}

func pingDb(host string, port int, pwd string) bool {
	ctx := context.Background()
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", host, port),
		Password: pwd,
		DB:       0, // 默认DB 0
	})
	fmt.Printf("pingRedis: %s:%d, pwd: %s", host, port, pwd)

	defer client.Close()

	pong, err := client.Ping(ctx).Result()
	if err != nil {
		fmt.Println("Ping Redis fail: ", err)
		return false
	}

	fmt.Println("Ping Redis success: ", pong)
	return true
}

func changeDb(ind int) bool {
	ctx := context.Background()

	err := rdb.Do(ctx, "SELECT", ind).Err()
	fmt.Println("Redis DB changed: ", ind)
	currDb = ind
	return err == nil
}

func getDbInfo() map[int]int {
	// 使用 Context 控制操作的超时、取消等
	ctx := context.Background()

	infoCmd := rdb.Info(ctx, "keyspace")
	// 处理 INFO 命令的返回值
	infoStr, err := infoCmd.Result()
	if err != nil {
		panic(err)
	}

	dbInfo := make(map[int]int)
	var currentDB int
	var keyspace string

	lines := strings.Split(infoStr, "\r\n")
	for _, line := range lines {
		if strings.HasPrefix(line, "db") {
			_, err := fmt.Sscanf(line, "db%d:%s", &currentDB, &keyspace)
			if err != nil {
				continue
			}
			keyValuePair := strings.Split(keyspace, ",")
			for _, kv := range keyValuePair {
				if strings.HasPrefix(kv, "keys=") {
					var keys int
					fmt.Sscanf(kv, "keys=%d", &keys)
					dbInfo[currentDB] = keys
				}
			}
		}
	}

	return dbInfo

}
