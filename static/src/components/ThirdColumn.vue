<template>
    <div id="cont3">
        <nav class="level info is-marginless is-paddingless"></nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Price Chart</span>
        </nav>
        <chart></chart>
    </div>
</template>

<script>
import Chart from "./Chart.vue";

export default {
  components: {
    Chart
  }
};
</script>

<style>
#cont3 {
  width: 100%;
  height: 100vh;
}
</style>
