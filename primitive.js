const http = require("http");
const fs = require("fs");
const url = require("url");

const onRequest = (req, res) => {
  const cars = fs.readFileSync("cars.json", "utf-8");
  const q = url.parse(req.url, true).query;
  const dataParser = JSON.parse(cars);

  try {
    console.log(q);
    
    const search = q.name
      ? dataParser.cars.find((el) => (el.name = q.name))
      : dataParser;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(search));
  } catch (err) {
    console.log(err);
  }
  res.end();
};

const server = http.createServer(onRequest);
server.listen(3000);

