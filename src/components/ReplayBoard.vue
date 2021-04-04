<template>
  <!-- <h1>{{currentMove}}</h1> -->
  <!-- <table class="background">
      <tr v-for="(row, i) in boardArray.length-1" :key="i">
          <td style="border: 1px solid black;" v-for="(col, j) in boardArray[i].length-1" :key="j"></td>
      </tr>
  </table>
  <table class="foreground">
      <tr v-for="(row, i) in boardArray" :key="i">
            <td v-for="(col, j) in boardArray[i]" :key="j">
                <span class="circle" :class="{black: boardArray[i][j] == -1, white: boardArray[i][j] == 1}">
                </span>
            </td>
      </tr>
  </table>
  <button v-if="!loading" @click="prevMove">Prev Move</button>
  <button v-if="!loading" @click="nextMove">Next Move</button> -->
  <div class="wrapperBoard">
    <div class="wrapperGrids">
          <table class="background">
              <tr v-for="(row, i) in boardArray.length-1" :key="i">
                  <td v-for="(col, j) in boardArray[i].length-1" :key="j"></td>
              </tr>
          </table>
          <table class="foreground">
              <tr v-for="(row, i) in boardArray" :key="i">
                    <td v-for="(col, j) in boardArray[i]" :key="j">
                        <!-- {{boardArray[i][j] == 0 ? '+' : boardArray[i][j] == -1 ? 'B' : 'W'}} -->
                        <span class="circle" :class="{black: boardArray[i][j] == -1, white: boardArray[i][j] == 1}">
                        </span>
                    </td>
              </tr>    
          </table>
    </div>
      <div class="buttonBar">
            <button @click="prevMove" class="prevBtn"></button>
            <button @click="nextMove" class="nextBtn"></button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        username: String,
        number: Number
    },
    data() {
        return {
            GameMoves: [],
            currentMove: 0,
            boardArray: Array.from(Array(19), () => new Array(19).fill(0)),
            prisonersAtMove: [],
            loading: false
        }
    },
    mounted() {
        // let xhr = new XMLHttpRequest()
        var self = this
        console.log(this.username)
        this.loading = true
        axios.get(`http://localhost:3000/moves/${this.username}/${this.number}`).then(res => {
            self.GameMoves = res.data.moves
            // for (let rawMove of data) {
            //     var rawCoord = rawMove.slice(rawMove.indexOf('[')+1, rawMove.indexOf(']'))
            //     self.GameMoves.push([rawMove[0] == 'W' ? 1 : -1, rawCoord.charCodeAt(1) - 97, rawCoord.charCodeAt(0) - 97])
            // }
            self.prisonersAtMove = Array.from(Array(self.GameMoves.length+1), () => new Array().fill())
            self.loading = false
        })
        // xhr.open('GET', 'https://cors-anywhere.herokuapp.com/http://files.gokgs.com/games/2021/1/26/larc-HiraBot44.sgf');
        // xhr.send()
        // xhr.onload = function() {
        //     if (xhr.status != 200) { 
        //     alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
        //     } else {
        //         var data = xhr.response
        //         data = data.split(';')
        //         data.shift()
        //         const matchInfo = data.shift()
        //         console.log(matchInfo)
        //         for (let rawMove of data) {
        //             var rawCoord = rawMove.slice(rawMove.indexOf('[')+1, rawMove.indexOf(']'))
        //             self.GameMoves.push([rawMove[0] == 'W' ? 1 : -1, rawCoord.charCodeAt(1) - 97, rawCoord.charCodeAt(0) - 97])
        //         }
        //         self.prisonersAtMove = Array.from(Array(self.GameMoves.length+1), () => new Array().fill())
        //     }
        // }
    },
    methods: {
        nextMove() {
            function findPrisonedGroup(move, boardArray) {
                const dx = [1, 0, -1, 0]
                const dy = [0, -1, 0, 1]
                var stack = []
                var visited = Array.from(Array(19+1), () => new Array(19+1).fill(false))
                stack.push([move[0], move[1]])
                // var i = 0 
                while (stack.length) {
                    let node = stack.pop();                
                    if (visited[node[0]][node[1]] == false) {
                        visited[node[0]][node[1]] = true
                        for (let i = 0; i < 4; i++) {
                            if ((0 <= node[0] + dx[i] && node[0] + dx[i] < visited.length) && 
                               (0 <= node[1] + dy[i] && node[1] + dy[i] < visited.length)) {
                                let nextValOnBoard = boardArray[node[0]+dx[i]][node[1]+dy[i]]
                                let currentValOnBoard = boardArray[node[0]][node[1]] 
                                if (!nextValOnBoard) { //found liberty
                                    return Array.from(Array(19+1), () => new Array(19+1).fill(false))
                                } else if (nextValOnBoard == currentValOnBoard){
                                    stack.push([node[0] + dx[i], node[1] + dy[i]])
                                } 
                            } 
                        }
                    }
                }
                return visited
            }
            for (let t = 0; t < 1; t++) {
                const move = this.GameMoves[this.currentMove]
                if (this.currentMove < this.GameMoves.length) {
                    this.currentMove++
                    this.boardArray[move[1]][move[2]] = move[0] //https://www.red-bean.com/sgf/ff5/m_vs_ax.htm
                    // fetch("https://cors-proxy.htmldriven.com/?url=https://www.gokgs.com/json/access", {
                    //     method:'POST',
                    //     body:{
                    //         "type": "LOGIN",
                    //         "name": "maximich",
                    //         "password": "wq",
                    //         "locale": "en_US"
                    //     },
                    // }).then(response => console.log(response))
                    const dx = [1, 0, -1, 0, 0]
                    const dy = [0, -1, 0, 1, 0]
                    for (let i = 0; i < 5; i++) {
                        let x = move[1] + dx[i]
                        let y = move[2] + dy[i]
                        if ((0 <= x && x < this.boardArray.length) && 
                            (0 <= y && y < this.boardArray.length)) {
                            let prisonedGroup = findPrisonedGroup([x, y], this.boardArray, t)
                            
                            // console.log(`we visited ${[move[1]+dx[i], move[2]+dy[i]]}`)
                            for (let i = 0; i < prisonedGroup.length + 1; i++) {
                                for (let j = 0; j < prisonedGroup.length + 1; j++) {
                                    if (prisonedGroup[i][j]) {
                                        if (this.boardArray[i][j] != 0) {
                                            let side = move[0]*(i == 4 ? 1 : -1)
                                            this.prisonersAtMove[this.currentMove].push([side, i, j])                                        
                                        }
                                        this.boardArray[i][j] = 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        prevMove() {
            for (let t = 0; t < 1; t++) {
                if (this.currentMove > 0) {
                        this.prisonersAtMove[this.currentMove].forEach((prisoner) => {
                        this.boardArray[prisoner[1]][prisoner[2]] = prisoner[0]
                    })
                    this.currentMove--
                    const move = this.GameMoves[this.currentMove]
                    this.boardArray[move[1]][move[2]] = 0
                } else {
                    return
                }
            } 
        },
    }
}
</script>

<style lang="scss">
    .nextBtn {
        border-radius: 30px;
        background-image: url('../assets/next.svg');
        width: 32px;
        height: 32px;
        background-repeat: no-repeat;
        background-size: 32px 32px;
        border: none;
        outline: none;
        margin-top: 9px;
        margin-left: 10px; 
    }

    .prevBtn {
        border-radius: 30px;
        background-image: url('../assets/prev.svg');
        width: 32px;
        height: 32px;
        background-repeat: no-repeat;
        background-size: 32px 32px;
        border: none;
        outline: none;
        margin-top: 9px;
        margin-right: 10px;   
    }

    .prevBtn:hover {
        filter: brightness(90%);
    }

    .nextBtn:hover {
        filter: brightness(90%);
    }

    .wrapperGrids {
        margin: 15px;
    }

    .buttonBar {
        width: 100%;
        height: 50px;
        background: rgba(232, 232, 232, 0.9);
        border-radius: 0px 0px 26px 26px;
        justify-content: center;
    }

    .wrapperBoard {
        border: 3px solid white;
        border-radius: 30px;
        padding: 0;
        /*background-image: url('../assets/desk.png');
        background-repeat: no-repeat;
        background-size: 120% 120%;
        background-position: 10% 10%;*/
    }

    td, tr {
        height: 24px;
        width: 24px;
        padding: 0;
    }

    .background {
        /*отступ в половину размеров td, tr*/
        margin-left: 12px; 
        margin-top: 12px;
        display: block;  
        position: absolute;
        border-collapse: collapse;
        z-index: -1;
        padding: 0;
        td {
            border: 1px solid rgba(255, 255, 255, 0.75);
        }
    }

    .foreground {
        border-collapse: collapse;
        padding: 0;
        margin: 0;
        td {
            /*display: grid;*/
            /*place-items: center;*/
            /*border: 1px solid green;*/
            border: 1px solid transparent;
        }
    }

    .circle {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        display: inline-block;
    }
    .black {
        background: linear-gradient(135deg, #5B5B5B 0%, #272727 100%);
        box-shadow: -5px 5px 10px rgba(25, 25, 25, 0.2), 5px -5px 10px rgba(25, 25, 25, 0.2), -2px -1px 10px rgba(101, 101, 101, 0.5), 5px 5px 13px rgba(25, 25, 25, 0.9), inset 5px 5px 5px -1px rgba(101, 101, 101, 0.45), inset -5px -5px 5px -1px rgba(25, 25, 25, 0.5);
    }
    .white {
        background: linear-gradient(135deg, #FFFFFF 0%, #ADA8A8 100%);
        box-shadow: -3px 3px 6px rgba(101, 101, 101, 0.2), 3px -3px 6px rgba(101, 101, 101, 0.2), -2px -2px 10px rgba(255, 255, 255, 0.18), 5px 5px 13px rgba(25, 25, 25, 0.9), inset 5px 5px 5px -1px rgba(255, 255, 255, 0.3), inset -5px -5px 5px -1px rgba(101, 101, 101, 0.5);
    }
</style>