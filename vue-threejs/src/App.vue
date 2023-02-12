<template>
  <div id="app">
    <ThreejsDemo></ThreejsDemo>
  </div>
</template>

<script>
import ThreejsDemo from './components/ThreejsDemo'

export default {
  name: 'App',
  components: {
    ThreejsDemo
  }
}
</script>

<style lang="less">
#app {
  margin: 0;
  padding: 0;
}
</style>
