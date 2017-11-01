<template>
<div id="order-book-cont">
    <ul>
        <li class="spacer">
            <span class="book-span-one"></span>
            <span class="book-span-one">Market Size</span>
            <span class="book-span-one">Price({{ denom }})</span>
        </li>
    </ul>
    <ul id="order-book">
        <li is="book-row" v-for="level in asks" :level="level" :key="level[0]"></li>
        <li class="spacer">
            <span>{{ denom }} SPREAD</span>
            <span class="book-span-one is-pulled-right">{{ spread }}</span>
        </li>
        <li is="book-row" v-for="level in bids" :level="level" :key="level[0]"></li>
    </ul>
</div>
</template>

<script>
import BookRow from "./BookRow.vue";

export default {
  computed: {
    denom() {
      return this.$store.state.selected_denom;
    },
    depth() {
      return 33;
    },
    asks() {
      return _.chain(this.$store.state.book.asks)
        .take(this.depth)
        .reverse()
        .value();
    },
    bids() {
      return _.take(this.$store.state.book.bids, this.depth);
    },
    spread() {
      return (_.last(this.asks)[0] - this.bids[0][0]).toFixed(2);
    }
  },
  components: {
    BookRow
  }
};
</script>

<style>
#order-book-cont {
    width: 100%;
    height: calc(100vh - 100px);
    overflow: hidden;
}

#order-book::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

.book-span-one {
  display: inline-block;
  text-align: right;
  width: 32%;
  position: relative;
  top: -50%;
  /* transform: translatey(50%); */
}

#order-book {
  width: 100%;
  height: 100%;
  /* margin-right: -30px; */
  /* padding-right: -20px; */
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;
}

.spacer {
    border-style: groove;
    border-width: 1px 0px 1px 0px;
}
</style>
