<template>
  <div class="home-container">
    <PaletteGenerator />
  </div>
</template>

<script>
import PaletteGenerator from '../components/PaletteGenerator.vue'

export default {
  components: {
    PaletteGenerator
  }
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>