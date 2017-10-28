import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import { addCommas } from '../lib/numbers.js'
import { getProducts } from './products.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: getProducts(['BTC/USD', 'BTC/EUR', 'BTC/GBP', 'ETH/USD', 'ETH/BTC', 'ETH/EUR', 'LTC/USD', 'LTC/BTC', 'LTC/EUR']),
        selected_id: 1,
        selected_product: 'BTC-USD',
        selected_denom: 'USD',
        salesDepth: 35,
        ws: null,
        wsConnected: false,
        book: {
            asks: [[0.00,0]],
            bids: [[0.00,0]]
        },
        bookConnected: false,
        chartData: [],
        time: [],
        low: [],
        high: [],
        open: [],
        close: [],
        volume: [],
        chartInterval: '1d'
    },
    mutations: {
        toggleWS(state) {
            state.wsConnected = !state.wsConnected
        },
        updateProduct(state, id) {
            state.selected_id = id
            state.selected_product = (_.find(state.products, o => {
                return o.id === state.selected_id
            })).product_id
            var arr = _.split(state.selected_product, "-")
            state.selected_denom = arr[1]
        },
        initProducts(state, ticker) {
            // find correct product
            var i = _.findIndex(state.products, (o) => {
                return o.product_id === ticker.product_id
            })

            // set values from ticker message
            // =========== may use these variables later
            // state.products[i].best_ask = ticker.best_ask
            // state.products[i].best_bid = ticker.best_bid
            // state.products[i].high_24h = ticker.high_24h
            // state.products[i].low_24h = ticker.low_24h
            state.products[i].open_24h = ticker.open_24h
            state.products[i].price = ticker.price
            state.products[i].priceDelta24h = ((parseFloat(ticker.price) - (parseFloat(ticker.open_24h))) / parseFloat(ticker.open_24h) * 100).toFixed(2)
            state.products[i].sequence = ticker.sequence
            state.products[i].volume_24h = ticker.volume_24h
            // state.products[i].volume_30d = ticker.volume_30d

            // update color of % delta element
            if (ticker.price > ticker.open_24h) {
                state.products[i].deltaClass = "has-text-success"
            } else if (ticker.price < ticker.open_24h) {
                state.products[i].deltaClass = "has-text-danger"
            } else {
                state.products[i].deltaClass = ""
            }
            // console.log(state.products[i])
        },
        addSale(state, sale) {
            var i = _.findIndex(state.products, (o) => {
                return o.product_id === sale.product_id
            })
            var x = _.clone(sale)
            x.change = ''
            x.class = ''

            // add new sales
            if (sale.sequence > state.products[i].sequence) {
                // add new sale to begining of sales array and limit array to last 100 sales
                state.products[i].sales.unshift(x)
                if (state.products[i].sales.length > state.salesDepth) {
                    state.products[i].sales.pop()
                }

                // =========== may use these variables later

                // state.products[i].best_ask = x.best_ask
                // state.products[i].best_bid = x.best_bid
                // state.products[i].high_24h = x.high_24h
                // state.products[i].low_24h = x.low_24h
                // state.products[i].last_size = x.last_size
                state.products[i].open_24h = x.open_24h
                state.products[i].price = x.price
                state.products[i].priceDelta24h = ((parseFloat(x.price) - (parseFloat(x.open_24h))) / parseFloat(x.open_24h) * 100).toFixed(2)
                state.products[i].sequence = x.sequence
                state.products[i].side = x.side
                state.products[i].trade_id = x.trade_id
                state.products[i].volume_24h = x.volume_24h
                // state.products[i].volume_30d = x.volume_30d

                // update color of % delta element
                if (sale.price > sale.open_24h) {
                    state.products[i].deltaClass = "has-text-success"
                } else if (sale.price < sale.open_24h) {
                    state.products[i].deltaClass = "has-text-danger"
                } else {
                    state.products[i].deltaClass = ""
                }

            } else {
                console.log("Out of Sequence")
                // add new sale to array and sort by sequence number
                state.products[i].sales = _.chain(state.products[i].sales)
                                                .concat(x)
                                                .orderBy((o) => {
                                                    o.sequence
                                                }, ['desc'])
                                                .value()

                if (state.products[i].sales.length > state.salesDepth) {
                    state.products[i].sales.pop()
                }
            }



            var length = state.products[i].sales.length
            state.products[i].sales[length - 1].change = '=' // set last value to no change
            state.products[i].sales[length - 1].class = 'sales-span has-text-right'


            for (let j = length - 2; j >= 0; j--) {
                if (state.products[i].sales[j].price > state.products[i].sales[j + 1].price) {
                    state.products[i].sales[j].change = '+'
                    state.products[i].sales[j].class = 'sales-span has-text-right has-text-success'
                } else if (state.products[i].sales[j].price < state.products[i].sales[j + 1].price) {
                    state.products[i].sales[j].change = '-'
                    state.products[i].sales[j].class = 'sales-span has-text-right has-text-danger'
                } else {
                    state.products[i].sales[j].change = '='
                    state.products[i].sales[j].class = state.products[i].sales[j + 1].class
                }
            }
        },
        initBook(state, book) {
            state.book = {
                asks: book.asks,
                bids: book.bids
            }
        },
        updateBook(state, update) {
           
        },
        setChartData(state, data) {
            for (var i = 0; i < data.length; i++) {
                state.time[i] = moment.utc(data[i][0]*1000).local().toISOString().split('T')[0]
                state.low[i] = data[i][1]
                state.high[i] = data[i][2]
                state.open[i] = data[i][3]
                state.close[i] = data[i][4]
                state.volume[i] = data[i][5]
            }
        },
        updateChartData(state, update) {
            // check date of sale to determine if new bar needs to be added to chart
            var t = moment.utc(update.time).local().toISOString().split('T')[0]

            if (update.price != state.close[0] && t === state.time[0]) {
                // replace current price
                state.close.shift()
                state.close.unshift(update.price)
                // check to set new high/low
                state.low[0] = update.price < state.low[0] ? update.price : state.low[0]
                state.high[0] = update.price > state.high[0] ? update.price : state.high[0]
            } else if (t != state.time[0]) {
                // add new bar to dataset
                state.close.unshift(update.price)
                state.low.unshift(update.price)
                state.high.unshift(update.price)
                state.open.unshift(update.price)
                state.time.unshift(t)
            }
        }
    }
})