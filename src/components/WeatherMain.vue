<template>
  <div class="widget" v-if="!config.settings">
    <div class="widget__settings settings">
      <h3 class="settings__location"> {{ config.name }}, {{ config.sys.country }} </h3>
      <div class="settings__gear" @click="$emit('show-menu', config)"></div>
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
        <p>Feels like {{ setValidUnits(config.main.feels_like, '\u00B0', 'temp') }} - {{ config.weather[0].description }}.</p>
      </div>
    </div>
    
    <div class="widget__params params">
      <div class="params__list">
        <div class="params__speed icon"> {{ setValidParams(config.wind.speed, 'm/s')}} </div>
        <div class="params__sunset icon"> {{ setValidParams(config.sys.sunset, '', 'date') }} </div>
        <div class="params__humidity icon"> {{ setValidParams(config.main.humidity, '%') }} </div>
      </div>

      <div class="params__list">
        <div class="params__pressure icon"> {{ setValidParams(config.main.pressure, 'hpA') }} </div>
        <div class="params__sunrise icon"> {{ setValidParams(config.sys.sunrise, '', 'date') }} </div>
        <div class="params__visibility icon"> {{ setValidParams(config.visibility, 'km', 'distance') }} </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['config', 'url'],

  emits: ['show-menu'],

  methods: {
    setValidParams(value, unit = '', type = 'default'){
      switch(type){
        case 'date': {
          let date = new Date(value * 1000);
          let time = date.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', hour12: true });
          return time;
        }
        case 'distance': {
          return (value / 1000).toFixed(1) + '\n' + unit;
        }
        default: {
          return value + '\n' + unit;
        }
      }
    },
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
  }
}
</script>

<style>

</style>