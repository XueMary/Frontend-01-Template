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
    } else if(this.headers["Content-Type"] === "application/json") {
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

  send(client){
    if(client){
      client.write(this.toString())
    }else{ 

      return new Promise((resolve, reject) => {
        client = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          client.write(this.toString())
        });
        client.on('data', (data) => {
          resolve(data.toString());
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

void async function() {
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


