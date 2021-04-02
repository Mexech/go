<template>
  <!-- <LeaderBoard/> -->
  <ReplayBoard/>
</template>

<script>
  // import LeaderBoard from './components/LeaderBoard.vue'
  import ReplayBoard from './components/ReplayBoard.vue'

  export default {
    name: 'App',
    components: {
      // LeaderBoard,
      ReplayBoard
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #fff;
  }
</style>
