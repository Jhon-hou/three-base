import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'
import Element from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

createApp(App).use(Element).use(store).use(router).mount('#app')
