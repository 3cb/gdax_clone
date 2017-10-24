<template>
    <div>
        <h3 class="has-text-weight-semibold">Bitcoin</h3>
        <watchlist-row :products="btcProducts"></watchlist-row>
        <h3 class="has-text-weight-semibold">Ether</h3>
        <watchlist-row :products="ethProducts"></watchlist-row>
        <h3 class="has-text-weight-semibold">Litecoin</h3>
        <watchlist-row :products="ltcProducts"></watchlist-row>
    </div>
</template>

<script>
import WatchlistRow from './WatchlistRow.vue'
import _ from 'lodash'

export default {
    computed: {
        btcProducts() {
            return _.dropRight(this.$store.state.products, 6)
        },
        ethProducts() {
            return _.chain(this.$store.state.products)
                        .drop(3)
                        .dropRight(3)
                        .value()
        },
        ltcProducts() {
            return _.drop(this.$store.state.products, 6)
        }
    },
    components: {
        WatchlistRow
    }
}
</script>

<style>

</style>
