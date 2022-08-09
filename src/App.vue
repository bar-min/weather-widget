<template>
  <div class="weather">
    <div class="weather__widget">
      <div class="widget">
  
        <div class="widget__settings">
          <h3 class="widget__location"></h3>
          <div class="widget__setting"></div>
        </div>
        
        <div class="widget__main">
          <div class="widget__picture"></div>
          <div class="widget__temp"></div>
        </div>

        <div class="widget__description"></div>

        <div class="widget__wind wind">
          <div class="wind__speed"></div>
          <div class="wind__pressure"></div>
        </div>

        <div class="widget__sun">
          <div class="widget__sunset"></div>
          <div class="widget__sunrise"></div>
        </div>

        <div class="widget__others">
          <div class="widget__humidity"></div>
          <div class="widget__visibiliy"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',

  data(){
    return {
      weather: {},
      city: 'London',
      key: '08eacdfc0c9a045a4f2e9dfb587137a3'
    }
  },
  
  mounted(){
    this.getWeather();
  },

  methods: {
    async getWeather(){
      let { lat, lon } = await this.getCoords();

      let params = new URLSearchParams({
        appid: this.key,
        lat,
        lon,
        units: 'metric'
      })

      let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)

      this.weather = await response.json();
    },

    async getCoords(){
      let city = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&appid=${this.key}`);

      let [ coords ] = await city.json();

      return coords;
    }
  },

  components: {}
}
</script>

<style>
</style>
