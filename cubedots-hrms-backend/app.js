const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes");
const morgan = require("morgan");
const { SERVER_PORT, NODE_ENV, FE_URL } = require("./config/config");
const { redisClient } = require("./src/common/helpers/redisClient");
const network_url = "192.168.0.68:3002";
const path = require("path");
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../cubedots-hrms-ui/build");

// Connect to mongodb
require("./db");
redisClient.connect();
const app = express();
app.use(express.static(buildPath));
app.get("/", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../cubedots-hrms-ui/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin, X-Requested-With, Accept"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
    return;
  }
  console.log(`App is running on port ${SERVER_PORT}`); // eslint-disable-line no-console
});

module.exports = app;
