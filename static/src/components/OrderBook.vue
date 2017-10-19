<template>
<div>
    <nav class="level info is-marginless is-paddingless">
        <div class="level-item has-text-centered">
            <div>
                <p class="has-text-weight-bold">{{ selectedProduct.last }} {{ tickerDenom }}</p>
                <p class="heading">Last trade price</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <p :class="deltaClass">{{ deltaSign }}{{ selectedProduct.priceDelta24h }} %</p>
                <p class="heading">24 Hour price</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <p class="has-text-weight-bold">{{ selectedProduct.volume24h }} {{ tickerSymbol }}</p>
                <p class="heading">24 hour volume</p>
            </div>
        </div>
    </nav>
    <nav class="level info is-marginless is-paddingless">
        <span class="is-uppercase has-text-weight-semibold">Order Book</span>
    </nav>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  computed: {
      selectedProduct() {
          return this.$store.state.selectedProduct
      },
      tickerSymbol() {
          var arr = _.split(this.$store.state.selectedProduct.name, '/')
          return arr[0]
      },
      tickerDenom() {
          var arr = _.split(this.$store.state.selectedProduct.name, '/')
          return arr[1]
      },
      deltaSign() {
          if (this.$store.state.selectedProduct.priceDelta24h >= 0) {
              return '+'
          } else {
              return ''
          }
      },
      deltaClass() {
          return this.$store.state.ticker.deltaClass
      }
  }
}
</script>

<style>

</style>
