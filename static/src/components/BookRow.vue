<template>
    <li>
        <span class="book-span-one"></span>
        <span class="book-span-one">{{ level[1] | bookSize }}</span>
        <span class="book-span-one">{{ level[0] | decimals }}</span>
    </li>
</template>

<script>
import { addCommas } from '../lib/numbers.js'


export default {
  props: ["level"],
  filters: {
      decimals(price) {
      if (price < 1) {
        return addCommas(parseFloat(price).toFixed(5));
      } else {
        return addCommas(parseFloat(price).toFixed(2));
      }
    },
    bookSize(size) {
       return parseFloat(size).toFixed(8)
    }
  }
};
</script>

<style>

</style>
