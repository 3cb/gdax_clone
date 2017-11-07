<template>
    <div id="chart-cont">
        <ul>
          <li class="spacer has-text-centered has-text-weight-semibold has-text-primary">
            <span class="" v-show="chartInterval === '1m'">1 Minute</span>
            <span class="" v-show="chartInterval === '1d'">Daily</span>
          </li>
        </ul>
        <div class="chart-btn-anchor">
          <div id="chart"></div>
          <div class="field is-grouped chart-btn">
            <p class="control">
              <button
                class="button is-small is-primary"
                @click="setInterval('1d')"
                :disabled="dailyDisabled"
              >Daily
              </button>
              <button
                class="button is-small is-primary"
                @click="setInterval('1m')"
                :disabled="!dailyDisabled"
              >1 Minute
              </button>
            </p>
            <p class="control">
                <button
                  class="button is-small is-primary"
                  @click="setType('candle')"
                  :disabled="candleDisabled"
                >Candle
                </button>
                <button
                  class="button is-small is-primary"
                  @click="setType('line')"
                  :disabled="!candleDisabled"
                >Line
                </button>
            </p>
          </div>
        </div>
        <spinner
          class="spinner is-overlay"
          v-if="chartLoading"
          size="huge"
          line-fg-color="hsl(171, 100%, 41%)"
        >
        </spinner>
    </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import { getParams } from '../lib/chart.js'
import axios from 'axios'

export default {
  computed: {
    dailyDisabled() {
      return this.$store.state.dailyDisabled
    },
    candleDisabled() {
      return this.$store.state.candleDisabled
    },
    chartLoading() {
      return this.$store.state.chartLoading
    },
    product() {
      return this.$store.state.products[this.$store.state.selected_id-1].name;
    },
    winSize() {
      return this.$store.state.win
    },
    chartType() {
      return this.$store.state.chartType;
    },
    chartInterval() {
      return this.$store.state.chartInterval;
    },
    time() {
      return this.$store.state.time;
    },
    low() {
      return this.$store.state.low;
    },
    high() {
      return this.$store.state.high;
    },
    open() {
      return this.$store.state.open;
    },
    close() {
      return this.$store.state.close;
    },
    volume() {
      return this.$store.state.volume;
    },
    trace() {
      return this.chartType === 'line' ? this.trace1 : this.trace0
    },
    trace0() {
      return {
        type: "candlestick",
        xaxis: "x",
        yaxis: "y",
        decreasing: { line: { color: "hsl(348, 100%, 61%)" } },
        increasing: { line: { color: "hsl(141, 71%, 48%)" } },
        x: this.time,
        low: this.low,
        high: this.high,
        open: this.open,
        close: this.close
      };
    },
    trace1() {
      return {
        type: 'scatter',
        mode: 'lines',
        x: this.time,
        y: this.close,
        line: { color: "hsl(171, 100%, 41%)" }

      }
    },
    layout() {
      return {
        margin: {
          r: 10,
          t: 20,
          b: 40,
          l: 35
        },
        showlegend: false,
        xaxis: {
          autorange: true,
          type: "date"
        },
        yaxis: {
          autorange: true,
          type: "linear"
        }
      };
    }
  },
  watch: {
    winSize: {
      handler() {
        Plotly.purge("chart");
        Plotly.plot("chart", [this.trace], this.layout);
      }
    },
    close: {
      handler() {
        // Plotly.update("chart", [this.trace], this.layout);
        Plotly.purge("chart");
        Plotly.plot("chart", [this.trace], this.layout);
      }
    },
    product: {
      handler() {
        this.rerenderChart()
      }
    },
    chartInterval: {
      handler() {
        this.rerenderChart()
      }
    },
    chartType: {
      handler() {
        Plotly.purge("chart");
        Plotly.plot("chart", [this.trace], this.layout);
      }
    }
  },
  mounted() {
        this.initializeChart()
  },
  methods: {
    setType(type) {
      this.$store.commit('toggleChartBtn', 'candle')
      this.$store.commit('setChartType', type)
    },
    setInterval(interval) {
      this.$store.commit('toggleChartBtn', 'daily')
      this.$store.commit('setChartInterval', interval)
    },
    initializeChart() {
      this.$store.commit('toggleChartLoad')
      axios.get('https://api.gdax.com/products/' + this.$store.state.selected_product + '/candles', {
        params: getParams(this.$store.state.chartInterval)
      })
      .then(response => {
          this.$store.commit('setChartData', response.data)
          Plotly.plot("chart", [this.trace], this.layout);
          this.$store.commit('toggleChartLoad')
      })
      .catch(error => {
        console.error(error)
      })
    },
    rerenderChart() {
      this.$store.commit('toggleChartLoad')
      axios.get('https://api.gdax.com/products/' + this.$store.state.selected_product + '/candles', {
          params: getParams(this.$store.state.chartInterval)
        })
        .then(response => {
          this.$store.commit('setChartData', response.data)
          this.$store.commit('toggleChartLoad')
          Plotly.update("chart", [this.trace], this.layout)
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  components: {
    Spinner
  }
};
</script>

<style>
#chart-cont {
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
}

#chart {
  width: 100%;
  height: 95%;
}

.chart-btn-anchor {
  position: relative;
  height: 100%;
}

.chart-btn {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.spinner {
  position: absolute;
  top: 35%;
}
</style>
