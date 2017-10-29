<template>
<div>
    <nav class="level info is-marginless">
    </nav>
    <nav class="level info is-marginless is-paddingless">
        <span class="is-uppercase has-text-weight-semibold">Order Book</span>
    </nav>
    <order-book></order-book>
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

</style>
