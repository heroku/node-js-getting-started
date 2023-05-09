import {createApp} from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/css/index.scss'

import router from "@/router";
import {globalComponents} from "@/utils/globalComponents";

const app = createApp(App)
globalComponents(app)
app.use(router)
    .use(ElementPlus)
    .mount('#app')
