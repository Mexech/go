const axios = require('axios')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const BASE_URL = "https://www.gokgs.com/json-cors/access"

var channelId = 0
var loadedArchives = []

function retry(maxRetries, fn) {
  return fn().catch(function(err) { 
    if (maxRetries <= 0) {
      throw err;
    }
    return retry(maxRetries - 1, fn); 
  });
}

const axiosInstance = axios.create({ baseURL: BASE_URL })
async function createSession(){
  const authParams = {
    "type": "LOGIN",
    "name": "maximich",
    "password": "wqta6v",
    "locale": "en_US"
  }
  const resp = await axios.post(BASE_URL, authParams)
  const cookie = resp.headers['set-cookie'][0].split(';')[0]
  axiosInstance.defaults.headers.Cookie = cookie

  var response = await axiosInstance.get()
  response.data.messages.forEach(message => {
    if (message?.type == 'ROOM_NAMES') {
      channelId = message.rooms[0].channelId
    }
  })
}

app.use(express.json())
app.use(cors())

app.get('/leaderboard', async (req, res) => {
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;
  const leaderboardResp = await axios.get("https://www.gokgs.com/top100.jsp")
  const { document } = (new JSDOM(leaderboardResp.data)).window
  let players = []
  document.querySelectorAll('a')?.forEach((playerEntry) => {
    if (playerEntry.textContent) {
      players.push(playerEntry.textContent)
    }
  })
  res.send({
    'players': players,
  })
  await createSession()
})

app.get('/archive/:username', async (req, res) => {
    const username = req.params.username
    let foundArchive = false
    loadedArchives.forEach(async (archive) => {
      if (username == Object.keys(archive)[0]) {
        foundArchive = true
        res.send({
          "games": Object.values(archive)[0]
        })
      }
    })
    if (!foundArchive){
      try {
        await axiosInstance.post("", {
          "type": "JOIN_ARCHIVE_REQUEST",
          "name": username
        })
      } catch(error) {
        await retry(5, createSession)
        await axiosInstance.post("", {
          "type": "JOIN_ARCHIVE_REQUEST",
          "name": username
        })
      }
      let response = await axiosInstance.get()
      response.data.messages?.forEach((message) => {
          if (message?.type == 'ARCHIVE_JOIN') {
            const games = message.games.slice(0, 2) 
            loadedArchives.push({[username]: games})
            res.send({
              "games": message.games.slice(0, 2)
            })
          }
      })
    }
})

app.get('/moves/:username/:number', async (req, res) => {
  async function fetchGame(timestamp, channelId) {
    var moves = []

    await axiosInstance.post("", {
      "type": "ROOM_LOAD_GAME",
      "timestamp": timestamp,
      "private": "true",
      "channelId": channelId
    })
    const sleep = m => new Promise(r => setTimeout(r, m))
    await sleep(50)
    const r = await axiosInstance.get()
    r.data.messages.forEach(message => {
      if (message?.type == 'GAME_JOIN'){
        message.sgfEvents.forEach(ev => {
          let coords = ev?.props?.[0]?.loc
          let color = ev?.props?.[0]?.color
          if (color && coords && coords != 'PASS') {
            moves.push([color=='white' ? 1 : -1, coords.y, coords.x])
          } 
        })
      }
    })
    return moves 
  }

  const username = req.params.username
  const number = Number(req.params.number)
  loadedArchives.forEach(async (archive) => {
    if (Object.keys(archive)[0] == username) {
      // console.log(Object.values(archive)[0][number])
      let timestamp = Object.values(archive)[0][number].timestamp
      const moves = await fetchGame(timestamp, channelId)
      res.send({
        moves: moves
      })
    }
  })
})


app.listen(port)
