<template>
  <div class="params">
    <div class="params__list">
      <params-item name="wind"> {{ setValidParams(config.wind.speed, 'm/s') }} </params-item>

      <params-item name="sunset"> {{ setValidParams(config.sys.sunset, '', 'date') }} </params-item>

      <params-item name="humidity"> {{ setValidParams(config.main.humidity, '%') }} </params-item>
    </div>

    <div class="params__list">
      <params-item name="pressure"> {{ setValidParams(config.main.pressure, 'hpA') }} </params-item>

      <params-item name="sunrise"> {{ setValidParams(config.sys.sunrise, '', 'date') }} </params-item>
      
      <params-item name="visibility"> {{ setValidParams(config.visibility, 'km', 'distance') }} </params-item>
    </div>
  </div>
</template>

<script>
import ParamsItem from './ParamsItem.vue';

export default {
  props: ['config'],

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
    }
  },

  components: { ParamsItem }
}
</script>

<style>

</style>