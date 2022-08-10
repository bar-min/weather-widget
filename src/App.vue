<template>
  <div class="weather" v-for="config in weather" :key="config.id">
    <div class="weather__widget">
      <div class="widget">
  
        <div class="widget__settings settings">
          <h3 class="settings__location"> {{ config.name }}, {{ config.sys.country }} </h3>
          <div class="settings__open"></div>
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
            <div class="params__speed icon"> {{ config.wind.speed + 'm/s'}} </div>
            <div class="params__sunset icon"> {{ validDate(config.sys.sunset) }} </div>
            <div class="params__humidity icon"> {{ config.main.humidity + '%' }} </div>
          </div>

          <div class="params__list">
            <div class="params__pressure icon"> {{ config.main.pressure + 'hpA' }} </div>
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
      city: 'London',
      key: '08eacdfc0c9a045a4f2e9dfb587137a3',
      imgURL: 'https://openweathermap.org/img/wn'
    }
  },
  
  mounted(){
    this.getWeatherData();
  },

  computed: {
    validURL(){
      return (icon) => this.imgURL + '/' + icon + '.png';
    },
    validDistance(){
      return (value, unit = 'km') => (value / 1000).toFixed(1) + unit;
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
    async getWeatherData(){
      let { lat, lon } = await this.getCoords();

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

    async getCoords(){
      let city = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&appid=${this.key}`);

      let [ coords ] = await city.json();

      return coords;
    },

    setWeather(data){
      this.weather.push(data);
      console.log(this.weather)
    }
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
  max-width: 320px;
  background: linear-gradient(180deg, #6a6d9c 0%, rgba(255, 255, 255, 0) 100%), #1d2362;
  color:#f9ffff;
  border: 0.5px solid #7582F4;
  border-radius: 10%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  .widget{
    padding: 12px 18px;
    &__settings{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .settings{
      &__open{
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
          margin: 0px 10px;
          padding: 5px;
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
