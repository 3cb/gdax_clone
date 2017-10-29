<template>
    <div>
        <ul><li class="has-text-weight-semibold spacer">Bitcoin</li></ul>
        <watchlist-row :products="btcProducts" class=""></watchlist-row>
        <ul><li class="has-text-weight-semibold spacer">Ether</li></ul>
        <watchlist-row :products="ethProducts"></watchlist-row>
        <ul><li class="has-text-weight-semibold spacer">Litecoin</li></ul>
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
