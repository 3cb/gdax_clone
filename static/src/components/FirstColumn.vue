<template>
    <div>
        <nav class="level info is-paddingless is-marginless">
            <span class="level-item">
                <strong>GDAX</strong>
            </span>
            <span class="level-item select">
                <select v-model="selected_id">
                    <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
                </select>
            </span>
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Watchlist</span>
        </nav>
        <watchlist></watchlist>
    </div>
</template>

<script>
import Watchlist from './Watchlist.vue'

export default {
    computed: {
        products() {
            return this.$store.state.products
        },
        selected_id: {
            get() {
                return this.$store.state.selected_id
            },
            set(value) {
                this.$store.commit('updateProduct', value)
            }
        }
    },
    components: {
        Watchlist
    }
}
</script>

<style>

</style>
