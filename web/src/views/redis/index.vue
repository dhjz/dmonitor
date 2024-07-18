<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-card style="height: calc(100vh - 125px)">
          <template #header>
            <Collection style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">主机列表</span>
            <el-button style="float: right; padding: 3px 0;margin-left: 6px;" link type="primary" @click="refreshCacheNames()" >刷新</el-button>
            <el-button style="float: right; padding: 3px 0;margin-left: 6px;" link type="primary" @click="addFormVisible = true" >添加</el-button>
            <span style="float: right; margin-right: 50px; font-size: 12px;  padding: 5px 0;" v-show="redisInfo && redisInfo.version">
              当前连接信息: 版本: {{ redisInfo.version || '' }}, 模式: {{ redisInfo.mode || '' }}
            </span>
          </template>
          <el-table
            v-loading="loading"
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column label="序号" width="60" type="index" />
            <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true">
              <template #default="{ row }">
                {{ row.host }}:{{ row.port }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" class-name="small-padding fixed-width" >
              <template #default="scope">
                <el-button link type="primary" @click="handleLinkCacheName(scope.row)" >连接</el-button>
                <el-button link type="primary" @click="handleDelCacheName(scope.row)" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="7">
        <el-card style="height: calc(100vh - 125px)">
          <template #header>
            <Key style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">键名列表({{ cacheKeys.length }}个)</span>
            <el-button
              style="float: right; padding: 3px 0"
              link
              type="primary"
              icon="Refresh"
              @click="refreshCacheKeys"
              >刷新</el-button>
            <el-input style="float: right; margin-right: 10px; width: 170px;" size="small" v-model="inputKey" placeholder="键名搜索, 回车确认" @keyup.enter="getCacheKeys" clearable />
            <el-select v-model="dbIndex" filterable placeholder="DB" size="small" style="float: right; margin-right: 10px; width: 100px;" @change="dbChange">
              <el-option
                v-for="item in dbOptions"
                :key="item.value"
                :label="'DB_' + item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <el-table
            v-loading="subLoading"
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
            style="width: 100%"
          >
            <el-table-column label="序号" width="60" type="index" />
            <el-table-column label="缓存键名" prop="name" align="center" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="操作" width="60" align="center" class-name="small-padding fixed-width" >
              <template #default="scope">
                <el-button link type="primary" @click="handleClearCacheKey(scope.row)" >删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card :bordered="false" style="height: calc(100vh - 125px)">
          <template #header>
            <Document style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">缓存内容</span>
            <el-button
              style="float: right; padding: 3px 0; display: none;"
              link
              type="primary"
              icon="Refresh"
              @click="handleClearCacheAll()"
              >清理全部</el-button
            >
          </template>
          <el-form :model="cacheForm">
            <el-row :gutter="32">
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存键名:" prop="key">
                  <el-input v-model="cacheForm.key" readonly />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存时间:" prop="expire">
                  <el-input v-model="cacheForm.expire" readonly />
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存内容:" prop="value">
                  <div v-if="computedValue" class="json-box">{{ computedValue }}</div>
                  <el-input
                    v-else
                    v-model="cacheForm.value"
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows: 15 }"
                    readonly
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-dialog v-model="addFormVisible" title="添加主机" width="500">
    <el-form ref="addFormRef" :model="addForm" :rules="rules">
      <el-form-item label="主机Host" prop="host">
        <el-input v-model.trim="addForm.host" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="主机端口" prop="port">
        <el-input-number v-model="addForm.port" :min="1" :max="69999" clearable controls-position="right" />
      </el-form-item>
      <el-form-item label="主机密码" prop="password">
        <el-input v-model.trim="addForm.password" autocomplete="off" type="password" clearable show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="testRedis" style="float: left;" v-loading="testLoading" :disabled="testLoading">测试连接</el-button>
        <el-button type="primary" @click="addCacheNames">保存</el-button>
        <el-button @click="addFormVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
  <FloatMenu />
</template>

<script setup name="CacheList">
import { listKey, getByKey, initRedis, pingRedis, getRedisDbInfo, changeRedisDb } from "@/api/redis";
import { getStorage, setStorage, formatSecond, encode, decode } from '@/utils';

const { proxy } = getCurrentInstance();
const REDIS_LIST_KEY = 'REDIS_LIST_KEY'

const dbOptions = ref([]);
const cacheNames = ref([]);
const cacheKeys = ref([]);
const cacheForm = ref({});
const loading = ref(false);
const subLoading = ref(false);
const addFormVisible = ref(false);
const testLoading = ref(false);
const nowCacheName = ref("");
const inputKey = ref("");
const dbIndex = ref(null);
const redisInfo = ref({})
const tableHeight = ref(window.innerHeight - 200);

const { addForm, rules } = toRefs(reactive({
  addForm: {
    host: '',
    port: 6379,
    password: ''
  },
  rules: {
    host: [{ required: true, message: "主机host不能为空", trigger: "blur" }],
    port: [{ required: true, message: "主机端口不能为空", trigger: "blur" }],
  },
}))

