<template>
  <dashboard class="dashboard is-marginless is-paddingless"></dashboard>
</template>

<script>
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'app',
  components: {
    Dashboard
  }
}
</script>

<style>
body {
      height: 100vh;
      overflow: hidden;
    }

div {
  margin-bottom: -12x;
}

.dashboard {
  height: 100vh;
}

.info {
  height: 50px;
}
</style>
