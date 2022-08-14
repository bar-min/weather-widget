import { createApp } from 'vue'
import App from './App.vue'
import WebComponent from './weather';
import './styles/global.scss'

document.body.append(new WebComponent())

createApp(App).mount('#app')
