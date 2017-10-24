<template>
    <ul>
        <li>
            <span class="sales-span has-text-centered">Trade Size</span>
            <span class="sales-span has-text-centered">Price({{ denom }})</span>
            <span class="sales-span has-text-centered">Time</span>
        </li>
        <li v-for="(sale, index) in data" :key="sale.sequence">
            <a>
                <span class="sales-span has-text-centered">{{ sale.last_size }}</span>
                <span :class="sale.class">{{ sale.price | decimals }}
                    <span class="icon" v-if="sale.change === '+'"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
                    <span class="icon" v-if="sale.change === '-'"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
                    <span class="icon" v-if="sale.change === '='"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
                </span>
                <span class="sales-span has-text-centered">{{ sale.time | formatDate }}</span>
            </a>
        </li>
    </ul>
</template>

<script>
import { addCommas } from "../lib/numbers.js";

export default {
  props: ["data", "denom"],
  filters: {
    decimals(price) {
      if (price < 1) {
        return addCommas(parseFloat(price).toFixed(5));
      } else {
        return addCommas(parseFloat(price).toFixed(2));
      }
    },
    formatDate(value) {
      var date = new Date(value);
      return date.toLocaleTimeString();
    }
  }
};
</script>

<style>
#sales-con {
  height: calc(100% - 105px);
  width: 100%;
}

ul,
li {
  width: 100%;
}

.sales-span {
  display: inline-block;
  width: 30%;
}
</style>
