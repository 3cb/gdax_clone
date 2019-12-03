<template>
    <div>
      <div class="columns">
          <div class="column" :class="wlClass">
              <first-column></first-column>
          </div>
          <div class="column" :class="obClass">
              <second-column></second-column>
          </div>
          <div v-if="winSize.width > 1600" class="column">
              <third-column></third-column>
          </div>
          <div class="column" :class="tsClass">
              <fourth-column></fourth-column>
          </div>
      </div>
      <div class="columns" :class="lcClass">
          <div v-if="winSize.width <= 1600 && winSize.width > 800" class="column is-12">
              <third-column></third-column>
          </div>
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
    return {
      ws: null,
      tickerListener: {
        next: (value) => {
          this.$store.commit("updateTicker", value);
        },
        error: (err) => {
          console.error("Error from websocket - watchlistListener: ", err);
        },
        complete: () => {
          console.log("Watchlist stream complete.");
        }
      },
      tradeListener: {
        next: (value) => {
          this.$store.commit('addTrade', {
            trade: {
              price: value.price,
              side: value.side,
              size: value.size,
              time: value.time,
              trade_id: value.trade_id
            },
            product: value.product_id
          })
          this.$store.commit('updatePriceTicker', {
              price: value.price,
              product_id: value.product_id,
              trade_id: value.trade_id
            })
        },
        error: (err) => {
          console.error("Error from websocket - tradeListener: ", err)
        },
        complete: () => {
          console.log("Trade stream complete.")
        }
      },
      bookInitListener: {
        next: (value) => {
          this.$store.commit("initBook", value);
        },
        error: (err) => {
          console.error("Error from websocket - bookInitListener: ", err);
        },
        complete: () => {
          console.log("Book initialization stream complete.");
        }
      },
      bookUpdateListener: {
        next: (value) => {
          this.$store.commit("updateBook", {
            side: value[0] === 'buy' ? 'bids' : 'asks',
            price: value[1],
            vol: value[2]
          });
        },
        error: (err) => {
          console.error("Error from websocket - bookUpdateListener: ", err);
        },
        complete: () => {
          console.log("Book update stream complete.");
        }
      },
      chartUpdateListener: {
        next: (value) => {
          this.$store.commit('updateChartData', value)
        },
        error: (err) => {
          console.error("Error from websocket - chartUpdateListener: ", err)
        },
        complete: () => {
          console.log("Chart update stream complete")
        }
      }
    };
  },
  computed: {
    winSize() {
      return this.$store.state.win
    },

    // ===========================================================================
    // Dynamically set column classes based on data from window size stream
    // ===========================================================================
    // *wlClass -> left column
    // *obClass -> column second from left
    // *tsClass -> far right column
    // *lcClass -> lower chart column for winSIze <= 1700
    // ===========================================================================
    wlClass() {
      return this.winSize.width > 1600 ? 'is-2' : 'is-4'
    },
    obClass() {
      return this.winSize.width > 1600 ? 'is-2' : 'is-4'
    },
    tsClass() {
      return this.winSize.width > 1600 ? 'is-3' : 'is-4'
    },
    lcClass() {
      return this.winSize > 1600 ? '' : 'lower-chart'
    },

    selected_product() {
      return this.$store.state.selected_product
    },

    wsConnected() {
      return this.$store.state.wsConnected;
    },
    producer() {
      return {
        start: (listener) => {
          this.$store.commit('startWS')
          this.$store.state.ws.onopen = event => {
            this.$store.commit("toggleWS");
            this.$store.state.ws.send(
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
                      "BTC-USD"
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
          this.$store.state.ws.onmessage = event => {
            listener.next(JSON.parse(event.data));
          };
        },
        stop: () => {
          this.$store.state.ws.close();
          this.$store.state.ws.onclose = event => {
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
      return xs.from(this.trade$)
        .filter(v => v.product_id === this.selected_product)
    }
  },
  beforeMount() {
    this.getTrades()

    this.ticker$.addListener(this.tickerListener);
    this.trade$.addListener(this.tradeListener);
    this.bookInit$.addListener(this.bookInitListener);
    this.bookUpdate$.addListener(this.bookUpdateListener);
    this.chart$.addListener(this.chartUpdateListener);
  },
  methods: {
    getTrades() {
      axios.get('https://api.gdax.com/products/BTC-USD/trades')
      .then(response => {
        this.$store.commit('initTrades', { data: response.data, product: "BTC-USD" })
      })
      .catch(err => {
        console.error(err)
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
.lower-chart {
  padding-left: .75rem;
  padding-right: .75rem;
}
</style>
