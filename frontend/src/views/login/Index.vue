<template>
  <div id="effect-login-window">
    <!-- <img :src="icon" alt="" class="logo"> -->
     <div style="padding: 20px;">
      <div class="shake-container">
        <img :src="logo" alt="" style="width: 70px;">
      </div>
     </div>
    <a-card style="width: 90%">

      <a-form :model="form"
              @submit="handleSubmit"
              layout="vertical" size="large">
        <a-form-item field="machineID"
                     label="使用机器码登录">
          <a-input v-model="form.machineID"
                   feedback />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit"
                    type="primary"
                    :loading="loading"
                    long>
            登录
          </a-button>
        </a-form-item>
        
      </a-form>
    </a-card>
  </div>
</template>



<script setup>
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue'
import logo from '@/assets/100.png'
const form = reactive({
  machineID: '',
  isRead: true
});


const router = useRouter();
const loading = ref(false);
const tips = ref('')
const loginButtonText = ref('登录')
onMounted(async () => {
  form.machineID = await ipc.invoke(ipcApiRoute.getMachineId)
  // const result = await ipc.invoke(ipcApiRoute.fetchUserInfo, { machine_id: form.machineID })
  // console.log(result)
  // if (result && result.error && result.error == '设备未注册') {
  //   loginButtonText.value = "免费试用"
  // } else {
  //   loginButtonText.value = "登录"
  // }
})


const handleSubmit = async (data) => {
  loading.value = true
  // router.push({ name: 'DouyinIndex' });
  const result = await ipc.invoke(ipcApiRoute.loginByMachineID)
  if (result && result.status) {
    // router.push({ name: 'DashboardIndex' });
    if(result.status=='new_registered'){
      Message.success(result.message)
    }
    if(result.status == 'existing_device'){
      Message.success('登录成功')
    }
    
    setTimeout(() => {
      router.push({ name: 'DouyinIndex' });
      ipc.invoke(ipcApiRoute.restoreWindow, { width: 380, height: 650 })
    }, 1500);
    // 
  } else {
    Message.error('登录失败')
  }
  loading.value = false

};
</script>
<style lang="less" scoped>
#effect-login-window {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.logo{
  width: 50px;
  margin-bottom: 15px;
}

.shake-container {
  animation: shake 2s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-8px) rotate(-5deg);
  }
  75% {
    transform: translateX(8px) rotate(5deg);
  }
}
</style>
  