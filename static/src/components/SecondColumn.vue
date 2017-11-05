<template>
    <div id="column2">
        <nav class="level info is-marginless">
        <div class="level-item has-text-centered" v-if="winSize.width <= 1600 && winSize.width > 769">
            <div>
              <p class="has-text-weight-bold has-text-primary">{{ selectedProduct }}</p>
              <p class="heading">Current Product</p>
            </div>
          </div>
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Order Book</span>
        </nav>
        <div class="scroll-hidden">
            <order-book></order-book>
        </div>
    </div>
</template>

<script>
import OrderBook from './OrderBook.vue'

export default {
    computed: {
        winSize() {
            return this.$store.state.win
        },
        selectedProduct() {
            return this.$store.state.selected_product.split('-').join('/')
        }
    },
    components: {
        OrderBook
    }
}
</script>

<style>
#column2 {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.scroll-hidden {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
