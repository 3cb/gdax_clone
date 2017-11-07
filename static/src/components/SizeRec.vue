<template>
    <div class="is-marginless is-paddingless">
        <svg width="50" height="20" viewbox="0 0 50 50">
            <rect height="30" :width="width/max*7" :fill="color"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ["max", "size", "side"],
    computed: {
        color() {
            if (this.side === 'ask') {
                return "hsl(348, 100%, 61%)"
            } else if (this.side === 'bid') {
                return "hsl(141, 71%, 48%)"
            }
        },
        width() {
            return parseFloat(this.size) > 1 ? Math.round(this.size).toString() : "1"
        }
    }
}
</script>

<style>

</style>