<template>
    <div>
      <div style="margin-bottom: 16px;display: flex;justify-content: flex-start;">
        <a-button @click="handleAddConfig" type="primary">
        新建配置
      </a-button>
      </div>
      <a-table 
        :data="configList" 
        :pagination="pagination"
        @page-change="handlePageChange"
        :bordered="true"
       >
        <template #columns>
          <a-table-column title="标题" data-index="title" :width="200" :ellipsis="true" :tooltip="true">
            <template #cell="{ record }">
              <a-tooltip :content="record.title">
                <div style="font-weight: bold;">{{ record.title }}</div>
              </a-tooltip>
            </template>
          </a-table-column>
          <a-table-column title="工作/输出目录" data-index="directory"  :width="220" :ellipsis="true" :tooltip="true">
            <template #cell="{ record }">
                <div >{{ record.directory }}</div>
                <div >{{ record.output_video || '-' }}</div>
            </template>
          </a-table-column>
        
          <a-table-column title="素材时长" data-index="video_duration" :width="100">
            <template #cell="{ record }">
              <div >{{ Math.round(record.video_duration/60 ) }} 分钟</div>
            </template>
          </a-table-column>
          <a-table-column title="视频/音频/字幕/已生成(个)" :width="220">
            <template #cell="{ record }">
              <a-breadcrumb>
                <a-breadcrumb-item>{{ record.video_count }}</a-breadcrumb-item>
                <a-breadcrumb-item>{{ record.audio_count }}</a-breadcrumb-item>
                <a-breadcrumb-item>{{ record.srt_count }}</a-breadcrumb-item>
                <a-breadcrumb-item>{{ record.generate_video_count }}</a-breadcrumb-item>
              </a-breadcrumb>
              <!-- <div style="color: #666; font-size: 12px;">{{ record.video_count }}/{{ record.audio_count }}/{{ record.srt_count }}/{{ record.generate_video_count }}</div> -->
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="220" fixed="right">
            <template #cell="{ record }">
             
              <div style="display: flex; align-items: center; gap: 8px;">
                <a-link type="text" @click="handleGenerateVideoModal(record)" size="mini">
                  <template #icon><IconRobotAdd /></template>
                  生成
                </a-link>
                <a-link type="text" @click="editConfig(record)" size="mini">
                  <template #icon><icon-edit /></template>
                  编辑
                </a-link>
                <a-popconfirm content="确定要删除此配置吗？删除后无法恢复" @ok="deleteConfig(record.id)">
                  <a-link type="text" status="danger" size="mini">
                    <template #icon><icon-delete /></template>
                    删除
                  </a-link>
                </a-popconfirm>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    
    <!-- 新建配置 -->
      <a-drawer :width="450" v-model:visible="modalVisible" @ok="handleSubmit" @cancel="resetForm">
      <template #title>
      {{modalTitle}}
    </template>
      <a-form :model="formData" layout="vertical">
        <a-form-item label="标题" field="title" required>
          <a-input v-model="formData.title" placeholder="请输入标题" />
        </a-form-item>

        <a-form-item label="工作目录" field="directory" required>
          <a-input v-model="formData.directory" placeholder="请输入工作目录路径" />
        </a-form-item>

        <a-form-item label="输出目录" field="output_video" required>
          <a-input v-model="formData.output_video" placeholder="请输入输出视频路径" />
        </a-form-item>

        <a-form-item label="文件前缀" field="file_prefix">
          <a-input v-model="formData.file_prefix" placeholder="请输入生成文件前缀" />
        </a-form-item>

        <a-divider orientation="left">视频设置</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="宽度" field="video_width" required>
              <a-input-number v-model="formData.video_width" :min="1" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="高度" field="video_height" required>
              <a-input-number v-model="formData.video_height" :min="1" />
            </a-form-item>
          </a-col>

        </a-row>

        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="水平翻转" field="flip">
              <a-switch v-model="formData.flip" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="保持原始尺寸" field="original">
              <a-switch v-model="formData.original" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="裁剪前3秒" field="trim3s">
              <a-switch v-model="formData.trim3s" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="缩放比例" field="scale">
              <a-input-number v-model="formData.scale" :min="0.1" :step="0.1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="概率" field="probability_flip">
              <a-input-number v-model="formData.probability_flip" :min="0.1" :step="0.1" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="概率" field="probability_original">
              <a-input-number v-model="formData.probability_original" :min="0.1" :step="0.1" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="概率" field="probability_trim3s">
              <a-input-number v-model="formData.probability_trim3s" :min="0.1" :step="0.1" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="概率" field="probability_scale">
              <a-input-number v-model="formData.probability_scale" :min="0.1" :step="0.1" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">字幕设置</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="字体" field="subtitle_font_name">
              <a-input v-model="formData.subtitle_font_name" placeholder="例如：阿里巴巴普惠体" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="字号" field="subtitle_font_size">
              <a-input-number v-model="formData.subtitle_font_size" :min="1" :max="100" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对齐方式" field="subtitle_alignment">
              <a-select v-model="formData.subtitle_alignment">
                <a-option :value="1">左对齐</a-option>
                <a-option :value="2">居中</a-option>
                <a-option :value="3">右对齐</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="底部边距(像素)" field="subtitle_margin_v">
              <a-input-number v-model="formData.subtitle_margin_v" :min="0" :max="500" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="字体颜色" field="subtitle_primary_color">
              <a-color-picker v-model="formData.subtitle_primary_color" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="粗体" field="subtitle_bold">
              <a-switch v-model="formData.subtitle_bold" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="背景颜色" field="subtitle_background_color">
              <a-color-picker v-model="formData.subtitle_background_color" :show-alpha="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="边框样式" field="subtitle_border_style">
              <a-select v-model="formData.subtitle_border_style">
                <a-option :value="1">无边框</a-option>
                <a-option :value="3">阴影边框</a-option>
                <a-option :value="4">描边边框</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="描边大小" field="subtitle_outline">
              <a-input-number v-model="formData.subtitle_outline" :min="0" :max="10" :step="0.5" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="描边颜色" field="subtitle_outline_color">
              <a-color-picker v-model="formData.subtitle_outline_color" :show-alpha="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="阴影大小" field="subtitle_shadow">
              <a-input-number v-model="formData.subtitle_shadow" :min="0" :max="10" :step="0.5" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="阴影颜色" field="subtitle_shadow_color">
              <a-color-picker v-model="formData.subtitle_shadow_color" :show-alpha="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>
    <!-- 生成视频 -->
     <a-modal v-model:visible="modalGenerateVisible" :footer="false" title="生成视频" :mask-closable="false" unmount-on-close width="350px" @close="handleCloseGenerateVideo">
      <a-form :model="formData" layout="vertical">
        <a-form-item label="生成数量" field="modalGenerateCount">
          <a-input-number v-model="modalGenerateCount" placeholder="Please Enter" class="input-demo" :min="1" :max="100"/>
        </a-form-item>
       
        <a-form-item>
            <a-button type="primary" :loading="modalGenerateLoading" long @click="handleConfirmGenerateVideo">
                开始生成
            </a-button>
        </a-form-item>
         <!-- <a-form-item>
            <a-progress :percent="modalGenerateProgress">
              <template v-slot:text="scope" >
                进度 {{scope.percent * 100}}%
              </template>
            </a-progress>
        </a-form-item> -->
        <div style="color: #666; font-size: 12px; margin-left: 10px; display: inline-block;text-align: center;" >
            {{  resultGenerate }}
            <span v-if="elapsed">
              ,本次耗时: {{elapsed}}
            </span>
        </div>
      </a-form>
    </a-modal>
 
