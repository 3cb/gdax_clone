<template>
    <div id="col-cont">
        <nav id="col1-header" class="level info is-paddingless is-marginless">
            <span class="level-item is-size-5">
                <span class="icon">
                    <a href="https://github.com/3cb/gdax_clone" target="_blank"><i class="fa fa-github" aria-hidden="true"></i></a>
                </span>
                <a href="https://www.gdax.com/trade/BTC-USD" target="_blank"><strong>GDAX_clone</strong></a>
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
    padding-left: .75rem;
}

/* #col-cont */
#col1-header a:hover {
    color: hsl(171, 100%, 41%);
}
</style>
