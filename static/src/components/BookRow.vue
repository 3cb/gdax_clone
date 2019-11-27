<template>
    <li class="br-li">
        <span class="br-size">{{ level[1] | bookSize }}</span>
        <span class="br-price" :class="color">{{ level[0] | decimals }}</span>
    </li>
</template>

<script>
import { addCommas } from "../lib/numbers.js";

export default {
  props: ["level", "max", "color", "side"],
  filters: {
    decimals(price) {
      if (price < 1) {
        return addCommas(parseFloat(price).toFixed(5));
      } else {
        return addCommas(parseFloat(price).toFixed(2));
      }
    },
    bookSize(size) {
      return parseFloat(size).toFixed(8);
    }
  }
};
</script>

<style>
.br-li {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-top: -5px;
  margin-bottom: -7px;
}
.br-svg {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  flex: 0 1 20%;
}
.br-size {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  flex: 1 1 20%;
}
.br-price {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  flex: 0 1 37%;
}
</style>
