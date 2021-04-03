<template>
  <!-- <h1>{{currentMove}}</h1> -->
  <table class="background">
      <tr v-for="(row, i) in boardArray.length-1" :key="i">
          <td style="border: 1px solid black;" v-for="(col, j) in boardArray[i].length-1" :key="j"></td>
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
  <button @click="prevMove">Prev Move</button>
  <button @click="nextMove">Next Move</button>
</template>

<script>
export default {
    data() {
        return {
            GameMoves: [],
            currentMove: 0,
            boardArray: Array.from(Array(19), () => new Array(19).fill(0)),
            prisonersAtMove: [],
        }
    },
    mounted() {
        let xhr = new XMLHttpRequest()
        var self = this
        xhr.open('GET', 'https://cors-anywhere.herokuapp.com/http://files.gokgs.com/games/2021/1/26/larc-HiraBot44.sgf');
        xhr.send()
        xhr.onload = function() {
            if (xhr.status != 200) { 
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`)
            } else {
                var data = xhr.response
                data = data.split(';')
                data.shift()
                const matchInfo = data.shift()
                console.log(matchInfo)
                for (let rawMove of data) {
                    var rawCoord = rawMove.slice(rawMove.indexOf('[')+1, rawMove.indexOf(']'))
                    self.GameMoves.push([rawMove[0] == 'W' ? 1 : -1, rawCoord.charCodeAt(1) - 97, rawCoord.charCodeAt(0) - 97])
                }
                self.prisonersAtMove = Array.from(Array(self.GameMoves.length+1), () => new Array().fill())
            }
        }
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
    td, tr {
        height: 32px;
        width: 32px;
    };
    .background {
        margin-top: 16px;
        margin-left: 18px;
        position: absolute;
        border-collapse: collapse;
        z-index: -1;
        padding: 0;
        td {
            border: 1px solid black;
        }
    };
    .foreground {
        border-collapse: collapse;
        padding: 0;
        td {
            // display: grid;
            // place-items: center;
            border: 1px solid transparent;
        }
    };
    .circle {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        display: inline-block;
    }
    .black {
        background-color: #000;
    }
    .white {
        background-color: #fff;
    }
</style>