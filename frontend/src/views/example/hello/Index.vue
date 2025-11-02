<template>
  <a-config-provider>
    <div class="app">
      <a-layout>
        <a-layout-content>
          <VideoConfigManager />
        </a-layout-content>
      </a-layout>
    </div>
  </a-config-provider>
</template>


<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.app {
  min-height: 100vh;
  background-color: rgb(var(--color-neutral-3))
}

h1 {
  margin: 0;
  color: white;
}

.a-layout-header {
  background-color: var(--color-primary);
  /* padding: 0 24px; */
  /* height: 64px; */
  /* line-height: 64px; */
}

.a-layout-content {
  padding: 24px;
  /* background: #fff; */
}

.a-layout-footer {
  text-align: center;
  background-color: var(--color-bg-2);
  padding: 16px 24px;
}

.error-message {
  color: red;
  padding: 10px;
  margin: 10px;
  margin-bottom: 15px;
  border: 1px solid red;
  background-color: #ffeeee;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import VideoConfigManager from '@/components/VideoConfigManager.vue'

</script>
<style scoped>
section {
  padding: 20px;
}

#hero {
  padding: 150px 32px;
  text-align: center;
  height: 100%;
}

.tagline {
  font-size: 52px;
  line-height: 1.25;
  font-weight: bold;
  letter-spacing: -1.5px;
  max-width: 960px;
  margin: 0px auto;
}
html:not(.dark) .accent,
.dark .tagline {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  max-width: 960px;
  line-height: 1.5;
  color: var(--vt-c-text-2);
  transition: color 0.5s;
  font-size: 22px;
  margin: 24px auto 40px;
}
.actions a {
  font-size: 16px;
  display: inline-block;
  background-color: var(--vt-c-bg-mute);
  padding: 8px 18px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.5s, color 0.5s;
  text-decoration:none;
}
.actions .setup {
  color: var(--vt-c-text-code);
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
}
.actions .setup:hover {
  background-color: var(--vt-c-gray-light-4);
  transition-duration: 0.2s;
}
</style>
  