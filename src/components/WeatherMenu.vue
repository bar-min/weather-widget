<template>
  <div class="menu" v-if='config.settings'>

    <div class="menu__header">
      <h3 class="menu__title">Settings</h3>
      <div @click="$emit('show-menu', config)" class="menu__close" ></div>
    </div>

    <div class="menu__field">
      <input v-model="city" placeholder="Search location" @keyup.enter="sendValue(city)" />
      <button @click="sendValue(city)"></button>
    </div>

    <div class="menu__locations">
      <div class="location" 
        v-for="item in weather" :key="item.idx"
        @drop="onDrop($event, item.idx)" 
        @dragover.prevent 
        @dragenter.prevent>

        <div @dragstart='onDrag($event, item)' draggable="true" class="location__move"></div>
        <div class="location__city"> {{ item.name }}, {{ item.sys.country }} </div>
        <div @click="$emit('delete-widget', item.idx)" class="location__remove"></div>
      </div>
    </div>

  </div>
</template>

<script>
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
}
</script>

<style>

</style>