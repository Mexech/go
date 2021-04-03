<template>
    <div class = "player-info" v-bind:class="cls" v-on:click="emitDropdownClick">
        <div style = "width: 50%;">
            <span class="index"> {{pos}} </span>
            <span>{{name}}</span> 
        </div>
    </div>
    <div v-bind:class="[id == activeItemId ? 'dropdown-show': 'dropdown']">
      <div class = "dropdown-content">
        <div @click="emitShowModal" class = "section">
          <div style = "display: flex; flex-direction: row; align-items: center;">
            <img src = "../assets/white.svg">
            <p>{{name}}[9d]</p>
          </div>
          <p>VS</p>
          <div style = "display: flex; flex-direction: row; align-items: center;">
            <img src = "../assets/black.svg">
            <p>Another player[9d]</p>
          </div>
        </div>
        <div class = "divider"></div>
        <div @click="emitShowModal" class = "section">
          <div style = "display: flex; flex-direction: row; align-items: center;">
            <img src = "../assets/white.svg">
            <p>{{name}}[9d]</p>
          </div>
          <p>VS</p>
          <div style = "display: flex; flex-direction: row; align-items: center;">
            <img src = "../assets/black.svg">
            <p>Another player[9d]</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

export default{
    name: "Player",
    props: ["pos", "name", "cls", "id", "activeItemId"],
    methods: {
       emitShowModal(){
          this.$emit("showModal", this.name)
        },
        emitDropdownClick(){
          this.$emit("dropdownClick", this.id)
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
    /* border-radius: 0 0 10px 10px; */
  }

  .i5:hover{
    background-color: #b94f4f;
  }

  .dropdown{
    opacity: 0;
    visibility: hidden;
    height: 0px;
    transition: all 0.3s ease;
    background-color: white;
  }

  .dropdown-show{
    height: 50px;
    transition: all 0.3s ease;
    font-size: 18px;
    color: black;
  }

  .dropdown-content{
    height: 50px;
    display: flex;
    flex-direction: row;
  }

  .section{
    flex: 1 1 auto;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }

  .divider{
    height: 50px;
    width: 1.6px;
    background-color: silver;
  }
</style>
