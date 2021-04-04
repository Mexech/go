<template>
  <div class="main">
    <v-popup 
            v-if="isInfoPopupVisible"
            @closePopup="closeInfoPopup"
    />
    <h1>ТОП 100 ЧЕЛОВ</h1>
    <div id = "players-list" v-for="(player, index) in players" :key="index">
      <Player @showModal="showPopupInfo"  :cls="'i' + (index + 1)" :pos="index + 1" :name="player"/>
    </div>
  </div>
</template>

<script>
import Player from "./Player.vue"
import vPopup from "./v-popup.vue"

export default {
  components: {
    Player,
    vPopup
  },
  el: "#leaderboard",
  data() {
    return {
      players: [],
      isInfoPopupVisible: false
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
      },
      showPopupInfo() {
        this.isInfoPopupVisible = true;
        const body = document.body;
        body.style.height = "100vh";
        let initialWidth = document.body.offsetWidth;
        body.style.overflowY = "hidden";
        body.style.paddingRight = (body.offsetWidth - initialWidth) +  'px';
      },
      closeInfoPopup() {
        this.isInfoPopupVisible = false;
        const body = document.body;
        body.style.height = "100vh"
        body.style.overflowY = "visible";
        body.style.paddingRight = "0";
      }
    }
  }
</script>

<style scoped>
  ul {
    padding-left: 0;
  }

  li {
    list-style-type: none;
    font-size: 18px;
    text-align: left;
    height: 50px;
    line-height: 50px;
  }

  li:hover {
    background-color: #393f49;
    cursor: pointer;
  }

  html, body{margin: 0; padding: 0;}

  #players-list{
    display: flex;
    flex-direction: column;
  }

  .main{
    padding-left: 15%;
    padding-right: 15%;
    display: flex;
    flex-direction: column;
  }

  #header{
    background-color: #373d47;
  }
</style>