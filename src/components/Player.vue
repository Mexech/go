<template>
    <div class = "player-info" v-bind:class="cls">
        <div style = "width: 50%;">
            <span class="index"> {{pos}} </span>
            <span>{{name}}</span> 
        </div>
        <div>
            <button v-on:click="show()">Text</button>
        </div>
    </div>
    <div style = "display: flex;">
        <div v-bind:class="dynamicCls">
        {{name}}
        </div>
    </div>
</template>

<script>

export default{
    name: "Player",
    props: {
        pos: Number,
        name: String,
        cls: String,
    },
    data() {
        return{
            dynamicCls: ""
        }
    },
    methods: {
        show(){
            this.dynamicCls === "dropdown" ? this.dynamicCls = "": this.dynamicCls = "dropdown"
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
       opacity: 1;
        visibility: visible;
        transform: translateY(0);
      animation: fade 2s linear forwards;
  }
</style>
