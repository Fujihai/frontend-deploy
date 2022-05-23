const fs = require("node:fs");
const html = fs.readFileSync("./index.html");
const http = require("node:http");
const server = http.createServer((req, res) => {
  res.end(html);
});

server.listen(3000, () => {
  console.log("Listening 3000...");
});
