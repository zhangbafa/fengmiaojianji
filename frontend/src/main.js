import { createApp } from 'vue';
import App from './App.vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

import './assets/global.less';
import components from './components/global';
import Router from './router/index';

const app = createApp(App)

// components
for (const i in components) {
  app.component(i, components[i])
}

app
.use(ArcoVue)
.use(ArcoVueIcon)
.use(Router).mount('#app')

