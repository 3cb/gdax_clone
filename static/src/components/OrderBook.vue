<template>
<div id="order-book-cont">
    <ul id="ob-header">
        <li id="br-header" class="spacer has-text-primary has-text-weight-semibold">
            <span class="br-svg"></span>
            <span class="br-size">Market Size</span>
            <span class="br-price">Price({{ denom }})</span>
        </li>
    </ul>
    <div id="order-book" v-if="asks.length >= 2 && bids.length >= 2">
        <div id="ob-asks-wrapper">
          <transition-group
            tag="ul"
            id="ob-asks"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
          >
            <li
              is="book-row"
              v-for="level in asks"
              side="ask"
              :level="level"
              :max="maxSize"
              :color="'has-text-danger'"
              :key="level[0]">
            </li>
          </transition-group>
        </div>
        <ul>
          <li id="ob-spacer" class="spacer has-text-primary has-text-weight-semibold">
              <span>{{ denom }} SPREAD</span>
              <span class="book-span-one is-pulled-right">{{ spread }}</span>
          </li>
        </ul>
        <transition-group
            tag="ul"
            id="ob-bids"
            :css="false"
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
        >
          <li
            is="book-row"
            v-for="level in bids"
            side="bid"
            :level="level"
            :max="maxSize"
            :color="'has-text-success'"
            :key="level[0]">
          </li>
        </transition-group>
    </div>
    <spinner
      class="spinner is-overlay"
      v-if="asks.length < 2 && bids.length < 2"
      size="huge"
      line-fg-color="hsl(171, 100%, 41%)">
    </spinner>
</div>
</template>

<script>
import BookRow from "./BookRow.vue";
import Spinner from 'vue-simple-spinner'

export default {
  computed: {
    denom() {
      return this.$store.state.selected_denom;
    },
    depth() {
      return this.$store.state.bookDepth;
    },
    asks() {
      return _.takeRight(this.$store.state.book.asks, this.depth);
    },
    bids() {
      return _.take(this.$store.state.book.bids, this.depth);
    },
    spread() {
      return (_.last(this.asks)[0] - this.bids[0][0]).toFixed(2);
    },
    maxSizeAsks() {
      return _.chain(this.asks)
                .orderBy([a => parseFloat(a[1])], ['desc'])
                .take(1)
                .map(v => v[1])
                .value()
    },
    maxSizeBids() {
      return _.chain(this.asks)
                .orderBy([a => parseFloat(a[1])], ['desc'])
                .take(1)
                .map(v => v[1])
                .value()
    },
    maxSize() {
      return this.maxSizeAsks > this.maxSizeBids ? this.maxSizeAsks : this.maxSizeBids
    }
  },
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0
      el.style.backgroundColor = '#a6a6a6'
    },
    enter: function(el, done) {
      Velocity(el,
        {
          opacity: 1,
          backgroundColor: '#ffffff'
        },
        {
          duration: 700,
          complete: function() {
            done()
          }
        })
    },
    leave: function(el, done) {
      Velocity(el,
        {
          color: '#b5b5b5'
        },
        {
          duration: 500,
          complete: function() {
            done()
          }
        })
    }
  },
  components: {
    BookRow,
    Spinner
  }
};
</script>

<style>
#order-book-cont {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}

#order-book {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -ms-overflow-style: none;
}
#order-book::-webkit-scrollbar {
  width: 0px;
  background: transparent; /*make scrollbar transparent*/
}
#br-header {
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.book-span-one {
  display: inline-block;
  position: relative;
  text-align: right;
  width: 32%;
  top: -50%;
}

#ob-asks-wrapper {
  position: relative;
  height: calc(50vh - 89px);
}
#ob-asks {
  position: absolute;
  bottom: 0;
  right: 0;
  overflow: hidden;
  padding-bottom: 10px;
}
#ob-bids {
  overflow: hidden;
  position: relative;
  top: 7px;
}

.spacer {
  border-style: solid;
  border-color: #4a4a4a;
  border-width: 1px 0px 1px 0px;
}
</style>
