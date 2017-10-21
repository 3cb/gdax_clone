import Vue from 'vue'
import Vuex from 'vuex'
import { addCommas } from '../lib/numbers.js'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: [
            { id: 1, name: "BTC/USD", productId:"BTC-USD", last: null, priceDelta24h: null, volume24h: null },
            { id: 2, name: "BTC/EUR", productId: "BTC-EUR", last: null, priceDelta24h: null, volume24h: null },
            { id: 3, name: "BTC/GBP", productId: "BTC-GBP", last: null, priceDelta24h: null, volume24h: null },
            { id: 4, name: "ETH/USD", productId: "ETH-USD", last: null, priceDelta24h: null, volume24h: null },
            { id: 5, name: "ETH/BTC", productId: "ETH-BTC", last: null, priceDelta24h: null, volume24h: null },
            { id: 6, name: "ETH/EUR", productId: "ETH-EUR", last: null, priceDelta24h: null, volume24h: null },
            { id: 7, name: "LTC/USD", productId: "LTC-USD", last: null, priceDelta24h: null, volume24h: null },
            { id: 8, name: "LTC/BTC", productId: "LTC-BTC", last: null, priceDelta24h: null, volume24h: null },
            { id: 9, name: "LTC/EUR", productId: "LTC-EUR", last: null, priceDelta24h: null, volume24h: null }

        ],
        selectedProduct: { id: 1, name: "BTC/USD", productId: "BTC-USD", last: null, priceDelta24h: null, volume24h: null },
        marginOn: false,
        wsConnected: false,
        ticker: {
            sequence: null,
            deltaClass: null
        },
        history: {
            sales: [], // { size, price, sequence, change }
            lastSize: '',
            lastPrice: '',
            sequence: null
        }
    },
    mutations: {
        updateProduct(state, product) {
            state.selectedProduct = product
        },
        toggleWS(state) {
            state.wsConnected = !state.wsConnected
        },
        tickerUpdate(state, ticker) {
            // set ticker sequence number
            if (ticker.sequence > state.ticker.sequence) {
                state.ticker.sequence = ticker.sequence
            }

            // update price, volume, and % delta
            state.selectedProduct.last = addCommas((parseFloat(ticker.price)).toFixed(2))
            state.selectedProduct.priceDelta24h = ((parseFloat(ticker.price) - (parseFloat(ticker.open_24h))) / parseFloat(ticker.open_24h) * 100).toFixed(2)
            state.selectedProduct.volume24h = addCommas(Math.round(parseFloat(ticker.volume_24h)))

            // update color of % delta element
            if (ticker.price > ticker.open_24h) {
                state.ticker.deltaClass = "has-text-weight-semibold has-text-success"
            } else if (ticker.price < ticker.open_24h) {
                state.ticker.deltaClass = "has-text-weight-semibold has-text-danger"
            } else {
                state.ticker.deltaClass = "has-text-weight-semibold"
            }
        },
        addSaleSequential(state, sale) {
            var x = {
                size: sale.last_size,
                price: sale.price,
                time: sale.time,
                sequence: sale.sequence,
                change: ''
            }
            state.history.sales.unshift(x)
            state.history.sales.lastSize = sale.last_size
            state.history.sales.lastPrice = sale.price
            state.history.sales.sequence = sale.sequence

            // set price delta sign
            var length = state.history.sales.length
            state.history.sales[length - 1].change = '=' // set last value to no change

            for (var i = length-2; i >= 0; i--) {
                if (state.history.sales[i].price > state.history.sales[i+1].price) {
                    state.history.sales[i].change = '+'
                } else if (state.history.sales[i].price < state.history.sales[i + 1].price) {
                    state.history.sales[i].change = '-'
                } else {
                    state.history.sales[i].change = '='
                }
            }
        },
        addSaleNonsequential(state, sale) {
            var x = {
                size: sale.last_size,
                price: sale.price,
                time: sale.time,
                sequence: sale.sequence,
                change: ''
            }
            state.history.sales = _.chain(state.history.sales)
                                        .concat(x)
                                        .orderBy((o) => { o.sequence }, ['desc'])
                                        .value()

        }
    }
})