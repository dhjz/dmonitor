package main

import (
	"dmonitor/server/base"
	"dmonitor/server/redis"
	"dmonitor/server/utils"
	"flag"
	"fmt"
	"io/fs"
	"io/ioutil"
	"net/http"
	"os"
	"runtime"
	"sort"
	"time"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/process"

	// "context"
	// "os/signal"
	// "syscall"
	"embed"
)

//go:embed webapp
var f embed.FS

type CPUInfo struct {
	CpuNum    int     `json:"cpuNum"`
	CpuThread int     `json:"cpuThread"`
	Sys       float64 `json:"sys"`
	Used      float64 `json:"used"`
	Free      float64 `json:"free"`
}

type MemoryInfo struct {
	Total float64 `json:"total"`
	Free  float64 `json:"free"`
	Used  float64 `json:"used"`
	Usage float64 `json:"usage"`
}

type SysInfo struct {
	ComputerIp   string `json:"computerIp"`
	ComputerName string `json:"computerName"`
	OsArch       string `json:"osArch"`
	OsName       string `json:"osName"`
	UserDir      string `json:"userDir"`
	StartTime    string `json:"startTime"`
	Uptime       string `json:"uptime"`
	JavaVersion  string `json:"javaVersion"`
	JavaPath     string `json:"javaPath"`
	NodeVersion  string `json:"nodeVersion"`
	NodePath     string `json:"nodePath"`
}

type DiskInfo struct {
	DirName     string  `json:"dirName"`
	SysTypeName string  `json:"sysTypeName"`
	TypeName    string  `json:"typeName"`
	Total       string  `json:"total"`
	Used        string  `json:"used"`
	Free        string  `json:"free"`
	Usage       float64 `json:"usage"`
}

type Process struct {
	Pid       int32   `json:"pid"`
	Path      string  `json:"path"`
	Cmd       string  `json:"cmd"`
	Mem       float64 `json:"mem"`
	MemFormat string  `json:"memFormat"`
}

// ProcessList 实现了 sort.Interface 所需的三个方法：Len()、Less() 和 Swap()。这样就可以对 ProcessList 进行排序
type ProcessList []Process

func (p ProcessList) Len() int           { return len(p) }
func (p ProcessList) Less(i, j int) bool { return p[i].Mem > p[j].Mem }
func (p ProcessList) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

type Data struct {
	CPU    CPUInfo    `json:"cpu"`
	Memory MemoryInfo `json:"memory"`
}

func getInfoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")             //允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type") //header的类型

	isInit := r.URL.Query().Get("isInit")

	fmt.Printf("isInit parameter value: %s", isInit)

	// 获取 CPU 信息
	cpuInfo := CPUInfo{
		CpuNum:    runtime.NumCPU(),
		CpuThread: runtime.GOMAXPROCS(0),
	}

	// 获取 CPU 使用率
	percent, err := cpu.Percent(0, false)
	if err != nil {
		fmt.Println("获取CPU使用率时发生错误:", err)
	} else {
		cpuInfo.Used = percent[0]
	}

	// 获取系统使用率
	systemPercent, err := cpu.Percent(0, true)
	if err != nil {
		fmt.Println("获取系统CPU使用率时发生错误:", err)
	} else {
		cpuInfo.Sys = systemPercent[0]
	}
	cpuInfo.Free = 100 - cpuInfo.Sys - cpuInfo.Used

	// 获取内存信息
	memory, err := mem.VirtualMemory()
	if err != nil {
		fmt.Println("获取内存信息时发生错误:", err)
	} else {
		fmt.Printf("总内存: %v MB, 可用内存: %v MB\n", memory.Total/1024/1024, memory.Available/1024/1024)
	}

	memoryInfo := MemoryInfo{
		Total: float64(memory.Total) / 1024 / 1024 / 1024,
		Free:  float64(memory.Available) / 1024 / 1024 / 1024,
		Used:  float64(memory.Used) / 1024 / 1024 / 1024,
		Usage: float64(memory.Used) / float64(memory.Total) * 100,
	}

	// 获取系统信息
	javaVersion, javaPath := utils.GetJavaInfo()
	nodeVersion, nodePath := utils.GetNodeInfo()
	startTime, uptime := utils.GetOpenTime()
	sysInfo := SysInfo{
		// ComputerIp: os.Hostname(),
		OsArch:      runtime.GOARCH,
		OsName:      runtime.GOOS,
		StartTime:   startTime,
		Uptime:      uptime,
		JavaVersion: javaVersion,
		JavaPath:    javaPath,
		NodeVersion: nodeVersion,
		NodePath:    nodePath,
	}
	hostname, err := os.Hostname()
	if err != nil {
		fmt.Println("无法获取服务器名称:", err)
	} else {
		sysInfo.ComputerName = hostname
	}
	info, err := host.Info()
	if err != nil {
		fmt.Println("无法获取主机信息:", err)
	} else {
		sysInfo.OsName = info.OS + ", " + info.Platform + ", " + info.PlatformFamily + ", " + info.PlatformVersion + ", " + info.KernelArch
	}
	// 获取公网ip
	client := &http.Client{
		Timeout: 5 * time.Second,
	}
	resp, err := client.Get("http://ip.3322.net")
	if err != nil {
		fmt.Println("无法访问 ifconfig.me:", err)
	} else {
		defer resp.Body.Close()
		ip, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("无法读取响应:", err)
		} else {
			sysInfo.ComputerIp = string(ip)
		}
	}

	// 获取磁盘信息
	var diskInfos []DiskInfo
	partitions, err := disk.Partitions(false)
	if err != nil {
		fmt.Println("无法获取分区信息:", err)
	} else {
		for _, partition := range partitions {
			usage, err := disk.Usage(partition.Mountpoint)
			if err != nil {
				fmt.Printf("无法获取 %s 的使用情况: %s\n", partition.Mountpoint, err)
				continue
			}
			if usage.Free == 0 {
				continue
			}

			diskInfo := DiskInfo{
				DirName:     partition.Device,
				SysTypeName: partition.Fstype,
				TypeName:    partition.Mountpoint,
				Total:       utils.FormatBytes(usage.Total),
				Used:        utils.FormatBytes(usage.Used),
				Free:        utils.FormatBytes(usage.Free),
				Usage:       float64(usage.Used) / float64(usage.Total) * 100,
			}
			diskInfos = append(diskInfos, diskInfo)
		}
	}

	// 获取进程占用内存信息
	plist, err := process.Processes()
	if err != nil {
		panic(err)
	}

	var processes ProcessList
	for _, p := range plist {
		if memInfo, err := p.MemoryInfo(); err == nil {
			// mem := float64(memInfo.RSS) / 1024 / 1024 // 转换单位为 MB
			mem := float64(memInfo.RSS)
			memFormat := utils.FormatBytes(memInfo.RSS)
			path, _ := p.Exe()
			cmdline, _ := p.Cmdline()
			processes = append(processes, Process{Pid: p.Pid, Path: path, Mem: mem, MemFormat: memFormat, Cmd: cmdline})

		}
	}

	sort.Sort(processes)
	topProcesses := processes[:20]
	// fmt.Println("Rank\tPath\tMemory")
	// for i, p := range topProcesses {
	// 	fmt.Printf("%d\t%s\t%.2f \t%s\n", i+1, p.Path, p.Mem, p.MemFormat)
	// }

	data := make(map[string]interface{})
	data["cpu"] = cpuInfo
	data["mem"] = memoryInfo
	data["sys"] = sysInfo
	data["sysFiles"] = diskInfos
	data["info"] = info
	data["partitions"] = partitions
	data["top"] = topProcesses

	w.Header().Set("Content-Type", "application/json")
	// json.NewEncoder(w).Encode(data)
	base.R(w).Ok(data)
}

