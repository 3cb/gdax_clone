<template>
    <div id="chart-cont">
        <ul>
            <li class="spacer has-text-centered">30 Day Daily Chart</li>
        </ul>
        <div id="chart"></div>
    </div>
</template>

<script>
import { getParams } from '../lib/chart.js'
import axios from 'axios'

export default {
  data() {
    return {};
  },
  computed: {
    chartData() {
      return this.$store.state.chartData;
    },
    product() {
      return this.$store.state.selected_product;
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
    trace1() {
      return {
        type: "candlestick",
        xaxis: "x",
        yaxis: "y",
        decreasing: { line: { color: "hsl(348, 100%, 61%)" } },
        increasing: { line: { color: "hsl(141, 71%, 48%)" } },
        line: { color: "hsl(0, 0%, 48%)" },
        x: this.time,
        low: this.low,
        high: this.high,
        open: this.open,
        close: this.close
      };
    },
    layout() {
      return {
        margin: {
          r: 10,
          t: 30,
          b: 40,
          l: 35
        },
        showlegend: false,
        xaxis: {
          autorange: true,
          domain: [0, 1],
          rangeslider: {range: [this.time[30], this.time[0]]},
          type: "date"
        },
        yaxis: {
          autorange: true,
          domain: [0,1],
          type: "linear"
        }
      };
    }
  },
  watch: {
    close: {
      handler() {
        Plotly.update("chart", [this.trace1], this.layout);
      }
    },
    product: {
      handler() {
        this.changeChartProduct()
      }
    }
  },
  mounted() {
        this.initializeChart()
  },
  methods: {
    initializeChart() {
      axios.get('https://api.gdax.com/products/' + this.$store.state.selected_product + '/candles', {
        params: getParams(this.$store.state.chartInterval)
      })
      .then(response => {
          this.$store.commit('setChartData', response.data)
          Plotly.plot("chart", [this.trace1], this.layout);
      })
      .catch(error => {
          console.log(error)
      })
    },
    changeChartProduct() {
      axios.get('https://api.gdax.com/products/' + this.$store.state.selected_product + '/candles', {
          params: getParams(this.$store.state.chartInterval)
        })
        .then(response => {
          this.$store.commit('setChartData', response.data)
          Plotly.update("chart", [this.trace1], this.layout)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  
};
</script>

<style>
#chart-cont {
  width: 100%;
  height: 100%;
}

#chart {
  width: 100%;
  height: 50%;
}

.chart-span-one {
  display: inline-block;
  /* width: 32%; */
}
</style>
