import Vue from 'vue'
import Vuex from 'vuex'
import { addCommas } from '../lib/numbers.js'
import _ from 'lodash'
import { getProducts } from './products.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: getProducts(['BTC/USD', 'BTC/EUR', 'BTC/GBP', 'ETH/USD', 'ETH/BTC', 'ETH/EUR', 'LTC/USD', 'LTC/BTC', 'LTC/EUR']),
        selected_id: 1,
        selected_product: 'BTC-USD',
        ws: null,
        wsConnected: false,
        book: [],
        bookConnected: false
    },
    mutations: {
        toggleWS(state) {
            state.wsConnected = !state.wsConnected
        },
        updateProduct(state, id) {
            state.selected_id = id
            state.selected_product = (_.find(state.products, o => { return o.id === state.selected_id })).product_id
        },
        initProducts(state, ticker) {
            // find correct product
            var i = _.findIndex(state.products, (o) => { return o.product_id === ticker.product_id })

            // set values from ticker message
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
            var i = _.findIndex(state.products, (o) => { return o.product_id === sale.product_id })
            var x = _.clone(sale)
            x.change = ''
            x.class = ''

            // add new sales
            if (sale.sequence > state.products[i].sequence) {
                // add new sale to begining of sales array and limit array to last 100 sales
                state.products[i].sales.unshift(x)
                if (state.products[i].sales.length > 50) {
                    state.products[i].sales.pop()
                }
               
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
                                        .orderBy((o) => { o.sequence }, ['desc'])
                                        .value()

                if (state.products[i].sales.length > 50) {
                    state.products[i].sales.pop()
                }
            }
            
            

            var length = state.products[i].sales.length
            state.products[i].sales[length-1].change = '=' // set last value to no change
            state.products[i].sales[length-1].class = 'sales-span has-text-centered'

            
            for (let j = length-2; j >= 0; j--) {
                if (state.products[i].sales[j].price > state.products[i].sales[j+1].price) {
                    state.products[i].sales[j].change = '+'
                    state.products[i].sales[j].class = 'sales-span has-text-centered has-text-success'
                } else if (state.products[i].sales[j].price < state.products[i].sales[j+1].price) {
                    state.products[i].sales[j].change = '-'
                    state.products[i].sales[j].class = 'sales-span has-text-centered has-text-danger'
                } else {
                    state.products[i].sales[j].change = '='
                    state.products[i].sales[j].class = state.products[i].sales[j+1].class
                }
            }
        }
    }
})