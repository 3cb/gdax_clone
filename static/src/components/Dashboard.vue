<template>
    <div class="columns">
        <div class="column is-2">
            <first-column></first-column>
        </div>
        <div class="column is-3">
            <second-column></second-column>
        </div>
        <div class="column">
            <third-column></third-column>
        </div>
        <div class="column is-3">
            <fourth-column></fourth-column>
        </div>
    </div>
</template>

<script>
import FirstColumn from "./FirstColumn.vue";
import SecondColumn from "./SecondColumn.vue";
import ThirdColumn from "./ThirdColumn.vue";
import FourthColumn from "./FourthColumn.vue";
import xs from "xstream";
import _ from "lodash";

export default {
  data() {
    var store = this.$store;
    return {
      ws: null,
      // === For debugging -- Remove ================
      mainListener: {
        next(value) {
          // console.log(value)
        }
      },
      // ============================================
      initListener: {
        next(value) {
          store.commit("initProducts", value);
        },
        error(err) {
          console.log("Error from websocket - watchlistListener: ", err);
        },
        complete() {
          console.log("Watchlist stream complete.");
        }
      },
      salesListener: {
        next(value) {
          store.commit("addSale", value);
        },
        error(err) {
          console.log("Error from websocket - historyListener: ", err);
        },
        complete() {
          console.log("History channel complete.");
        }
      },
      bookInitListener: {
        next(value) {
          console.log(value);
        },
        error(err) {
          console.log("error from websocket - bookInitListener: ", err);
        },
        complete() {
          console.log("Book initialization stream complete.");
        }
      }
    };
  },
  computed: {
    wsConnected() {
      return this.$store.state.wsConnected;
    },
    producer() {
      var store = this.$store;
      return {
        start(listener) {
          store.state.ws = new WebSocket("wss://ws-feed.gdax.com");
          var sock = store.state.ws;
          store.state.ws.onopen = event => {
            store.commit("toggleWS");
            sock.send(
              JSON.stringify({
                type: "subscribe",
                product_ids: [
                  "BTC-USD",
                  "BTC-EUR",
                  "BTC-GBP",
                  "ETH-USD",
                  "ETH-BTC",
                  "ETH-EUR",
                  "LTC-USD",
                  "LTC-BTC",
                  "LTC-EUR"
                ],
                channels: ["level2", "ticker"]
              })
            );
          };
          store.state.ws.onmessage = event => {
            listener.next(JSON.parse(event.data));
          };
        },
        stop() {
          store.state.ws.close();
          store.state.ws.onclose = event => {
            console.log(event);
          };
        }
      };
    },
    main$() {
      return xs.createWithMemory(this.producer);
    },
    init$() {
      return xs.from(this.main$).filter(v => v.type === "ticker" && !v.time);
    },
    sales$() {
      return xs.from(this.main$).filter(v => v.type === "ticker" && v.time);
    },
    bookInit$() {
      return xs
        .from(this.main$)
        .filter(
          v =>
            v.type === "snapshot" &&
            v.product_id === this.$store.state.selected_product
        );
    }
  },
  beforeMount() {
    this.main$.addListener(this.mainListener);
    this.init$.addListener(this.initListener);
    this.sales$.addListener(this.salesListener);
    this.bookInit$.addListener(this.bookInitListener);
  },
  components: {
    FirstColumn,
    SecondColumn,
    ThirdColumn,
    FourthColumn
  }
};
</script>

<style>

</style>
