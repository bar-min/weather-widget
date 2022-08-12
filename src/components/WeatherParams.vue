<template>
  <div class="params">
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
</template>

<script>
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
  }
}
</script>

<style>

</style>