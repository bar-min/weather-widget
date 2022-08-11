<template>
  <div class="weather" v-for="config in weather" :key="config.idx">
    <div class="weather__widget">

      <div class="weather__config config" v-if='config.settings'>

        <div class="config__header">
          <h3 class="config__title">Settings</h3>
          <div class="config__close" @click="showSettings(config)"></div>
        </div>

        <div class="config__field">
          <input v-model="city" placeholder="Search location" @keyup.enter="getWeatherData(city)" />
          <button @click="getWeatherData(city)"></button>
        </div>

        <div class="config__locations">
          <div class="location" 
            v-for="item in weather" :key="item.idx"
            @drop="onDrop($event, item.idx)" 
            @dragover.prevent 
            @dragenter.prevent>

            <div @dragstart='onDrag($event, item)' draggable="true" class="location__move"></div>
            <div class="location__city"> {{ item.name }}, {{ item.sys.country }} </div>
            <div @click="deleteWidget(item.idx)" class="location__remove"></div>
          </div>
        </div>

      </div>

      <div class="widget"  v-if="!config.settings">
        <div class="widget__settings settings">
          <h3 class="settings__location"> {{ config.name }}, {{ config.sys.country }} </h3>
          <div class="settings__gear" @click="showSettings(config)"></div>
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
export default {
  name: 'App',

  data(){
    return {
      weather: [],
      city: '',
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

      this.clearInput();
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
      this.saveWeather();
    },

    addWidget(){
      let widget = this.getWeatherStorage();
      
      if(widget){
        this.weather = widget;
        return;
      }

      this.getWeatherData(this.default);
    },
    
    showSettings(widget){
      this.weather.forEach((item) => {
        if(item.idx === widget.idx){
          item.settings = !item.settings;
        }
      })
    },

    deleteWidget(idx){
      if(this.weather.length <= 1) return;
      let id = this.weather.findIndex(item => item.idx === idx);
      this.weather.splice(id, 1);
      this.saveWeather();
    },

    saveWeather(){
      if(!this.weather.length) return;
      localStorage.setItem('weather', JSON.stringify(this.weather));
    },

    getWeatherStorage(){
      let weather = localStorage.getItem('weather');
      if(weather){
        let data = JSON.parse(weather)
        data.forEach(item => item.settings = false)
        return data;
      } 
    },

    clearInput(){
      this.city = '';
    },

    onDrag(event, location){
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('locationID', location.idx)
    },
    
    onDrop(event, idx){
      let locationID = event.dataTransfer.getData('locationID');
      let dropIndex = this.weather.findIndex(item => item.idx == idx);
      let dragIndex = this.weather.findIndex(item => item.idx == locationID);
      this.weather.splice(dropIndex, 0, this.weather.splice(dragIndex, 1)[0]);
      this.saveWeather();
    },
  },

  components: {}
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

.weather {
  min-height: 200px;
  display: inline-flex;
  background: linear-gradient(180deg, #6a6d9c 0%, rgba(255, 255, 255, 0) 100%), #1d2362;
  color:#f9ffff;
  border: 0.5px solid #7582F4;
  border-radius: 40px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 12px 24px;
  margin: 10px;

   .config{
    &__header{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    &__close{
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: url('./assets/icons/close.svg') no-repeat;
      transition: all 0.3s;
      &:hover{
        transform: scale(1.15);
      }
    }
    &__field{
      text-align: center;
      margin-bottom: 20px;
      position: relative;
      & > input {
        font-family: inherit;
        font-size: 18px;
        width: 80%;
        padding: 10px;
        border-radius: 4px;
        outline: none;
        border: none;
      }
      & > button {
        cursor: pointer;
        position: absolute;
        width: 24px;
        height: 100%;
        border: none;
        top: 50%;
        transform: translateY(-50%);
        background: url('@/assets/icons/enter.svg') center no-repeat;
        background-size: contain;
      }
    }
    &__locations{
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 50px;
    }
    .location {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px;
      margin: 0 12px;
      border-radius: 10px;
      background-color: rgba(255,255,255, 0.15);
      &__move{
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('@/assets/icons/move.svg') center no-repeat;
      }
      &__city{
        flex: 1 1 auto;
      }
      &__remove{
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('@/assets/icons/remove.svg') center no-repeat;
        transition: all 0.3s;
        &:hover{
          transform: scale(1.15);
        }
      }
    }
  }

  .widget{
    &__settings{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .settings{
      &__gear{
        cursor: pointer;
        width: 24px;
        height: 24px;
        background: url('./assets/icons/settings.svg') no-repeat;
        transition: all 0.3s;
        &:hover{
          transform: scale(1.15);
        }
      }
    }
    &__condition{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .condition{
      margin-bottom: 20px;
      &__status{
        display: flex;
        align-items: center;
      }
      &__temp{
        font-size: 60px;
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: flex-start;
       }
       &__title{
         font-size: 30px;
       }
      &__description{
        & > p {
          margin: 0px;
          padding: 7.5px 15px;
          background-color: rgb(255 255 255 / 9%);
          border-radius: 10px;
        }
      }
    }
    &__params{
      display: flex;
      justify-content: space-evenly;
    }
    .params{
      padding-bottom: 15px;
      &__list{
        display: flex;
        flex-direction: column;
        gap: 10px;
        & > div {
          display: flex;
          gap: 4px;
          &:before{
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            background-position: center;
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
      }
      &__sunset{
        &:before{
          background-image: url('@/assets/icons/sunset.svg');
        }
      }
      &__sunrise{
        &:before{
          background-image: url('@/assets/icons/sunrise.svg');
        }
      }
      &__humidity{
        &:before{
          background-image: url('@/assets/icons/humidity.svg');
       }
      }
      &__visibility{
        &:before{
          background-image: url('@/assets/icons/visibility.svg');
        }
      }
      &__speed{
        &:before{
          background-image: url('@/assets/icons/wind.svg');
        }
      }
      &__pressure{
        &:before{
          background-image: url('@/assets/icons/pressure.svg');
        }
      }
    }
  }
}

</style>
