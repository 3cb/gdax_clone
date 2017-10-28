<template>
    <div id="container">
        <nav class="level info is-marginless is-paddingless">
                <div class="level-left"></div>
                <div class="level-right">
                    <span><a><i class="fa fa-bars" aria-hidden="true"></i></a></span>
                </div>
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
    sales() {
      return this.$store.state.products[this.index].sales;
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
#container {
  height: 100%;
}
</style>
