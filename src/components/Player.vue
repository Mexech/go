<template>
    <div class = "player-info" v-bind:class="cls" v-on:click="show()">
        <div style = "width: 50%;">
            <span class="index"> {{pos}} </span>
            <span>{{name}}</span> 
        </div>
    </div>
    <div v-bind:class="[dynamicCls]">
      <div class = "dropdown-content">
        <div class="container">
          <div v-for="index in 2" :key="index" @click="emitShowModal(index)" class = "section">
            <p>{{games?.[index]?.players?.black?.name}} vs {{games?.[index]?.players?.white?.name}}</p>
          </div>
        </div>
        <!-- <div class = "divider"></div>
        <div v-if="!loading" @click="emitShowModal(1)" class = "section">
          <p>{{games[1].players.black.name}} vs {{games[1].players.white.name}}</p>
        </div> -->
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default{
    name: "Player",
    emits: ['showModal', 'currentPlayerChanged'],
    props: {
        pos: Number,
        name: String,
        cls: String,
    },
    data() {
        return{
            loading: false,
            dynamicCls: "dropdown",
            games: []
        }
    },
    methods: {
        show(){
          this.dynamicCls == "dropdown" ? this.dynamicCls = "dropdown-show": this.dynamicCls = "dropdown"
          this.$emit('currentPlayerChanged', this.name)
          this.loading = true
          axios.get(`http://localhost:3000/archive/${this.name}`).then((response) => {
            this.loading = false
            this.games = response.data.games
            console.log(response.data.games[0].players.black.name)
          })
        },
        emitShowModal(number){
          this.$emit("showModal", number)
        }
    }
}
</script>

<style scoped>
  #leaderboard{
    padding-left: 0;
  }
  .player-info{
    list-style-type: none;
    font-size: 18px;
    text-align: left;
    height: 50px;
    line-height: 50px;
    display: flex;
    flex-direction: row;
    background-color: #373d47;
  }

  .player-info:hover{
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
  }

  .i5:hover{
    background-color: #b94f4f;
  }

  .dropdown{
    opacity: 0;
    visibility: hidden;
    height: 0px;
    transition: all 0.3s;
    background-color: white;
  }

  .dropdown-show{
    height: 50px;
    transition: all 0.3s;
    font-size: 18px;
    color: black;
  }

  .dropdown-content{
    height: 50px;
    display: flex;
    flex-direction: row;
  }

  .container {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
  }

  .section{
    /* flex: 1 1 auto; */
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  .section:hover{
    background-color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
  }

  .divider{
    height: 50px;
    width: 1.6px;
    background-color: #373d47;
  }
</style>
