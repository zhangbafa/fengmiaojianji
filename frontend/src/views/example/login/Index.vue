<template>
  <div id="effect-login-window">
    <a-card style="width: 90%">
      <a-form :model="form"
              @submit="handleSubmit" layout="vertical">
        <a-form-item field="machineID"
                     label="机器码">
          <a-input v-model="form.machineID" readonly="true" feedback/>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit"
                    type="primary"
                    long>登录</a-button>
        </a-form-item>
         <a-form-item>
          {{ tips }}如需要请点击
          <a-link @click="handleXufei">续期</a-link>。
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
import dayjs from 'dayjs'
const form = reactive({
  machineID: '',
  isRead: true
});


const router = useRouter();
const loading = ref(false);
const loginText = ref('正在登陆......');
const machineID = ref('')
const indate = ref(false)
const expiredDate = ref()
const tips = ref('')
onMounted(async () => {
  form.machineID =  await ipc.invoke(ipcApiRoute.getMachineId) 
  const result = await ipc.invoke(ipcApiRoute.fetchUserInfo,{macid:form.machineID})
  console.log(result)
  if(result && result.success){
    tips.value = `有效期至${result?.indate ?? ''},`
  }else{
    tips.value = '登录将获得 30 天的免费试用期,'
  }
})


const handleSubmit = async (data) => {
  const result = await ipc.invoke(ipcApiRoute.loginByMachineID,{macid:form.machineID})
  console.log(result)
  if(result && result.success && !result.isExpired){
    router.push({ name: 'DashboardIndex' });
    ipc.invoke(ipcApiRoute.restoreWindow, { width: 980, height: 650 })
  }else{
    Message.error('登录失败')
  }
  
};

const handleXufei=async ()=>{
  await ipc.invoke(ipcApiRoute.openExternal,'http://baidu.com')
}
</script>
<style lang="less" scoped>
#effect-login-window {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

}</style>
  