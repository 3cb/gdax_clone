<template>
    <div class="columns">
        <div class="column is-2">
            <first-column></first-column>
        </div>
        <div class="column is-2">
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
import axios from "axios";
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
          console.log(value);

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
          // console.log(value);
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
          // console.log(value);
          store.commit("initBook", value);
        },
        error(err) {
          console.log("Error from websocket - bookInitListener: ", err);
        },
        complete() {
          console.log("Book initialization stream complete.");
        }
      },
      bookUpdateListener: {
        next(value) {
          // console.log(value);
          // store.commit("updateBook", value);
        },
        error(err) {
          console.log("Error from websocket - bookUpdateListener: ", err);
        },
        complete() {
          console.log("Book update stream complete.");
        }
      },
      chartUpdateListener: {
        next(value) {
          store.commit('updateChartData', value)
        },
        error(err) {
          console.log("Error from websocket - chartUpdateListener: ", err)
        },
        complete() {
          console.log("Chart update stream complete")
        }
      }
    };
  },
  computed: {
    selected_product() {
      return this.$store.state.selected_product
    },
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
                channels: [
                  {
                    name: "ticker",
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
                    ]
                  },
                  {
                    name: "level2",
                    product_ids: ["BTC-USD"]
                  }
                ]
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
      return xs.from(this.main$).filter(v => v.type === "snapshot");
    },
    bookUpdate$() {
      return xs
        .from(this.main$)
        .filter(v => v.type === "l2update")
        .map(v => v.changes[0]);
    },
    chart$() {
      var product = this.selected_product
      return xs.from(this.main$)
        .filter(v => v.type === "ticker" && v.time && v.product_id === product)
    }
  },
  beforeMount() {
    this.main$.addListener(this.mainListener);
    this.init$.addListener(this.initListener);
    this.sales$.addListener(this.salesListener);
    this.bookInit$.addListener(this.bookInitListener);
    this.bookUpdate$.addListener(this.bookUpdateListener);
    this.chart$.addListener(this.chartUpdateListener)
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
