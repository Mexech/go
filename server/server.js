const http = require('http')
const axios = require('axios')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello Worasdasdasdd')
})

server.listen(port, hostname, () => {
  const BASE_URL = "https://www.gokgs.com/json-cors/access"

  const axiosInstance = axios.create({ baseURL: BASE_URL })
  const createSession = async () => {
    const authParams = {
      "type": "LOGIN",
      "name": "maximich",
      "password": "wqta6v",
      "locale": "en_US"
    }
    const resp = await axios.post(BASE_URL, authParams)
    const cookie = resp.headers['set-cookie'][0].split(';')[0]
    axiosInstance.defaults.headers.Cookie = cookie
  }

  createSession().then(() => {
    // console.log(axiosInstance)
    axiosInstance.get()
    .then(response => {
      var channelId = 0
      response.data.messages.forEach(message => {
        if (message?.type == 'ROOM_NAMES') {
          channelId = message.rooms[0].channelId
        }
      })
      axiosInstance.post("", {
        "type": "JOIN_ARCHIVE_REQUEST",
        "name": "larc"
      })
      axiosInstance.get().then(response => {
        response.data.messages.forEach(message => {
          var channelId = 0
          if (message?.type == 'ROOM_NAMES') {
            // console.log(message)
            channelId = message.rooms.channelId
          }
          if (message?.type == 'ARCHIVE_JOIN') {
            let timestamp = message.games[0].timestamp
            console.log(timestamp)
            console.log(channelId)
            axiosInstance.post("", {
              "type": "ROOM_LOAD_GAME",
              "timestamp": timestamp,
              "private": "true",
              "channelId": channelId
            }).then(() => {
              axiosInstance.get().then(r => r.data.messages.forEach(message => {
                if (message?.type == 'GAME_LIST'){
                  console.log(message.games[0])
                }
              }))
            })
          }
        })
      })
    })
  })
})
    // axiosInstance.post("", {
    //   "callbackKey":123213,
    //   "type": "CREATE_ROOM_REQUEST",
    //   "name": "test123456789",
    //   "description": "",
    //   "category": "TEMPORARY",
    //   "locale": "en_US",
    //   "private":"true",
    //   "tournOnly":"false",
    //   "globalOnly":"false"
    // }).then(() => axiosInstance.get().then(response => {
    //   response.data.messages.forEach(message => {
    //     if (message?.type == 'ROOM_JOIN' && message?.users[0].name == 'maximich') {
    //       var channelId = message.channelId
    //       axiosInstance.post("", {
    //         "type": "JOIN_ARCHIVE_REQUEST",
    //         "name": "larc"
    //       })
    //       axiosInstance.get().then(response => {
    //         response.data.messages.forEach(message => {
    //           if (message?.type == 'ARCHIVE_JOIN') {
    //             let timestamp = message.games[0].timestamp
    //             console.log(timestamp)
    //             axiosInstance.post("", {
    //               "type": "ROOM_LOAD_GAME",
    //               "timestamp": timestamp,
    //               "private": "true",
    //               "channelId": 31
    //             })
    //             axiosInstance.get().then(r => console.log(r.data.messages[0]))
    //           }
    //         })
    //       })
    //     }
    //   })
    // }))
    // axiosInstance.get()//.then(response => console.log(response.data.messages))
    // axiosInstance.post("", {
    //   "type": "JOIN_ARCHIVE_REQUEST",
    //   "name": "larc"
    // })
    
    
    // // .then(response => console.log(response.data.messages))
    // axiosInstance.get().then(response => {
    //   response.data.messages.forEach(message => {
    //     var channelId = 0
    //     if (message?.type == 'ROOM_NAMES') {
    //       // console.log(message)
    //       channelId = message.rooms.channelId
    //     }
    //     if (message?.type == 'ARCHIVE_JOIN') {
    //       let timestamp = message.games[0].timestamp
    //       console.log(timestamp)
    //       console.log(channelId)
    //       // axiosInstance.post("", {
    //       //   "type": "ROOM_LOAD_GAME",
    //       //   "timestamp": timestamp,
    //       //   "private": "true",
    //       //   "channelID": 31
    //       // })
    //       // axiosInstance.get().then(r => console.log(r.data))
    //     }
    //   })
      
    // })
  // })
  // axios.post("https://www.gokgs.com/json-cors/access", {
  //         "type": "LOGIN",
  //         "name": "maximich",
  //         "password": "wqta6v",
  //         "locale": "en_US",
  //         withCredentials: true
  //       }).then( resp => {
  //   console.log(resp.headers['set-cookie'][0].split(';')[0])
  //   axios.get("https://www.gokgs.com/json-cors/access", {withCredentials: true})
  //   // }, {withCredentials: true})
  //     .then(response => console.log(response.headers['set-cookie'][0].split(';')[0]))
  //   // if (resp.data == 'OK') {
      
  //   // }
  // })
  
  // console.log(`Server running at http://${hostname}:${port}/`)
// })