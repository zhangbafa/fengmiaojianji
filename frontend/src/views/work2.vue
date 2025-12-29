<template>
  <div id="app-os-subwindow-ipc">
    <div class="one-block-1">
      <span>
        1. 发送异步消息
      </span>
    </div>  
   
    <div class="one-block-1">
      <span>
        4. 多窗口通信：窗口之间互相通信
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button @click="sendTosubWindow()">向主窗口发消息</a-button>
      </a-space>
    </div>       
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
import { Message } from '@arco-design/web-vue';

const messageString = ref('');
const message1 = ref('');
const message2 = ref('');
const message3 = ref('');

onMounted(() => {
  init()
})

function init() {
 

  // 监听主窗口发来的消息
  ipc.removeAllListeners(ipcApiRoute.window1ToWindow2);
  ipc.on(ipcApiRoute.window1ToWindow2, (event, arg) => {
      // message.info(arg);
      Message.info(arg)
  })  
}



function sendTosubWindow () {
  const params = {
    receiver: 'main',
    content: '窗口2给主窗口发送消息'
  }
  ipc.invoke(ipcApiRoute.window1ToWindow2, params)
}
</script>
<style lang="less" scoped>
#app-os-subwindow-ipc {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  height: 100%;
  background-color: transparent;
  -webkit-app-region: drag;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}

body{
  background-color: transparent;
}
</style>
