<template>
  <dashboard class="dashboard is-marginless is-paddingless"></dashboard>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import xs from 'xstream'

export default {
  name: 'app',
  data() {
    return {
      winProducer: {
        start: (listener) => {
          window.onresize = event => {
            listener.next(event)
          }
        },
        stop: () => {
          console.log("No longer listening to changes in window size.")
        }
      },
      windowListener: {
        next: (value) => {
          this.$store.commit('setWin', value)
        },
        err: (err) => {
          console.log("Error listening to window size: ", err)
        }
      }
    }
  },
  computed: {
    window$() {
      return xs.createWithMemory(this.winProducer).map(v => {
        return {
          width: v.target.innerWidth,
          height: v.target.innerHeight
        }
      })
    },
    type() {
      return this.$store.state.win.type
    }
  },
  mounted() {
    this.$store.commit('setWin', { width: window.innerWidth, height: window.innerHeight })
    this.window$.addListener(this.windowListener)
  },
  components: {
    Dashboard
  }
}
</script>

<style>
body {
  height: 100%;
  overflow: hidden;
}

div {
  margin-bottom: -10px;
}

.dashboard {
  height: 100%;
}

.info {
  height: 50px;
}
</style>
