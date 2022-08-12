<template>
  <div class="weather" v-for="config in weather" :key="config.idx">
    <div class="weather__widget">
      
      <weather-menu 
      :weather="weather" 
      :config="config"
      @show-menu="showMenu"
      @move-widget="moveWidget"
      @delete-widget="deleteWidget"
      @send-value="getWeatherData"
      ></weather-menu>

      <div class="widget" v-if="!config.settings">
        <div class="widget__settings settings">
          <h3 class="settings__location"> {{ config.name }}, {{ config.sys.country }} </h3>
          <div class="settings__gear" @click="showMenu(config)"></div>
        </div>
        
        <div class="widget__condition condition">
          <div class="condition__status">
            <div class="condition__picture">
              <img :src="validURL(config.weather[0].icon)" alt="weather">
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
    </div>
  </div>
</template>

<script>
import WeatherMenu from './WeatherMenu.vue';

export default {
  data(){
    return {
      weather: [],
      default: 'London',
      key: '08eacdfc0c9a045a4f2e9dfb587137a3',
      imgURL: 'https://openweathermap.org/img/wn',
    }
  },
  
  mounted(){
    this.addWidget();
  },

  computed: {
    validUnits(){
      return (value, unit = '') => value + '\n' + unit;
    },
    validURL(){
      return (icon) => this.imgURL + '/' + icon + '.png';
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

  methods: {
    async getWeatherData(city){
      if(!city) return;

      let { lat, lon } = await this.getCoords(city);

      let params = new URLSearchParams({
        appid: this.key,
        lat,
        lon,
        units: 'metric'
      })

      let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`)

      let data = await response.json();

      this.setWeather(data);
    },

    async getCoords(location){
      let city = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${this.key}`);
    
      let [ coords ] = await city.json();

      return coords;
    },

    setWeather(data){
      data.settings = false;
      data.idx = Date.now();
      this.weather.push(data);
      this.saveWidget();
    },

    getWeatherStorage(){
      let weather = localStorage.getItem('weather');
      if(weather){
        let data = JSON.parse(weather)
        data.forEach(item => item.settings = false)
        return data;
      } 
    },

    addWidget(){
      let widget = this.getWeatherStorage();
      
      if(widget){
        this.weather = widget;
        return;
      }

      this.getWeatherData(this.default);
    },
    
    showMenu(widget){
      this.weather.forEach((item) => {
        if(item.idx === widget.idx){
          item.settings = !item.settings;
        } else {
          item.settings = false;
        }
      })
    },

    deleteWidget(idx){
      if(this.weather.length <= 1) return;
      let id = this.weather.findIndex(item => item.idx === idx);
      this.weather.splice(id, 1);
      this.saveWidget();
    },

    moveWidget(from, to){
      this.weather.splice(to, 0, this.weather.splice(from, 1)[0]);
      this.saveWidget();
    },

    saveWidget(){
      if(!this.weather.length) return;
      localStorage.setItem('weather', JSON.stringify(this.weather));
    },
  },

  components: { WeatherMenu }
}
</script>

<style lang="scss">
@import '@/styles/styles.scss';
</style>
