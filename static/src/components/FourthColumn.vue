<template>
    <div id="column4">
        <nav class="level info is-marginless is-paddingless">
          <div class="level-item has-text-centered" v-if="winSize.width <= 1600 && winSize.width > 769">
            <div>
                <p class="has-text-weight-bold">{{ currentPrice | decimals }} {{ tickerDenom }}</p>
                <p class="heading">Last trade price</p>
            </div>
          </div>
        </nav>
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
  filters: {
    decimals(price) {
            if (price < 1 ) {
                return addCommas((parseFloat(price)).toFixed(5))
            } else {
                return addCommas((parseFloat(price)).toFixed(2))
            }
        }
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
