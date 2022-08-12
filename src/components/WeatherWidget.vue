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

      <weather-main
      :config="config"
      :url="imgURL"
      @show-menu="showMenu">
      </weather-main>

    </div>
  </div>
</template>

<script>
import WeatherMenu from './WeatherMenu.vue';
import WeatherMain from './WeatherMain.vue';

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

  components: { WeatherMenu, WeatherMain }
}
</script>

<style lang="scss">
@import '@/styles/styles.scss';
</style>