// const cacheKeysComputed = computed(() => cacheKeys.value.filter(x => !inputKey.value || x.name.toLowerCase().includes(inputKey.value.toLowerCase())))

const computedValue = computed(() => {
  if (!cacheForm.value.value) return ''
  try {
    return JSON.stringify(JSON.parse(cacheForm.value.value), null, 2)
  } catch(e) {
    return ''
  }
})

/** 查询缓存名称列表 */
function getCacheNames() {
  const list = getStorage(REDIS_LIST_KEY)
  if (list && list.length) {
    cacheNames.value = list
  }
}

/** 刷新缓存名称列表 */
function refreshCacheNames() {
  getCacheNames();
  proxy.$modal.msgSuccess("刷新主机列表成功");
}

/** 清理指定名称缓存 */
function handleDelCacheName(row) {
  proxy.$modal.confirm('是否确认删除名称为"' + row.host + '"的数据项?').then(() => {
    let ind = cacheNames.value.findIndex(x => x.id == row.id)
    console.log('del', ind);
    if (ind >= 0) cacheNames.value.splice(ind, 1)
    setStorage(REDIS_LIST_KEY, cacheNames.value)
  }).catch(() => {});
}

function addCacheNames() {
  proxy.$refs["addFormRef"].validate(valid => {
    if (valid) {
      cacheNames.value.push({ 
        ...addForm.value,
        password: encode(addForm.value.password),
        id: Math.random().toString(32).slice(-5) 
      })
      setStorage(REDIS_LIST_KEY, cacheNames.value)
      addFormVisible.value = false
      addForm.value = { host: '', post: 6379, password: '' }
    }
  });
}

function testRedis() {
  testLoading.value = true
  pingRedis({ ...addForm.value }).then(res => {
    if (res.data && res.data.version) {
      proxy.$modal.msgSuccess(`连接redis成功, 版本: ${res.data.version}, 模式: ${res.data.mode}`)
    } else {
      proxy.$modal.msgError("连接redis失败");
    }
  }).finally(() => (testLoading.value = false))
}

function handleLinkCacheName(row) {
  initRedis({ ...row, password: decode(row.password) }).then(res => {
    if (res.code == 200) {
      if (res.data) {
        dbIndex.value = res.data.currDb + ''
        redisInfo.value = res.data.redisInfo || {}
      }
      getDbInfo()
      getCacheKeys()
    } else {
      proxy.$modal.msgError("连接redis失败");
      redisInfo.value = {}
    }
  })
}

function getDbInfo() {
  getRedisDbInfo().then(res => {
    let temp = res.data || {}
    dbOptions.value = Object.keys(temp).map((key) => ({
      label: `${key} (${temp[key]})`,
      value: key
    }))
  })
}

/** 查询缓存键名列表 */
function getCacheKeys() {
  subLoading.value = true;
  listKey({ keyword: inputKey.value || '' }).then(res => {
    let temp = (res.data || [])
    temp.sort()
    cacheKeys.value = temp.map(x => ({ name: x }));
    subLoading.value = false;
  })
}

function dbChange() {
  changeRedisDb({ index: dbIndex.value }).then(res => {
    res.data && refreshCacheKeys()
  })
}

/** 刷新缓存键名列表 */
function refreshCacheKeys() {
  getCacheKeys();
  proxy.$modal.msgSuccess("刷新键名列表成功");
}

/** 清理指定键名缓存 */
function handleClearCacheKey(cacheKey) {
  console.log(6666);
  clearCacheKey(cacheKey).then(response => {
    proxy.$modal.msgSuccess("清理缓存键名[" + cacheKey + "]成功");
    getCacheKeys();
  });
}

/** 列表前缀去除 */
function nameFormatter(row) {
  return row.cacheName.replace(":", "");
}

/** 键名前缀去除 */
function keyFormatter(cacheKey) {
  return cacheKey.replace(nowCacheName.value, "");
}

/** 查询缓存内容详细 */
function handleCacheValue(row) {
  getByKey({ key: row.name }).then(res => {
    if (res.data && res.data.value) {
      res.data.expire = res.data.expire == 0 ? '永久' : (formatSecond(res.data.expire))
      cacheForm.value = res.data
    } else {
      cacheForm.value = {}
    }
  })
}

/** 清理全部缓存 */
function handleClearCacheAll() {
  clearCacheAll().then(response => {
    proxy.$modal.msgSuccess("清理全部缓存成功");
  });
}

getCacheNames();
</script>

<style scoped>
  .el-textarea {
    word-break: break-all;
  }
  .json-box {
    white-space: pre;
    word-break: break-all;
    max-height: calc(100vh - 320px);
    width: 100%;
    overflow: auto;
    border: 1px solid #eee;
    padding: 4px;
    line-height: 1.4;
  }
</style>