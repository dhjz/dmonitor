package utils

import (
	"fmt"
	"os/exec"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/shirou/gopsutil/host"
)

func FormatBytes(bytes uint64) string {
	const unit = 1024
	if bytes < unit {
		return strconv.FormatUint(bytes, 10) + " B"
	}
	div, exp := uint64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}

func OpenBrowser(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // Linux 等其他 Unix-like 系统
		// cmd = "xdg-open"
		cmd = ""
	}
	if cmd == "" {
		return nil
	}

	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}

func GetOpenTime() (string, string) {
	bootTime, err := host.BootTime()
	if err != nil {
		fmt.Println("无法获取开机时间:", err)
		return "", ""
	}

	startTime := time.Unix(int64(bootTime), 0)
	uptime := time.Since(startTime)

	return startTime.Format("2006-01-02 15:04:05"), FormatDuration(uptime)
}

func FormatDuration(duration time.Duration) string {
	days := int(duration.Hours() / 24)
	hours := int(duration.Hours()) % 24
	minutes := int(duration.Minutes()) % 60

	return fmt.Sprintf("%d天%d小时%d分钟", days, hours, minutes)
}

var javaVersionTemp string
var javaPathTemp string
var nodeVersionTemp string
var nodePathTemp string

func GetJavaInfo() (string, string) {
	if javaVersionTemp != "" {
		return javaVersionTemp, javaPathTemp
	}

	outputStr, _ := GetCmdOutput(exec.Command("java", "-version"), true)
	lines := strings.Split(outputStr, "\n")
	versionLine := strings.TrimPrefix(strings.TrimSpace(lines[0]), "java version ")
	javaVersion := strings.Split(versionLine, "\"")[1]

	javaPath, _ := GetCmdOutput(exec.Command("which", "java"), false)

	javaVersionTemp = javaVersion
	javaPathTemp = javaPath

	return javaVersionTemp, javaPathTemp
}

func GetNodeInfo() (string, string) {
	if nodeVersionTemp != "" {
		return nodeVersionTemp, nodePathTemp
	}

	nodeVersion, _ := GetCmdOutput(exec.Command("node", "--version"), false)
	nodePath, _ := GetCmdOutput(exec.Command("which", "node"), false)

	nodeVersionTemp = nodeVersion
	nodePathTemp = nodePath

	return nodeVersionTemp, nodePathTemp
}
