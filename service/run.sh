#!/bin/bash
nohup /opt/dmonitor -p 888 > /opt/dmonitor.log 2>&1 &
nohup ./dmonitor -p 8085 > ./dmonitor.log 2>&1 &


# 找出包含关键字 "monitor" 的进程ID
pids=$(ps aux | grep -v grep | grep dmonitor | awk '{print $2}')
if [ -n "$pids" ]; then
    echo "找到包含关键字 'dmonitor' 的进程，将被杀死：$pids"
    kill -9 $pids
fi