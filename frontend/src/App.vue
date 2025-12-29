<template>
  <router-view/>
</template>
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
const loadingElement = document.getElementById('loadingPage');
if (loadingElement) {
  loadingElement.remove();
}
});
</script>
<style lang="less">
html,body{
  height: 100%;
  margin: 0;
}
</style>
