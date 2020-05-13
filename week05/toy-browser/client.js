const net = require('net');

class Request {
  constructor(options) {
    this.method = options.method || "GET"
    this.host = options.host
    this.port = options.port || '8080'
    this.path = options.path || '/'
    this.headers = options.headers || {}
    this.body = options.body || {}
    this.bodyText = ''

    if (this.headers["Content-Type"] === undefined) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded"
    }

    if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.body[key])}`).join("&")
    } else if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body)
    }

    this.headers["Content-Length"] = this.bodyText.length
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}
\r
${this.bodyText}`
  }

  send(client) {
    if (client) {
      client.write(this.toString())
    } else {
      const responseParser = new ResponseParser()
      return new Promise((resolve, reject) => {
        client = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          client.write(this.toString())
        });
        client.on('data', (data) => {
          responseParser.receive(data.toString())
          // resolve(data.toString());
          if(responseParser.isFinished){
            resolve(responseParser.response)
          }
          client.end();
        });
        client.on('error', (error) => {
          reject(error)
          client.end()
        });
      })

    }
  }
}


class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7

    this.current = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''

    this.bodyParser = null
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 (\d+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content
    }
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    }
    else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    }
    else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        this.bodyParser = new TrunkBody()
      } else {
        this.headerName += char
      }
    }
    else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    }
    else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ""
        this.headerValue = ""
      } else {
        this.headerValue += char
      }
    }
    else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    }
    else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY
      }
    }
    else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}


class TrunkBody {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LENGTH = 3
    this.WAITING_NEW_LENGTH_END = 4,
    this.BODY_END = 5

    this.current = this.WAITING_LENGTH
    this.length = 0
    this.content = ''
    this.isFinished = false
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        this.current = this.WAITING_LENGTH_END
        if(this.length === 0){
          this.isFinished = true
          this.current = this.BODY_END
        }
      } else {
        this.length *= 10
        this.length += Number(char)
      }
    }
    else if(this.current === this.WAITING_LENGTH_END){
      if (char === '\n') {
        this.current = this.READING_TRUNK
      }
    }
    else if(this.current === this.READING_TRUNK){
      this.content += char
      this.length--
      if(this.length===0){
        this.current = this.WAITING_NEW_LENGTH
      }
    }
    else if(this.current === this.WAITING_NEW_LENGTH){
      if (char === '\r') {
        this.current = this.WAITING_NEW_LENGTH_END
      } 
    }
    else if(this.current === this.WAITING_NEW_LENGTH_END){
      if (char === '\n') {
        this.current = this.WAITING_LENGTH
      } 
    }
  }
}



void async function () {
  const request = new Request({
    method: 'POST',
    host: "127.0.0.1",
    port: 8088,
    path: '/',
    headers: {
      "X-Foo": "11111"
    },
    body: { name: 'winter' }
  })

  const response = await request.send()
  console.log(response)
}()


