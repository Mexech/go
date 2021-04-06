<template>
    <div class = "player-info" v-bind:class="cls" v-on:click="handleClick()">
        <div style = "width: 50%;">
            <span class="index"> {{pos}} </span>
            <span>{{name}}</span> 
        </div>
    </div>
    <div v-bind:class="{dropdown: (name != currentPlayer), dropdownShow: (name == currentPlayer)}">
      <div class = "dropdown-content">
        <div class="container">
          <div v-for="index in 2" :key="index" @click="emitShowModal(index-1)" class = "section">
            <div v-if="!loading" class="black circle">
              <img src="../assets/crown.svg" v-if="(Number(games?.[index-1]?.score) > 0 || games?.[index-1]?.score[0] == 'W')" class='left winner'>
              <img src="../assets/flag.svg" v-else-if="(games?.[index-1]?.score[0] == 'B')" class='left resigner'>
            </div>
            <loader v-else/>
            <a>{{games?.[index-1]?.players?.black?.name}} vs {{games?.[index-1]?.players?.white?.name}}</a>
            <div v-if="!loading" class="white circle">
              <img src="../assets/crown.svg" v-if="(Number(games?.[index-1]?.score) < 0 || games?.[index-1]?.score[0] == 'B')" class='right winner'>
              <img src="../assets/flag.svg" v-else-if="(games?.[index-1]?.score[0] == 'W')" class='right resigner'>
            </div>
            <span class="date">{{timestamps?.[index-1]}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import loader from './pulsatingLoader.vue'

export default{
    components: {
      loader,
    },
    name: "Player",
    emits: ['showModal', 'currentPlayerChanged'],
    props: {
        pos: Number,
        name: String,
        cls: String,
        currentPlayer: String
    },
    data() {
        return{
            loading: false,
            games: [],
            timestamps: []
        }
    },
    methods: {
        handleClick(){
          // this.dynamicCls == "dropdown" ? this.dynamicCls = "dropdownShow": this.dynamicCls = "dropdown"
          this.$emit('currentPlayerChanged', this.name)
          this.loading = true
          axios.get(`http://localhost:3000/archive/${this.name}`).then((response) => {
            this.loading = false
            this.games = response.data.games
            response.data.games.forEach(game => {
              const date = new Date(game.timestamp)
              this.timestamps.push(date.toLocaleDateString('ru-RU'))
            })
          })
        },
        emitShowModal(number){
          this.$emit("showModal", number)
        }
    }
}
</script>

<style scoped lang="scss">
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
    transform: scaleX(1.01);
    filter: drop-shadow(0px 5px 8px rgb(0, 0, 0, 0.6));
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

  .i2{
    background-color: #d16155;
  }

  .i3{
    background-color: #c85952;
  }

  .i4{
    background-color: #c0544e;
  }

  .i5{
    background-color: #b44c4c;
  }

  .dropdown{
    opacity: 0;
    visibility: hidden;
    height: 0px;
    transition: all 0.3s;
    background-color: white;
  }

  .dropdownShow{
    /* height: 50px; */
    height: fit-content;
    transition: all 0.3s;
    font-size: 18px;
    color: black;
  }

  .dropdown-content{
    height: fit-content;
    display: flex;
    flex-direction: row;
  }
  
  .container > * {
    margin: 4px 0 0 4px;
  }

  .container {
    display: inline-flex;
    flex-grow: 1;
    flex-wrap: wrap;
    margin: -4px 0 0 -4px;
    width: calc(100% + 4px);
  }

  .section{
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    justify-content: center;
    position: relative;
    a {
      margin: 0.8rem;
    }
  }

  .section:hover{
    background-color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
  }

  .circle {
    margin-top: 0px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    display: inline-block;
  }

  .black {
      background: #272727;
  }

  .white {
      background: #FFFFFF;
  }

  .winner {
    filter: invert(91%) sepia(25%) saturate(7464%) hue-rotate(4deg) brightness(108%) contrast(104%);
    &.left{
      transform: translate(-12px, -8px) rotate(-45deg)
    }
    &.right{
      transform: translate(12px, -8px) rotate(45deg)
    }
  }

  .resigner {
    &.left{
      filter: invert(1);
      transform: scaleX(-1) translate(28px, -2px) rotate(30deg) 
    }
    &.right{
      transform: scaleX(1) translate(28px, -2px) rotate(30deg) 
    }
  }

  .date {
    font-size: 1rem;
    background: azure;
    position: absolute;
    bottom:0;
    right:0;
    border-radius: 6px 0 0;
    padding-left: 2px;
  }
</style>
