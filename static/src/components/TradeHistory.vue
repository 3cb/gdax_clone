<template>
    <div>
        <nav class="level info is-marginless is-paddingless">
                <div class="level-item">
                    <span>Notifications</span>
                </div>
                <div class="level-item">
                    <span>Marc Courtney-Brooks</span>
                </div>
                <div class="level-item">
                    <span><a><i class="fa fa-bars" aria-hidden="true"></i></a></span>
                </div>
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Trade History</span>
        </nav>
        <table class="is-marginless is-paddingless is-clipped">
            <colgroup>
                <col span="1" style="width: 10%;">
                <col span="1" style="width: 30%;">
                <col span="1" style="width: 30%;">
                <col span="1" style="width: 30%;">
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">{{ spacer }}</th>
                    <th scope="col">Trade Price</th>
                    <th scope="col">Price({{ tickerDenom }})</th>
                    <th scope="col">Time</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(sale, index) in sales" :key="sale.sequence">
                    <td>{{ spacer }}</td>
                    <td>{{ parseFloat(sale.size).toFixed(8) }}</td>
                    <td>{{ parseFloat(sale.price).toFixed(2) }}<span class="icon"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
                        <span class="icon"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
                        <span class="icon"><i class="fa fa-arrows-h" aria-hidden="true"></i></span>
                    </td>
                    <td>{{ sale.time | formatDate }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
      return {
          spacer: ''
      }
  },
  filters: {
      formatDate(value) {
          return new Date(value).toLocaleTimeString()
      },
      formatArrow() {
          
      }
  },
  computed: {
      tickerDenom() {
          var arr = _.split(this.$store.state.selectedProduct.name, '/')
          return arr[1]
      },
      sales() {
          return this.$store.state.history.sales
      }
  }
}
</script>

<style>
table {
    table-layout: fixed;
    width: 100%;
}

td, th {
    padding: 5px;
}

tbody td {
    text-align: center;
}

thead th {
    text-align: center;
}
</style>
