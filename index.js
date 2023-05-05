const http = require("http");
const fs = require("fs");
const readline = require("readline");

let TEMPLATE_PATH = null;
let DATA_PATH = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the path to a template file: ", (input) => {
  TEMPLATE_PATH = input;
  rl.question("Enter the path to a data file: ", (input) => {
    DATA_PATH = input;
    runServer();
  });
});

function runServer() {
  const port = 3000;

  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      fs.readFile(TEMPLATE_PATH, (err, buffer) => {
        if (err) {
          throw err;
        }

        const template = buffer.toString();

        fs.readFile(DATA_PATH, (err, buffer) => {
          if (err) {
            throw err;
          }

          const data = JSON.parse(buffer.toString());
          const keys = Object.keys(data);

          let html = template;

          keys.forEach((key) => {
            html = html.replaceAll(`{{${key}}}`, data[key]);
          });

          res.writeHead(200, { "Content-type": "text/html" });
          res.end(html);
        });
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(port, () => {
    console.log(
      `Server have been started...Example app listening on port ${port}`
    );
  });
}
