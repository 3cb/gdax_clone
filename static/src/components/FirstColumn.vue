<template>
    <div>
        <nav class="level info is-paddingless is-marginless">
            <span class="level-item">
                <strong>GDAX</strong>
            </span>
        </nav>
        <nav class="level info is-marginless is-paddingless">
            <span class="is-uppercase has-text-weight-semibold">Watchlist</span>
        </nav>
        <watchlist></watchlist>
    </div>
</template>

<script>
import Watchlist from "./Watchlist.vue";

export default {
  components: {
    Watchlist
  }
};
</script>

<style>

</style>
