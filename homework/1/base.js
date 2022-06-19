const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");

const server = http.createServer(async (req, res) => {
  const stat = await fsp.stat("./index.html");
  res.setHeader("content-length", stat.size);
  fs.createReadStream("./index.html").pipe(res);
});

server.listen(3000, () => {
  console.log("Listening 3000...");
});
