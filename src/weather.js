import { defineCustomElement } from 'vue'
import WeatherWidget from './components/WeatherWidget.ce.vue'

const WebComponent = defineCustomElement(WeatherWidget)

customElements.define('weather-widget', WebComponent)

export default WebComponent