</template>

<script setup>
import { ref, reactive, onMounted, computed,onUnmounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
// 检查pywebview是否可用
const pywebviewAvailable = ref(false)

onMounted(async() => {
  fetchConfigs()
  
})

onMounted(() => {
  window.videoProgressCallback = updateVideoProgress
})

onUnmounted(() => {
  window.videoProgressCallback = null
})
const fetchConfigs = async (retryCount = 2) => {
  try {
    ipc.invoke(ipcApiRoute.allList).then(res => {
    console.log(res)
    configList.value = res
    }) 

  } catch (error) {
  }
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '工作目录', dataIndex: 'directory' ,ellipsis: true,
        tooltip: true},
  { title: '输出目录', dataIndex: 'output_video' },
  { title: '操作', slotName: 'actions', width: 180,fixed: 'right' }
]

const configList = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const modalVisible = ref(false)
const isEditMode = ref(false)
const currentId = ref(null)

const formData = reactive({
  title: '',
  directory: '',
  output_video: '',
  file_prefix: '',
  video_width: 1080,
  video_height: 1920,
  scale: 1.0,
  flip: true,
  original: true,
  trim3s: true,
  probability_flip: 0.4,
  probability_original: 0.2,
  probability_trim3s: 0.2,
  probability_scale: 0.2,
  subtitle_alignment: 2,
  subtitle_margin_v: 60,
  subtitle_font_name: '阿里巴巴普惠体',
  subtitle_font_size: 12,
  subtitle_primary_color: '&HFFFFFF',
  subtitle_bold: true,
  subtitle_outline: 1,
  subtitle_outline_color: '&HFF000000',
  subtitle_shadow: 1,
  subtitle_shadow_color: '&H80888888',
  subtitle_position: '',
  subtitle_background_color: '&H80000000',
  subtitle_border_style: 3
})

