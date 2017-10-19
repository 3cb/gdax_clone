<template>
    <div>
        <div class="columns">
            <div class="column is-narrow">
                <tradebar></tradebar>
            </div>
            <div class="column is-narrow">
                <order-book></order-book>
            </div>
            <div class="column">
                <chart></chart>
            </div>
            <div class="column is-2">
                <trade-history></trade-history>
            </div>
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
            ws: '',
            mainListener: {
                next(value) {
                    // console.log(value)
                },
                error(err) {
                    console.log("Error from websocket: ", err)
                },
                complete() {
                    console.log("Stream Complete")
                }
            },
            tickerListener: {
                next(value) {
                    console.log(value)
                    store.commit('tickerUpdate', value)
                },
                error(err) {
                    console.log("Error from websocket:", err)
                },
                complete() {
                    console.log("Ticker channel stream complete.")
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
        }
    },
    beforeMount() {
        this.main$.addListener(this.mainListener)
        this.ticker$.addListener(this.tickerListener)
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
