<template>
  <div class="menu-demo">
    <div class="appname">
      <a-dropdown @select="handleSelect">
        <a-button type="primary"> {{buttonText}} <icon-down /></a-button>
        <template #content>
          <a-doption>抖音</a-doption>
          <a-doption disabled>视频号</a-doption>
          <a-doption disabled>拼多多</a-doption>
          <a-doption disabled>快手</a-doption>
          <a-doption disabled>淘宝</a-doption>
        </template>
      </a-dropdown>
    </div>
    <div class="expiry">
        有效期：{{ result?.expires_at.split('T')[0]  }}
        <span v-if="!result?.is_active">
            <a-button size="mini">续费</a-button>
        </span>
    </div>
  </div>
  <div class="container">
    <router-view/>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
const router = useRouter();
const buttonText = ref('抖音')
const result = ref()
onMounted(async ()=>{
    //  result.value = await ipc.invoke(ipcApiRoute.fetchUserInfo)
    result.value = { "machine_id": "82213027-2b64-509b-b215-2d54c2c0ff34", "expires_at": "2025-12-23T23:59:59.999+00:00", "is_active": false }
     console.log(result.value)
})
const handleSelect = (v) => {
  buttonText.value = v
  let routerName = ''
  switch (v) {
    case '抖音':
        routerName = 'DouyinIndex'
        break;
    case '快手':
        routerName = 'KuaishouIndex'
        break;
    case '视频号':
        routerName = 'ShipinhaoIndex'
        break;
    case '拼多多':
        routerName = 'PinduoduoIndex'
        break;
    case '淘宝':
        routerName = 'TaobaoIndex'
        break;
  
    default:
        break;
  }
  router.push({ name: routerName });

};
</script>

<style scoped>
.menu-demo {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(var(--arcoblue-7));
  color: var(--color-bg-1);
  font-size: var(font-size-title-2);
}

.appname {
  font-size: var(--font-size-title-1);
  font-weight: bold;
  margin-left: 8px;
}
.expiry {
  font-size: var(--arcoblue-7);
  font-size: 12px;
}
.container {
  height: calc(100vh - 49.99px);
  padding: 10px;
  
  /* overflow: auto; */

}

.arco-dropdown-open .arco-icon-down {
  transform: rotate(180deg);
}
</style>
