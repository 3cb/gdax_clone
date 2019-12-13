<template>
    <div id="column4">
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Trade History</span>
        </nav>
        <time-sales :trades="trades" :denom="tickerDenom"></time-sales>
    </div>
</template>

<script>
import TimeSales from "./TimeSales.vue";
import _ from "lodash";
import { addCommas } from '../lib/numbers.js'

export default {
  data() {
    return {};
  },
  computed: {
    winSize() {
      return this.$store.state.win
    },
    index() {
      return _.findIndex(this.$store.state.products, o => {
        return o.product_id === this.$store.state.selected_product;
      });
    },
    currentPrice() {
      return this.$store.state.products[this.index].price
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
  padding-right: .75rem;
}

</style>
