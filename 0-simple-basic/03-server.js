const fs = require("node:fs");
const http = require("node:http");
var data = "";

const readStream = fs.createReadStream("./index.html");

readStream.on("data", function (chunk) {
  data += chunk;
});

const server = http.createServer((req, res) => {
  if (data) {
    res.setHeader("Content-Length", data.length);
    res.end(data);
  }
});

server.listen(3000, () => {
  console.log("Listening 3000...");
});
