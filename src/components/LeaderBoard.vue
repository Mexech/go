<template>
  <h1>ТОП 100 ЧЕЛОВ</h1>
  <ul>
      <li v-for="(player, index) in players" :key="index" v-bind:class="'i' + (index + 1)">
        <span class="index"> {{index + 1}} </span>
        <span>{{player}}</span>
      </li>
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

<style scoped>
  ul{
    padding-left: 0;
  }
  li{
    list-style-type: none;
    font-size: 18px;
    text-align: left;
    height: 50px;
    line-height: 50px;
  }

  li:hover{
    background-color: #393f49;
    cursor: pointer;
  }

  .index{
    margin: 0 20px 0 20px;
    color: rgb(178, 114, 119);
    border-radius: 20px;
    background-color: white;
    padding-right: 5px;
    padding-left: 5px;
    user-select: none;
  }

  .i1{
    background-color: #db705b;
  }

  .i1:hover{
    background-color: #df735f;
  }

  .i2{
    background-color: #d16155;
  }

  .i2:hover{
    background-color: #d36357;
  }

  .i3{
    background-color: #c85952;
  }

  .i3:hover{
    background-color: #ca5b54;
  }

  .i4{
    background-color: #c0544e;
  }

  .i4:hover{
    background-color: #c3574f;
  }

  .i5{
    background-color: #b44c4c;
    border-radius: 0 0 10px 10px;
  }

  .i5:hover{
    background-color: #b94f4f;
  }
</style>