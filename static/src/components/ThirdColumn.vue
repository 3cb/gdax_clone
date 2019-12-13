<template>
    <div id="column3">
        <nav v-if="winSize.width <= 1600 && winSize.width > 800" class="level info is-marginless is-paddingless">
          <div class="level-item has-text-centered">
            <div>
              <p class="has-text-weight-bold has-text-primary">{{ selectedProduct.name }}</p>
              <p class="heading">Current Product</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
                <p class="has-text-weight-bold">{{ selectedProduct.price | decimals }} {{ tickerDenom }}</p>
                <p class="heading">Last trade price</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
              <div>
                  <p :class="deltaClass" class="has-text-weight-bold">{{ deltaSign }}{{ selectedProduct.priceDelta24h.toFixed(2) }} %</p>
                  <p class="heading">24 Hour price</p>
              </div>
          </div>
          <div class="level-item has-text-centered">
              <div>
                  <p class="has-text-weight-bold">{{ selectedProduct.volume_24h | formatVolume }} {{ tickerSymbol }}</p>
                  <p class="heading">24 hour volume</p>
              </div>
          </div>
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Price Chart</span>
        </nav>
        <chart></chart>
    </div>
</template>

<script>
import Chart from "./Chart.vue";
import _ from 'lodash'
import { addCommas } from '../lib/numbers.js'


export default {
  filters: {
        formatVolume(volume) {
            return addCommas(Math.round(parseFloat(volume)))
        },
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
        selectedProduct() {
            return this.$store.state.products[this.$store.state.selected_id-1]
        },
        tickerSymbol() {
            var arr = _.split(this.selectedProduct.name, '/')
            return arr[0]
        },
        tickerDenom() {
            var arr = _.split(this.selectedProduct.name, '/')
            return arr[1]
        },
        deltaSign() {
            if (this.selectedProduct.priceDelta24h >= 0) {
                return '+'
            } else {
                return ''
            }
        },
        deltaClass() {
            return this.selectedProduct.deltaClass
        }
    },
  components: {
    Chart
  }
};
</script>

<style>
#column3 {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
