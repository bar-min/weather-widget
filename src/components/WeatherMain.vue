<template>
  <div class="widget" v-if="!config.settings">
    <div class="widget__settings settings">
      <h3 class="settings__location"> {{ config.name }}, {{ config.sys.country }} </h3>
      <div class="settings__gear" @click="$emit('show-menu', config)"></div>
    </div>
    
    <div class="widget__condition condition">
      <div class="condition__status">
        <div class="condition__picture">
          <img :src="validURL(config.weather[0].icon)" alt="weather-icon">
        </div>
        <div class="condition__temp"> {{ validTemp(config.main.temp) }} </div>
      </div>

      <div class="condition__title"> {{ config.weather[0].main }} </div>

      <div class="condition__description">
        <p>Feels like {{ validTemp(config.main.feels_like)}} - {{ config.weather[0].description }}.</p>
      </div>
    </div>
    
    <div class="widget__params params">
      <div class="params__list">
        <div class="params__speed icon"> {{ validUnits(config.wind.speed, 'm/s')}} </div>
        <div class="params__sunset icon"> {{ validDate(config.sys.sunset) }} </div>
        <div class="params__humidity icon"> {{ validUnits(config.main.humidity, '%') }} </div>
      </div>

      <div class="params__list">
        <div class="params__pressure icon"> {{ validUnits(config.main.pressure, 'hpA') }} </div>
        <div class="params__sunrise icon"> {{ validDate(config.sys.sunrise) }} </div>
        <div class="params__visibility icon"> {{ validDistance(config.visibility) }} </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['config', 'url'],

  emits: ['show-menu'],

  computed: {
    validUnits(){
      return (value, unit = '') => value + '\n' + unit;
    },
    validURL(){
      return (icon) => this.url + '/' + icon + '.png';
    },
    validDistance(){
      return (value, unit = 'km') => (value / 1000).toFixed(1) + '\n' + unit;
    },
    validDate(){
      return (ms) => {
        let date = new Date(ms * 1000);
        let time = date.toLocaleString('en-US', { hour: '2-digit', minute: 'numeric', hour12: true });
        return time;
      }
    },
    validTemp(){
      return (temp) => Math.round(temp * 10) / 10 + '\u00B0';
    }
  },
}
</script>

<style>

</style>