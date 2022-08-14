<template>
  <svg class="weather-icon" :class="{'weather-icon-hover' : hover}" xmlns="http://www.w3.org/2000/svg" 
  :height="height" :width="width" :fill='fill' v-html="icons[name]"></svg>
</template>

<script>
import icons from '@/icons';

export default {
  props: {
    name: String,
    hover: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 20
    },
    width: {
      type: Number,
      default: 20
    },
    fill: {
      type: String,
      default: '#FFF'
    }
  },

  data(){
    return {
      icons
    }
  }
}
</script>

<style>
</style>