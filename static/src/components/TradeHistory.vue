<template>
    <div>
        <nav class="level info is-marginless is-paddingless">
                <div class="level-item">
                    <span>Notifications</span>
                </div>
                <div class="level-item">
                    <span>Marc Courtney-Brooks</span>
                </div>
                <div class="level-item">
                    <span><a><i class="fa fa-bars" aria-hidden="true"></i></a></span>
                </div>
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Trade History</span>
        </nav>
        <nav class="level">
            <span class="level-item">Trade Size</span>
            <span class="level-item">Price({{ tickerDenom }})</span>
            <span class="level-item">Time</span>
        </nav>
        <nav v-for="(sale, index) in sales" :key="sale.sequence" class="level">
            <span class="level-item">{{ parseFloat(sale.size).toFixed(8) }}</span>
            <span class="level-item"> {{ parseFloat(sale.price).toFixed(2) }}<span class="icon"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
            <span class="icon"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
            <span class="icon"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
            </span>
            <span class="level-item"> {{ sale.time | formatDate }}</span>
        </nav>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
  filters: {
      formatDate(value) {
          return new Date(value).toLocaleTimeString()
      },
      formatArrow() {
          
      }
  },
  computed: {
      tickerDenom() {
          var arr = _.split(this.$store.state.selectedProduct.name, '/')
          return arr[1]
      },
      sales() {
          return this.$store.state.history.sales
      }
  }
}
</script>

<style>

</style>
