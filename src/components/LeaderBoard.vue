<template>
  <h1>ТОП 100 ЧЕЛОВ</h1>
  <ul>
      <li v-for="(player, index) in players" :key="index">{{player}}</li>
  </ul>
</template>

<script>
export default {
  el: "#leaderboard",
  data() {
    return {
      players: [],
    }
  },
  mounted(){
    this.fetchLeaderboard()
  },
  methods: {
    fetchLeaderboard(){
      let xhr = new XMLHttpRequest();
      var self = this;
      xhr.open('GET', 'https://cors-anywhere.herokuapp.com/https://www.gokgs.com/top100.jsp');
      xhr.send();
      xhr.onload = function() {
        if (xhr.status != 200) { 
          alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); 
        } else {
          const parser = new DOMParser();
          const leaderboardDOM = parser.parseFromString(xhr.response, "text/html")
          leaderboardDOM.getElementsByTagName('a').forEach((playerEntry) => {
            if (playerEntry.innerText) {
              self.players.push(playerEntry.innerText)
            }
          })
        }
      }
    }
  }
}
</script>

<style>

</style>