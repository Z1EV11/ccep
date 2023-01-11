import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import './assets/main.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/index.css'
import './styles/element/index.scss'

const app = createApp(App)
const store = createPinia()

store.use(piniaPluginPersistedstate)
app.use(store)    
app.use(router)

app.mount('#app')
