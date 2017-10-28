<template>
    <ul>
        <li class="spacer">
            <span class="sales-span has-text-right">Trade Size</span>
            <span class="sales-span has-text-right">Price({{ denom }})</span>
            <span class="sales-span has-text-right">Time</span>
        </li>
        <li v-for="(trade, index) in trades" :key="trade.trade_id">
            <a>
                <span class="sales-span has-text-right">{{ trade.size }}</span>
                <span :class="trade.class">{{ trade.price | decimals }}
                    <span class="icon" v-if="trade.change === '+'"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
                    <span class="icon" v-if="trade.change === '-'"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
                </span>
                <span class="sales-span has-text-right">{{ trade.time | formatDate }}</span>
            </a>
        </li>
    </ul>
</template>

<script>
import { addCommas } from "../lib/numbers.js";

export default {
  props: ["trades", "denom"],
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
