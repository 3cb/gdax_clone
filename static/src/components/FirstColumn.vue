<template>
    <div id="col-cont">
        <nav class="level info is-paddingless is-marginless">
            <span class="level-item">
                    <a href="https://www.gdax.com/"><strong>GDAX_clone</strong></a>
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
#col-cont {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
