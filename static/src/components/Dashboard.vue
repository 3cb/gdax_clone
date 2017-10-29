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
import { getBTCUSD, getBTCEUR, getBTCGBP, getETHUSD, getETHBTC, getETHEUR, getLTCUSD, getLTCBTC, getLTCEUR } from '../lib/trades.js'

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
      tickerListener: {
        next(value) {
          console.log(value)
          store.commit("updateTicker", value);
        },
        error(err) {
          console.log("Error from websocket - watchlistListener: ", err);
        },
        complete() {
          console.log("Watchlist stream complete.");
        }
      },
      tradeListener: {
        next(value) {
          store.commit('addTrade', {
            trade: {
              price: value.price,
              side: value.side,
              size: value.size,
              time: value.time,
              trade_id: value.trade_id
            },
            product: value.product_id
          })
          store.commit('updatePriceTicker', { price: value.price, product_id: value.product_id, trade_id: value.trade_id })
        },
        error(err) {
          console.log("Error from websocket - tradeListener: ", err)
        },
        complete() {
          console.log("Trade stream complete.")
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
          // console.log(value)
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
                    name: "matches",
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
    ticker$() {
      return xs.from(this.main$).filter(v => v.type === "ticker")
    },
    trade$() {
      return xs.from(this.main$).filter(v => v.type === "match")
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
      return xs.from(this.trade$)
        .filter(v => v.product_id === product)
    }
  },
  beforeMount() {
    this.getTrades()
    // For debugging =========== Remove ======================
    // this.main$.addListener(this.mainListener);
    // =======================================================

    this.ticker$.addListener(this.tickerListener);
    this.trade$.addListener(this.tradeListener);
    this.bookInit$.addListener(this.bookInitListener);
    this.bookUpdate$.addListener(this.bookUpdateListener);
    this.chart$.addListener(this.chartUpdateListener);
  },
  methods: {
    getTrades() {
      axios.all([getBTCUSD(), getBTCEUR(), getBTCGBP(), getETHUSD(), getETHBTC(), getETHEUR(), getLTCUSD(), getLTCBTC(), getLTCEUR()])
      .then(axios.spread((btc_usd, btc_eur, btc_gbp, eth_usd, eth_btc, eth_eur, ltc_usd, ltc_btc, ltc_eur) => {
        this.$store.commit('initTrades', { data: btc_usd.data, product: "BTC-USD" })
        this.$store.commit('initTrades', { data: btc_eur.data, product: "BTC-EUR" })
        this.$store.commit('initTrades', { data: btc_gbp.data, product: "BTC-GBP" })
        this.$store.commit('initTrades', { data: eth_usd.data, product: "ETH-USD" })
        this.$store.commit('initTrades', { data: eth_btc.data, product: "ETH-BTC" })
        this.$store.commit('initTrades', { data: eth_eur.data, product: "ETH-EUR" })
        this.$store.commit('initTrades', { data: ltc_usd.data, product: "LTC-USD" })
        this.$store.commit('initTrades', { data: ltc_btc.data, product: "LTC-BTC" })
        this.$store.commit('initTrades', { data: ltc_eur.data, product: "LTC-EUR" })
      }))
      .catch(error => {
        console.log(error)
      })
    }
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
