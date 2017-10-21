<template>
    <ul>
        <li>
            <span class="sales-span has-text-centered">Trade Size</span>
            <span class="sales-span has-text-centered">Price({{ denom }})</span>
            <span class="sales-span has-text-centered">Time</span>
        </li>
        <li v-for="(sale, index) in data" :key="sale.sequence">
            <span class="sales-span has-text-centered">{{ sale.size }}</span>
            <span :class="sale.class">{{ parseFloat(sale.price).toFixed(2) }}
                <span class="icon" v-if="sale.change === '+'"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
                <span class="icon" v-if="sale.change === '-'"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
                <span class="icon" v-if="sale.change === '='"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
            </span>
            <span class="sales-span has-text-centered">{{ sale.time | formatDate }}</span>
        </li>
    </ul>
</template>

<script>
export default {
  props: ["data"],
  filters: {
      formatDate(value) {
          var date = new Date(value)
          return date.toLocaleTimeString()
      }
  },
  computed: {
      denom() {
          var arr = _.split(this.$store.state.selectedProduct.name, '/')
          return arr[1]
      }
  }
}
</script>

<style>
#sales-con {
  height: calc(100% - 105px);
  width: 100%;
}

ul, li {
    width: 100%;
}

.sales-span {
    display: inline-block;
    width: 30%;
}
</style>
