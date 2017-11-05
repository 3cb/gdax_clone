<template>
    <div id="container">
      <ul>
          <li class="spacer ts-li has-text-primary has-text-weight-semibold">
              <span class="ts-size">Trade Size</span>
              <span class="ts-price-wrap">Price({{ denom }})</span>
              <span class="ts-date has-text-right">Time</span>
          </li>
      </ul>
      <ul id="time-sales" v-if="trades.length > 0">
        <transition-group name="ts">
          <li v-for="(trade, index) in trades" :key="trade.trade_id" class="ts-li">
              <span class="ts-size"><span>{{ trade.size }}</span></span>

              <div class="ts-price-wrap">
                <span :class="trade.class" class="ts-price">{{ trade.price | decimals }}</span>
                <span class="icon" :class="trade.class" v-if="trade.change === '+'"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
                <span class="icon" :class="trade.class" v-if="trade.change === '-'"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
              </div>

              <span class="ts-date has-text-right">{{ trade.time | formatDate }}</span>
          </li>
        </transition-group>
      </ul>
      <spinner class="spinner is-overlay" v-if="trades.length === 0" size="huge" line-fg-color="hsl(171, 100%, 41%)"></spinner>
    </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import { addCommas } from "../lib/numbers.js";
import moment from 'moment'
import _ from 'lodash'

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
      let x = moment(date).format().split('T')[1].split('-');
      return _.chain(x)
              .dropRight(1)
              .join(':')
              .value()
    }
  },
  components: {
    Spinner
  }
};
</script>

<style>
ul,
li {
  width: 100%;
}

#container {
  height: calc(100vh - 100px);
  width: 100%;
  overflow: hidden;
}

#time-sales
{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

#time-sales::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

.ts-li {
  padding-right: 25px;
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.ts-size {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  flex: 1 1 15%;
}

.ts-price-wrap {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  flex: 0 1 31%;
}

.ts-price {
  flex-grow: 2;
  flex-shrink: 0;
  flex-basis: 89%;
}

.ts-date {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 31%;
}

/* new trade animation */
.ts-enter-active {
  /* background: hsl(141, 71%, 90%); */
  transition: all .3s;
}
.ts-enter {
  opacity: 0;
  /* background: white; */

}
</style>
