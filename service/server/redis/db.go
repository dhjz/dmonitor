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

func pingDb(host string, port int, pwd string) map[string]interface{} {
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
		return nil
	}

	fmt.Println("Ping Redis success: ", pong)
	result := getRedisInfo(client)
	return result
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

func getRedisInfo(db *redis.Client) map[string]interface{} {
	ctx := context.Background()
	result := make(map[string]interface{})
	infoCmd := db.Info(ctx)
	info, err := infoCmd.Result()
	if err != nil {
		fmt.Println("Error getting Redis info:", err)
		return nil
	}
	fmt.Println("Redis Info:", info)
	result["info"] = info

	for _, line := range strings.Split(info, "\r\n") {
		if strings.HasPrefix(line, "redis_version:") {
			result["version"] = strings.TrimPrefix(line, "redis_version:")
		}
		if strings.HasPrefix(line, "redis_mode:") {
			result["mode"] = strings.TrimPrefix(line, "redis_mode:")
		}
	}

	return result
}

func getKeyLen(val string) int {
	// 使用 SCAN 命令进行键的统计
	ctx := context.Background()
	var cursor uint64 = 0
	var count int
	for {
		keys, nextCursor, err := rdb.Scan(ctx, cursor, val+"*", 10).Result()
		if err != nil {
			fmt.Println("Error getKeyLen:", err)
			return 0
		}
		count += len(keys)
		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	fmt.Printf("getKeyLen Total keys count: %d\n", count)
	return count
}
