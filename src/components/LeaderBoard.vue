<template>
  <div class="main">
    <v-popup 
      v-if="isInfoPopupVisible"
      @closePopup="closeInfoPopup"
      :username="currentPlayer"
      :number="gameNumber"
    />
    <h1>ТОП 100 ИГРОКОВ</h1>
    <div id = "players-list">
      <div v-for="(player, index) in players" :key="index">
        <Player
          @showModal="showPopupInfo"  
          @currentPlayerChanged="setCurrentPlayer"
          :cls="'i' + (index + 1)" 
          :pos="index + 1" 
          :name="player"
          :currentPlayer="currentPlayer"/>
      </div>
    </div>
  </div>
</template>

<script>
import Player from "./Player.vue"
import vPopup from "./v-popup.vue"
import axios from 'axios'


export default {
  components: {
    Player,
    vPopup
  },
  el: "#leaderboard",
  data() {
    return {
      players: [],
      currentPlayer: "",
      gameNumber: 0,
      isInfoPopupVisible: false
    }
  },
  mounted(){
    this.fetchLeaderboard()
  },
  methods: {
      fetchLeaderboard(){
        var self = this;
        axios.get(`http://localhost:3000/leaderboard`).then((response) => {
          self.players = response.data.players
        })
      },
      showPopupInfo(number) {
        this.gameNumber = number
        this.isInfoPopupVisible = true;
        const body = document.body;
        body.style.height = "100vh";
        let initialWidth = document.body.offsetWidth;
        body.style.overflowY = "hidden";
        body.style.paddingRight = (body.offsetWidth - initialWidth) +  'px';
      },
      closeInfoPopup() {
        this.isInfoPopupVisible = false;
        document.body.style.overflowY = "visible";
      },
      setCurrentPlayer(username) {
        this.currentPlayer = username
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
    /* overflow: hidden; */
    border-radius: 10px; 
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