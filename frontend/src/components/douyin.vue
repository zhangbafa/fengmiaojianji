<template>
  <div class="container">
       <a-form :model="form"
              @submit="handleSubmit"
              layout="">
        <a-form-item field="content"
                     label="滚动方向">
          <a-radio-group v-model="form.direction">
            <a-radio value="vertical">向上</a-radio>
            <a-radio value="horizontal">向左</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="speed"
                     label="滚动速度">
          <a-input v-model.number="form.speed">
            <template #append>
              秒
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="delay"
                     label="停顿时间">
          <a-input v-model.number="form.delay">
            <template #append>
              秒
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="content"
                     label="滚动模式">
          <a-space direction="vertical"
                   fill>
            <a-radio-group v-model="form.type">
              <a-radio value="type1">
                <img :src="type1"
                     alt=""
                     style="width: 240px;">
              </a-radio>
              <a-radio value="type2">
                <img :src="type2"
                     alt=""
                     style="width: 240px;">
              </a-radio>
              <a-radio value="type3">
                <img :src="type3"
                     alt=""
                     style="width: 240px;">
              </a-radio>
            </a-radio-group>
          </a-space>
        </a-form-item>
        <a-form-item field="content"
                     label="滚动内容"
                     v-if="form.type == 'type1'">
          <a-textarea placeholder="输入滚动内容，每行一个"
                      v-model="form.content"
                      :auto-size="{
                        minRows: 20
                      }" />

        </a-form-item>
        <a-form-item field="title"
                     label="抢购标题"
                     v-if="form.type == 'type3'">
          <a-input v-model="form.title" />

        </a-form-item>
        <a-button long
                  html-type="submit"
                  type="primary"
                  status="info">提交</a-button>
        <a-divider orientation="center">OR</a-divider>
        <a-button type="primary"
                  long
                  status="success"
                  @click="createWindow">打开新窗口</a-button>
      </a-form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
import { Message } from '@arco-design/web-vue';
import type1 from '@/assets/1.png'
import type2 from '@/assets/2.png'
import type3 from '@/assets/3.png'
onMounted(async () => {
  // const configDir = await appConfigDir();
  // const storePath = await join(configDir, 'settings');

  // const store = await Store.load(storePath);
  // const savedPath = await store.get('config');
  // console.log(savedPath)
  // form.content = savedPath.content
  // form.direction = savedPath.direction
  // form.title = savedPath.title
  // form.type = savedPath.type 
  // form.delay = savedPath.delay ?? 2
  // form.speed = savedPath.speed ?? 0.5
  // 监听 窗口2 发来的消息
  ipc.removeAllListeners(ipcApiRoute.window2ToWindow1);
  ipc.on(ipcApiRoute.window2ToWindow1, (event, arg) => {
    Message.info(arg);
  })
})

const form = reactive({
  content: '',
  direction: 'horizontal',
  type: 'type2',
  title: '',
  delay: 2,
  speed: 0.5
});
const handleSubmit = async (data) => {
  const params = {
    receiver: 'window2',
    content: '窗口1给窗口2发送消息'
  }
  ipc.invoke(ipcApiRoute.window1ToWindow2, params)
  alert(1)
  return false
  // 强制转换为数字，非数字则用默认值
  const speed = Number(form.speed) || 0.5;
  const delay = Number(form.delay) || 2;

  // 保存转换后的值
  const configToSave = {
    ...form,
    speed,
    delay
  };
  try {
    // 使用Store.load方法创建Store实例
    const configDir = await appConfigDir();
    const storePath = await join(configDir, 'settings');
    const store = await Store.load(storePath);

    await store.set('config', configToSave);
    await store.save();
    Message.success('提交成功');
    console.log('音频目录路径已保存:', form);
  } catch (error) {
    console.error('保存音频目录路径失败:', error);
    Message.error('提交失败');
  }
};

const createWindow = (index) => {
  ipc.invoke(ipcApiRoute.createWindow, {
    type: 'vue',
    content: '#/show/show',
    windowName: 'window2',
    windowTitle: 'vue window'
  })
}


</script>

<style>.container {
  height: calc(100vh - 20px);
  padding: 10px;
  background: #fff;
  overflow: auto;
}</style>