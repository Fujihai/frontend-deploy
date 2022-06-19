const fs = require("node:fs");
const http = require("node:http");

const server = http.createServer((req, res) => {
  fs.stat("./index.html", function (err, stats) {
    res.setHeader("Content-Length", stats.size);
    fs.createReadStream("./index.html").pipe(res);
  });
});

server.listen(3000, () => {
  console.log("Listening 3000...");
});
