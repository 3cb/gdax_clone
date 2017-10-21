<template>
    <div class="columns">
        <div class="column is-narrow">
            <tradebar></tradebar>
        </div>
        <div class="column is-3">
            <order-book></order-book>
        </div>
        <div class="column">
            <chart></chart>
        </div>
        <div class="column is-3">
            <trade-history></trade-history>
        </div>
    </div>
</template>

<script>
import Tradebar from './Tradebar.vue'
import OrderBook from './OrderBook.vue'
import Chart from './Chart.vue'
import TradeHistory from './TradeHistory.vue'
import xs from 'xstream'
import _ from 'lodash'

export default {
    data() {
        var store = this.$store
        return {
            ws: null,
            tickerListener: {
                next(value) {
                    console.log(value)
                    store.commit('tickerUpdate', value)
                },
                error(err) {
                    console.log("Error from websocket - tickerListener:", err)
                },
                complete() {
                    console.log("Ticker channel stream complete.")
                }
            },
            historyListener: {
                next(value) {
                    if (value.sequence > store.state.history.sequence) {
                        store.commit('addSaleSequential', value)
                    } else {
                        store.commit('addSaleNonsequential', value)
                    }
                },
                error(err) {
                    console.log('Error from websocket - historyListener: ', err)
                },
                complete() {
                    console.log('History channel complete.')
                }
            }
        }
    },
    computed: {
        wsConnected() {
            return this.$store.state.wsConnected
        },
        producer() {
            var store = this.$store
            return {
                start(listener) {
                    this.ws = new WebSocket("wss://ws-feed.gdax.com")
                    var sock = this.ws
                    this.ws.onopen = (event) => {
                        console.log(event)
                        store.commit('toggleWS')
                        sock.send(JSON.stringify({
                            "type": "subscribe",
                            "product_ids": [
                                "BTC-USD"
                            ],
                            "channels": [
                                // "level2",
                                // "heartbeat"
                                "ticker"
                            ]
                        }))
                    }
                    this.ws.onmessage = (event) => {
                        listener.next(JSON.parse(event.data))
                    }
                },
                stop() {
                    this.ws.close()
                    this.ws.onclose = (event) => {
                        console.log(event)
                    }
                }
            }
        },
        main$() {
            return xs.createWithMemory(this.producer)
        },
        ticker$() {
            return xs.from(this.main$)
                .filter(v => v.type === "ticker" && v.sequence > this.$store.state.ticker.sequence && v.product_id === this.$store.state.selectedProduct.productId)
        },
        history$() {
            return xs.from(this.main$)
                .drop(1)
                .filter(v => v.type === "ticker" && v.product_id === this.$store.state.selectedProduct.productId)
        }
    },
    beforeMount() {
        this.ticker$.addListener(this.tickerListener)
        this.history$.addListener(this.historyListener)
    },
    components: {
        Tradebar,
        OrderBook,
        Chart,
        TradeHistory
    }
}
</script>

<style>

</style>
