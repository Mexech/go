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
        document.body.style.overflowY = "hidden";
      },
      closeInfoPopup() {
        this.isInfoPopupVisible = false;
        document.body.style.overflowY = "visible";
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

  .index {
    margin: 0 20px 0 20px;
    color: rgb(178, 114, 119);
    border-radius: 20px;
    background-color: white;
    padding-right: 0px;
    padding-left: 5px;
    user-select: none;
  }

  .i1 {
    background-color: #db705b;
  }

  .i1:hover {
    background-color: #df735f;
  }

  .i2 {
    background-color: #d16155;
  }

  .i2:hover {
    background-color: #d36357;
  }

  .i3 {
    background-color: #c85952;
  }

  .i3:hover {
    background-color: #ca5b54;
  }

  .i4 {
    background-color: #c0544e;
  }

  .i4:hover {
    background-color: #c3574f;
  }

  .i5 {
    background-color: #b44c4c;
    border-radius: 0 0 10px 10px;
  }

  .i5:hover {
    background-color: #b94f4f;
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