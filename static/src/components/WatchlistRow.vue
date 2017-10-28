<template>
    <ul>
        <li v-for="product in products" :key="product.id">
            <a @click="changeProduct(product.id)">
                <span class="watchlist-span-one has-text-left">{{ product.name }}</span>
                <span class="watchlist-span-one has-text-right">
                    <span class="icon" v-if="product.product_id.split('-')[1] === 'USD'"><i class="fa fa-usd" aria-hidden="true"></i></span>
                    <span class="icon" v-if="product.product_id.split('-')[1] === 'EUR'"><i class="fa fa-eur" aria-hidden="true"></i></span>
                    <span class="icon" v-if="product.product_id.split('-')[1] === 'GBP'"><i class="fa fa-gbp" aria-hidden="true"></i></span>
                    <span class="icon" v-if="product.product_id.split('-')[1] === 'BTC'"><i class="fa fa-btc" aria-hidden="true"></i></span>
                {{ product.price | decimals }}</span>
                <span :class="product.deltaClass" class="watchlist-span-one has-text-right">{{ Math.abs(product.priceDelta24h).toFixed(2) }}%</span>
                <span :class="product.deltaClass" class="icon" v-if="product.priceDelta24h > 0">
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </span>
                <span :class="product.deltaClass" class="icon" v-if="product.priceDelta24h < 0">
                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                </span>
            </a>
        </li>
    </ul>
</template>

<script>
import { addCommas } from "../lib/numbers.js";

export default {
  props: ["products"],
  filters: {
    decimals(price) {
      if (price < 1) {
        return addCommas(parseFloat(price).toFixed(5));
      } else {
        return addCommas(parseFloat(price).toFixed(2));
      }
    }
  },
  methods: {
    changeProduct(id) {
      this.$store.state.ws.send(
        JSON.stringify({
          type: "unsubscribe",
          product_ids: [this.$store.selected_product],
          channels: ["level2"]
        })
      );
      this.$store.commit("updateProduct", id);
      this.$store.state.ws.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: [this.$store.state.selected_product],
          channels: ["level2"]
        })
      );
    }
  }
};
</script>

<style>
.watchlist-span-one {
  display: inline-block;
  width: 27%;
}

span.icon {
  display: inline-block;
  width: 7%;
}

a {
  color: #4a4a4a;
}

a:hover {
  color: hsl(171, 100%, 41%);
}

li:hover {
  /* color: hsl(171, 100%, 41%); */
  background-color: hsl(0, 0%, 21%);
}
</style>
