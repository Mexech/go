<template>
  <div class="main">
    <v-popup 
            v-if="isInfoPopupVisible"
            @closePopup="closeInfoPopup"
            :playername="playername"
    />
    <h1>ТОП 100 ЧЕЛОВ</h1>
    <input type = "text" class = "search-form" placeholder = "Search..." v-model="filter">
    <div id = "players-list" v-for="player in filtred" :key="player[1]">
      <Player @dropdownClick="dropdownClickHandler($event)" @showModal="showPopupInfo($event)" :cls="('i' + (player[1] + 1))" :pos="player[1] + 1" :name="player[0]" :id="player[1] + 1" :activeItemId="activeItemId"/>
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
      filter: "",
      isInfoPopupVisible: false,
      playername: "",
      activeItemId: undefined
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
    showPopupInfo(msg){
      this.isInfoPopupVisible = true;
      this.playername=msg;
      document.body.style.overflowY = "hidden";
      },
     closeInfoPopup() {
        this.isInfoPopupVisible = false;
        document.body.style.overflowY = "visible";
     },
     dropdownClickHandler(id){
       if(this.activeItemId == id){
         this.activeItemId = undefined
       }else{
         this.activeItemId = id
       }
     }
    },
    computed: {
      filtred: function(){
        let self = this
        let found = []
        this.players.forEach(function(el, index){
          if(el.toLowerCase().includes(self.filter.toLowerCase())){
            found.push([el, index])
          }
        })
        return found
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

  .main{
    padding-left: 15%;
    padding-right: 15%;
    display: flex;
    flex-direction: column;
  }

  #header{
    background-color: #373d47;
  }

  .search-form{
    width: 15rem; 
    height: 2rem;
    font-size: 20px; 
    border: 3px solid silver; 
    outline: none; 
    border-radius: 6px;
    margin-bottom: 10px;

  }

  /* .search-form:focus{
    background-color: white;
  } */
</style>