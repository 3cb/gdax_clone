<template>
<div>
    <nav class="level info is-paddingless is-marginless">
        <span class="level-item">
            <strong>GDAX</strong>
        </span>
        <span class="level-item select">
            <select v-model="selectedProduct">
                <option v-for="product in products" :key="product.id" :value="product">{{ product.name }}</option>
            </select>
        </span>
    </nav>
    <nav class="level info is-marginless is-paddingless">
        <span class="is-uppercase has-text-weight-semibold">Margin Trading</span>
    </nav>
</div>
</template>

<script>
export default {
    computed: {
        products() {
            return this.$store.state.products
        },
        selectedProduct: {
            get() {
                return this.$store.state.selectedProduct
            },
            set(value) {
                this.$store.commit('updateProduct', value)
            }
        }
    }
}
</script>

<style>

</style>