const modalTitle = computed(() => isEditMode.value ? '编辑配置' : '新建配置')

const showCreateModal = () => {
  isEditMode.value = false
  currentId.value = null
  resetForm()
  modalVisible.value = true
}
const handleAddConfig=()=>{
  modalVisible.value = true
}
const editConfig = (record) => {
  isEditMode.value = true
  currentId.value = record.id
  Object.assign(formData, record)
  modalVisible.value = true
}

const deleteConfig = async (id) => {
  try {
    // 调用删除接口
    const result = await ipc.invoke(ipcApiRoute.deleteConfig, { id })
    
    if (result) {
      Message.success('删除成功')
      // 重新获取配置列表
      fetchConfigs()
    } else {
      Message.error(`删除失败: ${result.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('删除配置失败:', error)
    Message.error(`删除失败: ${error.message || '未知错误'}`)
  }
}

const prepareFormData = () => {
  return {
    title: formData.title,
    directory: formData.directory,
    output_video: formData.output_video,
    file_prefix: formData.file_prefix,
    video_width: formData.video_width,
    video_height: formData.video_height,
    subtitle_alignment: formData.subtitle_alignment,
    subtitle_margin_v: formData.subtitle_margin_v,
    subtitle_font_name: formData.subtitle_font_name,
    subtitle_font_size: formData.subtitle_font_size,
    subtitle_primary_color: formData.subtitle_primary_color,
    subtitle_bold: formData.subtitle_bold,
    subtitle_outline: formData.subtitle_outline,
    subtitle_outline_color: formData.subtitle_outline_color,
    subtitle_shadow: formData.subtitle_shadow,
    subtitle_shadow_color: formData.subtitle_shadow_color,
    subtitle_position: formData.subtitle_position,
    subtitle_background_color: formData.subtitle_background_color,
    subtitle_border_style: formData.subtitle_border_style,
    scale: formData.scale,
    flip: formData.flip,
    original: formData.original,
    trim3s: formData.trim3s,
    probability_flip: formData.probability_flip,
    probability_original: formData.probability_original,
    probability_trim3s: formData.probability_trim3s,
    probability_scale: formData.probability_scale
  }
}

const validateForm = () => {
  if (!formData.directory) {
    Message.error('请填写工作目录')
    return false
  }
  if (!formData.output_video) {
    Message.error('请填写输出目录')
    return false
  }
  if (!formData.video_width || !formData.video_height) {
    Message.error('请填写视频尺寸')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    const configData = prepareFormData()
    if (isEditMode.value) {
      ipc.invoke(ipcApiRoute.updateConfig, {id:currentId.value,data:configData})
    } else {
      ipc.invoke(ipcApiRoute.saveConfig, configData)
    }
    fetchConfigs()
    isEditMode.value = true
  } catch (error) {
    console.error('保存配置失败:', error)
    Message.error(`${isEditMode.value ? '更新' : '创建'}失败: ${error.message || '未知错误'}`)
  }
}

const resetForm = () => {
  isEditMode.value = false
  Object.assign(formData, {
    title: '',
    directory: '',
    output_video: '',
    file_prefix: '',
    video_width: 1080,
    video_height: 1920,
    scale: 1.0,
    flip: false,
    original: false,
    trim3s: false,
    subtitle_alignment: 2,
    subtitle_margin_v: 60,
    subtitle_font_name: '阿里巴巴普惠体',
    subtitle_font_size: 12,
    subtitle_primary_color: '&HFFFFFF',
    subtitle_bold: true,
    subtitle_outline: 1,
    subtitle_outline_color: '&HFF000000',
    subtitle_shadow: 1,
    subtitle_shadow_color: '&H80888888',
    subtitle_position: '',
    subtitle_background_color: '&H80000000',
    subtitle_border_style: 3
  })
}

const handlePageChange = (page) => {
  pagination.current = page
  fetchConfigs()
}

const modalGenerateVisible = ref(false)
const modalGenerateConfig = ref()
const modalGenerateCount = ref(10)
const modalGenerateProgress = ref(0)
const modalGenerateStatus = ref('')
const modalGenerateError = ref(0)
const modalGenerateLoading = ref(false)
const resultGenerate = ref('')
const elapsed = ref()
const handleGenerateVideoModal = async (item) => {
  modalGenerateVisible.value = true
  modalGenerateConfig.value = item
  console.log(item)
}

ipc.on(ipcApiRoute.generateMultipleVideos, (event, result) => {
    console.log('[ipcRenderer] [ipcSendMsg] result:', result);
})
const handleConfirmGenerateVideo = async () => {
  
  modalGenerateLoading.value = true
  modalGenerateProgress.value = 0
  resultGenerate.value = '正在生成视频，请稍等...'
  elapsed.value = ''
  const start = performance.now()
  const result = await ipc.invoke(ipcApiRoute.generateMultipleVideos,{
    directory: modalGenerateConfig.value.directory, 
    file_prefix: modalGenerateConfig.value.file_prefix, 
    id: modalGenerateConfig.value.id, 
    output_video: modalGenerateConfig.value.output_video,
    count: modalGenerateCount.value 
  })
  console.log(result)
  if(result.success){
    Message.success('生成成功')
    if(result.successCount==modalGenerateCount.value ){
      resultGenerate.value = result.successCount
    }
    resultGenerate.value = '视频生成完成'
    // modalGenerateVisible.value = false
  }
  const end = performance.now()
  elapsed.value = formatTime(end-start)
  modalGenerateLoading.value = false
  resultGenerate.value.value = false
}

// 获取批量进度
const updateVideoProgress = async (progress) => {
  console.log(progress)
    if(progress.status=='success'){
      modalGenerateProgress.value = progress.index / modalGenerateCount.value
    }else{
      modalGenerateError.value ++
    }
    
    if(modalGenerateCount.value == progress.index){
      modalGenerateLoading.value = false
    }
}
const handleCloseGenerateVideo = () => {
  modalGenerateVisible.value = false
  modalGenerateConfig.value = null
  modalGenerateProgress.value = 0
  modalGenerateCount.value = 10
  modalGenerateLoading.value = false
  resultGenerate.value = ''
  elapsed.value = ''
}

function formatTime(ms) {
  const totalSeconds = ms / 1000; // 转换为总秒数
  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60); // 秒数取整
    return `${minutes}分钟${seconds}秒`;
  } else {
    return `${totalSeconds.toFixed(1)}秒`; // 不足1分钟时保留1位小数
  }
}
</script>



