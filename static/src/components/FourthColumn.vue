<template>
    <div id="column4">
        <nav class="level info is-marginless is-paddingless">
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Trade History</span>
        </nav>
        <time-sales class="is-marginless is-paddingless" :trades="trades" :denom="tickerDenom"></time-sales>
    </div>
</template>

<script>
import TimeSales from "./TimeSales.vue";
import _ from "lodash";

export default {
  data() {
    return {};
  },
  computed: {
    index() {
      return _.findIndex(this.$store.state.products, o => {
        return o.product_id === this.$store.state.selected_product;
      });
    },
    tickerDenom() {
      return this.$store.state.selected_denom
    },
    trades() {
      return this.$store.state.products[this.index].trades
    }
  },
  components: {
    TimeSales
  }
};
</script>

<style>
#column4 {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>
