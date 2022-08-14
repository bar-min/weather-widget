<template>
  <div class="menu" v-if='config.settings'>

    <div class="menu__header">
      <h3 class="menu__title">Settings</h3>
      <weather-icon @click="$emit('show-menu', config)" name="close" :width="24" :height="24" hover></weather-icon>
    </div>

    <div class="menu__field">
      <input v-model="city" placeholder="Search location" @keyup.enter="sendValue(city)" />
      <weather-icon @click="sendValue(city)" name="enter" :width="24" :height="24"></weather-icon>
    </div>

    <div class="menu__locations">
      <div class="location" 
        v-for="item in weather" :key="item.idx"
        @drop="onDrop($event, item.idx)" 
        @dragover.prevent 
        @dragenter.prevent>

        <div class="location__move" @dragstart='onDrag($event, item)' draggable="true">
          <weather-icon name="move"></weather-icon>
        </div>
        <div class="location__city"> {{ item.name }}, {{ item.sys.country }} </div>
        <weather-icon @click="$emit('delete-widget', item.idx)" name="remove" :width="24" :height="24" hover></weather-icon>
      </div>
    </div>

  </div>
</template>

<script>
import WeatherIcon from './WeatherIcon.vue';

export default {
  data(){
    return {
      city: ''
    }
  },

  props: ['weather', 'config'],

  emits: ['move-widget', 'delete-widget', 'send-value', 'show-menu'],

  methods: {
    sendValue(inputValue){
      this.$emit('send-value', inputValue);
      this.clearInput();
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
      this.$emit('move-widget', dropIndex, dragIndex)
    },
  },

  components: { WeatherIcon }
}
</script>

<style>

</style>