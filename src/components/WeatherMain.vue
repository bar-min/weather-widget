<template>
  <div class="widget" v-if="!config.settings">
    <div class="widget__settings">
      <h3 class="widget__location"> {{ config.name }}, {{ config.sys.country }} </h3>
      <weather-icon name="gear" hover
      @click="$emit('show-menu', config)" 
      v-if="config.hasGear && !config.settings">
      </weather-icon>
    </div>
    
    <div class="widget__condition condition">
      <div class="condition__status">
        <div class="condition__picture">
          <img :src="setValidUnits(config.weather[0].icon, '.png', 'image')" alt="weather-icon">
        </div>
        <div class="condition__temp"> {{ setValidUnits(config.main.temp, '\u00B0', 'temp') }} </div>
      </div>

      <div class="condition__title"> {{ config.weather[0].main }} </div>

      <div class="condition__description">
        <p>Feels like {{ setValidUnits(config.main.feels_like, '\u00B0', 'temp') }} </p>
      </div>
    </div>
    
    <weather-params :config="config"></weather-params>
  </div>
</template>

<script>
import WeatherParams from './WeatherParams.vue';
import WeatherIcon from './WeatherIcon.vue';

export default {
  props: ['config', 'url'],

  emits: ['show-menu'],

  methods: {
    setValidUnits(value, unit = '', type = 'default'){
      switch(type){
        case 'image': {
          return this.url + '/' + value + unit;
        }
        case 'temp': {
          return Math.round(value * 10) / 10 + unit;
        }
        default: {
          return value + '\n' + unit;
        }
      }
    }
  },

  components: { WeatherParams, WeatherIcon }
}
</script>

<style>

</style>