func main() {

	port := flag.Int("p", 40001, "server port")
	base.RunPort = *port
	// dir := flag.String("d", "./webapp", "server static dir")
	flag.Parse()
	addr := fmt.Sprintf(":%d", *port)

	http.HandleFunc("/monitor-api/info", getInfoHandler)
	http.HandleFunc("/monitor-api/redis/", redis.HandleApi)
	// 定义静态文件目录
	// staticDir := "./webapp"
	// staticDir := fmt.Sprintf("%s", *dir)
	// 创建文件服务器
	// fs := http.FileServer(http.Dir(staticDir))
	// 将文件服务器注册到指定路径
	// http.Handle("/", http.StripPrefix("/", fs))

	// 6.1 注册静态资源
	st, _ := fs.Sub(f, "webapp")
	// 创建文件服务器
	// fs := http.FileServer(http.Dir(staticDir))
	// 将文件服务器注册到指定路径
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.FS(st))))

	/*
		// 由于 http.ListenAndServe() 函数会阻塞当前协程，因此我们需要在另一个协程中执行该函数，以允许主协程进行信号监听。
		// 同时，在关闭 Redis 客户端前，应该将全部挂起的命令执行完毕，或者使用 Close() 函数的上下文参数来控制关闭时间。
		go func() {
			if err := http.ListenAndServe(addr, nil); err != nil && err != http.ErrServerClosed {
				fmt.Println("Failed to start HTTP server:", err)
				return
			}
		}()

		// 监听系统信号
		sigs := make(chan os.Signal, 1)
		signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

		go func() {
			// 等待信号
			<-sigs

			// 收到信号后执行清理操作
			fmt.Println("Received signal, closing...")
			_, cancel := context.WithTimeout(context.Background(), time.Second*5)
			defer cancel()
			os.Exit(0)
		}()

		// 进入主循环，等待信号
		// fmt.Println("http server start at port" + addr, ", static dir: " + staticDir)
		<-sigs
	*/

	// fmt.Println("http server start at port"+addr, ", static dir: "+staticDir)
	fmt.Printf("***********************app run on http://localhost:%d/ *******************", *port)
	fmt.Println("")

	utils.OpenBrowser(fmt.Sprintf("http://localhost:%d/", *port))
	go func() {
		utils.GenTaskBarIcon()
	}()

	fmt.Println("start http.... ", *port)
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		fmt.Println("start http error: ", err)
	}
	fmt.Println("start http success ", *port)
}
