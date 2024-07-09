<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><Cpu style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">CPU</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf" width="120"><div class="cell">属性</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">值</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">核心数</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu">{{ fixNum(server.cpu.cpuNum) }}</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">用户使用率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu"><el-progress :text-inside="true" :stroke-width="20" :percentage="fixNum(server.cpu.used)" /></div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">系统使用率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu"><el-progress :text-inside="true" :stroke-width="20" :percentage="fixNum(server.cpu.sys)" /></div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">当前空闲率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu"><el-progress :text-inside="true" :stroke-width="20" status="success" :percentage="fixNum(server.cpu.free)" /></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><Tickets style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">内存</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf" width="120"><div class="cell">属性</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">内存</div></th>
                  <!-- <th class="el-table__cell is-leaf"><div class="cell">JVM</div></th> -->
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">总内存</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">{{ fixNum(server.mem.total) }}G</div></td>
                  <!-- <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ fixNum(server.jvm.total) }}M</div></td> -->
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">已用内存</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">{{ fixNum(server.mem.used)}}G</div></td>
                  <!-- <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ fixNum(server.jvm.used)}}M</div></td> -->
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">剩余内存</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">{{ fixNum(server.mem.free) }}G</div></td>
                  <!-- <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ fixNum(server.jvm.free) }}M</div></td> -->
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">使用率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">
                    <el-progress :text-inside="true" :stroke-width="20" :status="server.mem.usage < 50 ? 'success' : server.mem.usage < 80 ? 'warning' : 'exception'" :percentage="fixNum(server.mem.usage)" />
                  </div></td>
                  <!-- <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm" :class="{'text-danger': server.jvm.usage > 80}">{{ fixNum(server.jvm.usage) }}%</div></td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header><Monitor style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">服务器信息</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">服务器名称</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.computerName }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">操作系统</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.osName }}</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">服务器IP</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.computerIp }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">系统架构</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.osArch }}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header><CoffeeCup style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">环境信息</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;table-layout:fixed;">
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">开机时间</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.startTime }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">运行时长</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.uptime }}</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">Java版本</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.javaVersion }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">Java路径</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.javaPath }}</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">NodeJs版本</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.nodeVersion }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">NodeJs路径</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.sys">{{ server.sys.nodePath }}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <template #header><MessageBox style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">磁盘状态</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="el-table__cell el-table__cell is-leaf"><div class="cell">盘符路径</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">文件系统</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">盘符类型</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">总大小</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">可用大小</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">已用大小</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">已用百分比</div></th>
                </tr>
              </thead>
              <tbody v-if="server.sysFiles">
                <tr v-for="(sysFile, index) in server.sysFiles" :key="index">
                  <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.dirName }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.sysTypeName }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.typeName }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.total }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.free }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.used }}</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell"><el-progress :text-inside="true" :stroke-width="20" :percentage="fixNum(sysFile.usage)" /></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="24" class="card-box">
        <el-card>
          <template #header><MessageBox style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">内存状态</span></template>
          <el-table :data="server.top || []" style="width: 100%">
            <el-table-column label="序号" type="index" width="80" />
            <el-table-column label="内存占用大小" prop="memFormat" width="140" />
            <el-table-column label="PID" prop="pid"  width="140"  />
            <el-table-column label="程序路径" prop="path"  />
            <el-table-column label="程序详情" prop="cmd" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <FloatMenu />
  </div>
</template>

<script setup>
import { getInfo } from '@/api/cpu'

const server = ref([])
const { proxy } = getCurrentInstance()

function getList(isInit) {
  isInit && proxy.$modal.loading("正在加载服务监控数据，请稍候！")

  getInfo().then(res => {
  // axios.get('http://localhost:888/info').then(res => {
    console.log(res)
    server.value = res.data
  }).finally(() => proxy.$modal.closeLoading())
}

function fixNum(num) {
  if (!num || isNaN(num) || Number.isInteger(num)) return num
  return parseFloat(num).toFixed(2)
}

setInterval(() => {
  getList()
}, 5000)

getList(true);
</script>