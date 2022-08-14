<template>
  <div class="params__item">
    <weather-icon :name="name"></weather-icon>
    <p> <slot></slot> </p>
  </div>
</template>

<script>
import WeatherIcon from './WeatherIcon.vue';
export default {
  props: ['name'],

  components: { WeatherIcon }
}
</script>

<style>

</style>