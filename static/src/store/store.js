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
        updateTicker(state, ticker) {
            // find correct product
            var i = _.findIndex(state.products, (o) => {
                return o.product_id === ticker.product_id
            })

            if (ticker.sequence > state.products[i].sequence) {
                // only set price/priceDelta on intial ticker message (uses "matches" channel messages to update)
                if (!ticker.time) {
                    state.products[i].price = ticker.price
                    state.products[i].priceDelta24h = ((parseFloat(ticker.price) - (parseFloat(ticker.open_24h))) / parseFloat(ticker.open_24h) * 100)
                }
                
                // set values from ticker message
                state.products[i].best_ask = ticker.best_ask
                state.products[i].best_bid = ticker.best_bid
                state.products[i].high_24h = ticker.high_24h
                state.products[i].low_24h = ticker.low_24h
                state.products[i].open_24h = ticker.open_24h
                state.products[i].sequence = ticker.sequence
                state.products[i].volume_24h = ticker.volume_24h
                state.products[i].volume_30d = ticker.volume_30d

                // update color of % delta element
                if (ticker.price > ticker.open_24h) {
                    state.products[i].deltaClass = "has-text-success"
                } else if (ticker.price < ticker.open_24h) {
                    state.products[i].deltaClass = "has-text-danger"
                } else {
                    state.products[i].deltaClass = ""
                }
            }
        },
        updatePriceTicker(state, { price, product_id, trade_id }) {
            // find correct product
            var index = _.findIndex(state.products, o => {
                return o.product_id === product_id
            })
            // conditionally set price with most recent trade price
            if (trade_id > state.products[index].trade_id) {
                state.products[index].price = price
                state.products[index].priceDelta24h = ((parseFloat(price) - (parseFloat(state.products[index].open_24h))) / parseFloat(state.products[index].open_24h) * 100)
                state.products[index].trade_id = trade_id
            }
        },
        initTrades(state, { data, product }) {
            // find correct product
            var index = _.findIndex(state.products, o => {
                return o.product_id === product
            })
            // push most recent trade data into state.products[].trades[] and set display classes
            for (var i = 0; i < data.length; i++) {
                if (data[i].side === 'sell') {
                    state.products[index].trades.push({ ...data[i], change: '+', class: "sales-span has-text-right has-text-success" })
                } else if (data[i].side === 'buy') {
                    state.products[index].trades.push({ ...data[i], change: '-', class: "sales-span has-text-right has-text-danger" })
                }
            }

            // conditionally set initial watchlist prices/priceDeltas with most recent trade
            if (data[0].trade_id > state.products[index].trade_id) {
                state.products[index].price = data[0].price
                state.products[index].priceDelta24h = ((parseFloat(data[0].price) - (parseFloat(state.products[index].open_24h))) / parseFloat(state.products[index].open_24h) * 100)
                state.products[index].trade_id = data[0].trade_id
            }
        },
        addTrade(state, { trade, product }) {
            var index = _.findIndex(state.products, o => {
                return o.product_id === product
            })
            if (trade.side === "sell") {
                state.products[index].trades.unshift({ ...trade, change: '+', class: 'sales-span has-text-right has-text-success' })
            } else if (trade.side === "buy") {
                state.products[index].trades.unshift({ ...trade, change: '-', class: 'sales-span has-text-right has-text-danger' })
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
            // initialize chart with data from http request
            if (state.chartInterval === '1d') {
                for (var i = 0; i < data.length; i++) {
                    state.time[i] = moment.utc(data[i][0]*1000).local().toISOString()
                    state.low[i] = data[i][1]
                    state.high[i] = data[i][2]
                    state.open[i] = data[i][3]
                    state.close[i] = data[i][4]
                    state.volume[i] = data[i][5]
                }
                console.log(state.time[0])
            } else if (state.chartInterval === '1m') {
                for ( var i = 0; i < data.length; i++) {
                    state.time[i] = moment.utc(data[i][0]*1000).local().toISOString()
                    state.low[i] = data[i][1]
                    state.high[i] = data[i][2]
                    state.open[i] = data[i][3]
                    state.close[i] = data[i][4]
                    state.volume[i] = data[i][5]
                }
                console.log(state.time[0])
            }
        },
        updateChartData(state, update) {
            // check date of sale to determine if new bar needs to be added to chart
            if (state.chartInterval === '1d') {
                var t = moment.utc(update.time).local().toISOString().split('T')[0]
            } else if (state.chartInterval === '1m') {
                var t = moment.utc(update.time).local().toISOString().split(':')[1]
            }
            console.log(t)

            switch(state.interval) {
                case '1d':
                    if (update.price != state.close[0] && t === state.time[0]) {
                        // replace current price
                        // state.close[0] = update.price
                        state.close.shift()
                        state.close.unshift(update.price)
                        
                        // conditionally set new high/low
                        state.low[0] = update.price < state.low[0] ? update.price : state.low[0]
                        state.high[0] = update.price > state.high[0] ? update.price : state.high[0]
                    } else if (t != state.time[0]) {
                        // add new bar to dataset
                        state.close.unshift(update.price)
                        state.low.unshift(update.price)
                        state.high.unshift(update.price)
                        state.open.unshift(update.price)
                        state.time.unshift(t)
                        state.time.pop()
                    }
                    break
                case '1m':
                    if (update.price != state.close[0] && t === state.time[0].split(':')[1].join(':')) {

                    }
            }
        }
    }
})