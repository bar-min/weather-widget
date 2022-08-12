<template>
  <div class="params__item">
    <img :src="require(`@/assets/icons/${name}.svg`)" :alt="name">
    <p> <slot></slot> </p>
  </div>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style>

</style>