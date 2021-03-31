<template>
  <div id = "leaderboard">
    <div id = "header">
      <h1>ТОП 100 ЧЕЛОВ</h1>
    </div>
    <div id = "players-list" v-for="(player, index) in players" :key="index">
      <Player :cls="'i' + (index + 1)" :pos="index + 1" :name="player"/>
    </div>
  </div>
</template>

<script>
import Player from "./Player.vue"

export default {
  components: {
    Player
  },
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
  html, body{margin: 0; padding: 0;}

  #players-list{
    display: flex;
    flex-direction: column;
  }

  #leaderboard{
    padding-left: 15%;
    padding-right: 15%;
    display: flex;
    flex-direction: column;
  }

  #header{
    background-color: #373d47;
  }
</style>