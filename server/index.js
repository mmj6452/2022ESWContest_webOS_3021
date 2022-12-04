var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
const aWss = expressWs.getWss("/");
const port = 3001;

app.use(function (req, res, next) {
  console.log("middleware");
  req.testing = "testing";
  return next();
});

// app.get("/", function (req, res, next) {
//   console.log("get route", req.testing);
//   res.end();
// });

app.ws("/", function (ws, req) {
  console.log("Connected.");
  ws.on("message", function (msg) {
    console.log(msg);
    broadCastMessage(msg);
  });
  // console.log("socket", req.testing);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

const broadCastMessage = (message) => {
  aWss.clients.forEach(function (client) {
    try {
      client.send(message);
    } catch (e) {
      console.log(e);
    }
  });
};
