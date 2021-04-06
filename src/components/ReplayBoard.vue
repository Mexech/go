<template>
  <div class="wrapperBoard">
    <span class="current-move" v-if="currentMove">Ход {{currentMove}}</span>
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
        <button v-if="!loading" @click="prevMove" class="prev btn"></button>
        <button v-if="!loading" @click="nextMove" class="next btn"></button>
        <loader class="center" v-else/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import loader from './pulsatingLoader.vue'

export default {
    props: {
        username: String,
        number: Number
    },
    components: {
      loader,
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
        var self = this
        this.loading = true
        axios.get(`http://localhost:3000/moves/${this.username}/${this.number}`).then(res => {
            self.GameMoves = res.data.moves
            self.prisonersAtMove = Array.from(Array(self.GameMoves.length+1), () => new Array().fill())
            self.loading = false
        })
    },
    methods: {
        nextMove() {
            function findPrisonedGroup(move, boardArray) {
                const dx = [1, 0, -1, 0]
                const dy = [0, -1, 0, 1]
                var stack = []
                var visited = Array.from(Array(19), () => new Array(19).fill(false))
                stack.push([move[0], move[1]])
                // var i = 0 
                while (stack.length) {
                    let node = stack.pop();                
                    if (visited[node[0]][node[1]] == false) {
                        visited[node[0]][node[1]] = true
                        for (let i = 0; i < 4; i++) {
                            try {
                                if ((0 <= node[0] + dx[i] && node[0] + dx[i] < visited.length) && 
                                   (0 <= node[1] + dy[i] && node[1] + dy[i] < visited.length)) {
                                    let nextValOnBoard = boardArray[node[0]+dx[i]][node[1]+dy[i]]
                                    let currentValOnBoard = boardArray[node[0]][node[1]] 
                                    if (!nextValOnBoard) { //found liberty
                                        return Array.from(Array(19), () => new Array(19).fill(false))
                                    } else if (nextValOnBoard == currentValOnBoard){
                                        stack.push([node[0] + dx[i], node[1] + dy[i]])
                                    } 
                                } 
                            } catch(error) {
                                console.log(node[0]+dx[i], node[1]+dy[i])
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
                            for (let i = 0; i < prisonedGroup.length; i++) {
                                for (let j = 0; j < prisonedGroup.length; j++) {
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
    .btn {
        border-radius: 30px;
        width: 40px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 40px 40px;
        border: none;
        outline: none;
        margin-top: 6px;
        margin-left: 10px;
        &.next {
            background-image: url('../assets/next.svg');
        }
        &.prev {
            background-image: url('../assets/prev.svg');
        }
    }

    .btn:hover {
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
        height: 40px;
        width: 40px;
        padding: 0;
    }

    .background {
        /*отступ в половину размеров td, tr*/
        margin-left: 20px; 
        margin-top: 20px;
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
            border: 1px solid transparent;
        }
    }

    .circle {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        display: inline-block;
    }
    .black {
        background: #272727;
        // background: linear-gradient(135deg, #5B5B5B 0%, #272727 100%);
        // box-shadow: -5px 5px 10px rgba(25, 25, 25, 0.2), 5px -5px 10px rgba(25, 25, 25, 0.2), -2px -1px 10px rgba(101, 101, 101, 0.5), 5px 5px 13px rgba(25, 25, 25, 0.9), inset 5px 5px 5px -1px rgba(101, 101, 101, 0.45), inset -5px -5px 5px -1px rgba(25, 25, 25, 0.5);
    }
    .white {
        background: #FFFFFF;
        // background: linear-gradient(135deg, #FFFFFF 0%, #ADA8A8 100%);
        // box-shadow: -3px 3px 6px rgba(101, 101, 101, 0.2), 3px -3px 6px rgba(101, 101, 101, 0.2), -2px -2px 10px rgba(255, 255, 255, 0.18), 5px 5px 13px rgba(25, 25, 25, 0.9), inset 5px 5px 5px -1px rgba(255, 255, 255, 0.3), inset -5px -5px 5px -1px rgba(101, 101, 101, 0.5);
    }
    .center {
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
    .current-move{
        position:absolute;
        font-size: 2rem;
        left: 0; 
        right: 0; 
        margin-left: auto; 
        margin-right: auto; 
    }
</style>