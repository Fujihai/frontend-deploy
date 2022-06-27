// Native - Node built-in module
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");

// Packages
const arg = require("arg");
const chalk = require("chalk");

var config = {
  entry: "",
  rewrites: [],
  redirects: [],
  etag: false,
  cleanUrls: false,
  trailingSlash: false,
  symlink: false,
};

/**
 * eg: --port <string> or --port=<string>
 * node advance.js -p 3000 | node advance.js --port 3000
 */
const args = arg({
  "--port": Number,
  "--entry": String,
  "--rewrite": Boolean,
  "--redirect": Boolean,
  "--etag": Boolean,
  "--cleanUrls": Boolean,
  "--trailingSlash": Boolean,
  "--symlink": Boolean,
});

const resourceNotFound = (response, absolutePath) => {
  response.statusCode = 404;
  fs.createReadStream(path.join("./html", "404.html")).pipe(response);
};

const processDirectory = async (absolutePath) => {
  const newAbsolutePath = path.join(absolutePath, "index.html");

  try {
    const newStat = await fsp.lstat(newAbsolutePath);
    return [newStat, newAbsolutePath];
  } catch (e) {
    return [null, newAbsolutePath];
  }
};

/**
 * @param { http.IncomingMessage } req
 * @param { http.ServerResponse } res
 * @param { config } config
 */
const handler = async (request, response, config) => {
  // 从 request 中获取 pathname
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;

  // 获取绝对路径
  let absolutePath = path.resolve(
    config["--entry"] || "",
    path.join(".", pathname)
  );

  let statusCode = 200;
  let fileStat = null;

  // 获取文件状态
  try {
    fileStat = await fsp.lstat(absolutePath);
  } catch (e) {
    // console.log(chalk.red(e));
  }

  if (fileStat?.isDirectory()) {
    [fileStat, absolutePath] = await processDirectory(absolutePath);
  }

  if (fileStat === null) {
    return resourceNotFound(response, absolutePath);
  }

  let headers = {
    "Content-Length": fileStat.size,
  };

  response.writeHead(statusCode, headers);

  fs.createReadStream(absolutePath).pipe(response);
};

const startEndpoint = (port, config) => {
  const server = http.createServer((request, response) => {
    // console.log("request: ", request);
    handler(request, response, config);
  });

  server.on("error", (err) => {
    const { code, port } = err;
    if (code === "EADDRINUSE") {
      console.log(chalk.red(`address already in use [:::${port}]`));
      console.log(chalk.green(`Restart server on [:::${port + 1}]`));
      startEndpoint(port + 1, entry);
      return;
    }
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(chalk.green(`Open http://localhost:${port}`));
  });
};

startEndpoint(args["--port"] || 3000, args);
