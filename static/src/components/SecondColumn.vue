<template>
    <div id="column2">
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
