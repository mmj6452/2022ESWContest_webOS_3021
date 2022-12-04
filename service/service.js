const pkgInfo = require("./package.json");
const Service = require("webos-service");
const cv = require("opencv.js");
const jpeg = require("jpeg-js");

const service = new Service(pkgInfo.name);
const logHeader = "[" + pkgInfo.name + "]";

const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const aWss = expressWs.getWss("/");
const port = 3000;

const hour = 1000;
const day = 1000;
const loopInterval = 1000;

const lowScalar = new cv.Scalar(30, 31, 31);
const highScalar = new cv.Scalar(90, 191, 191);

const W3CWebSocket = require("websocket").w3cwebsocket;
const serverUrl = "ws://riumaqua.dabyeol.com:3001";
let client;

const data = {
  temperature: 30,
  turbidity: 70,
  feed: 10,
  illuminance: 10,
  waterChange: 14,
};

let userTemperature = 26;
let waterCycle = 14;
let feedingInterval = 8;
let lighting = 1;
let image;
let imageBuffer;

app.use(function (req, res, next) {
  console.log("middleware");
  req.testing = "testing";
  return next();
});

app.ws("/", function (ws, req) {
  console.log("Connected.");
  ws.on("message", (message) => {
    console.log("Received: ", message);

    let isBinary = false;
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      isBinary = true;
    }

    if (isBinary) {
      imageBuffer = message;
      image = message.toString("base64");
    } else {
      if (msg.msgType === "sendValue") {
        if (msg.deviceType === "data") {
          data.temperature = msg.temperature;
          data.illuminance = msg.illuminance;
        }
      }
    }
  });
});

const feed = () => {
  if (data.feed) {
    data.feed--;

    // Feeder
    const command = {
      msgType: "command",
      deviceType: "feeder",
      status: 1,
    };
    broadCastMessage(JSON.stringify(command));
  }

  setTimeout(feed, feedingInterval * hour);
};

const filter = () => {
  if (data.waterChange) data.waterChange--;
  command = {
    msgType: "command",
    deviceType: "filter",
    status: data.waterChange ? 1 : 0,
  };
  broadCastMessage(JSON.stringify(command));
};

const getTurbidity = () => {
  const rawImageData = jpeg.decode(imageBuffer);
  const src = cv.matFromImageData(rawImageData);
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);

  let hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV);

  let dst = new cv.Mat();
  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), lowScalar);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), highScalar);
  cv.inRange(hsv, low, high, dst);

  let rgbaPlanes = new cv.MatVector();
  cv.split(src, rgbaPlanes);

  let srcG = rgbaPlanes.get(1);
  let dstG = new cv.Mat();
  cv.bitwise_and(srcG, dst, dstG);

  const result = cv.mean(dstG);

  return Number.parseFloat(result).toFixed(0);
};

const loop = () => {
  // Heater
  let command = {
    msgType: "command",
    deviceType: "heater",
    status: data.temperature < userTemperature,
  };
  broadCastMessage(JSON.stringify(command));

  // Turbidity
  if (imageBuffer) {
    data.turbidity = getTurbidity();
  }

  // TODO: Client
  if (client) {
    const msg = {
      msgType: "data",
      value: data,
    };
    client.send(JSON.stringify(msg));
  }
};

const broadCastMessage = (message) => {
  aWss.clients.forEach(function (client) {
    try {
      client.send(message);
    } catch (e) {
      console.log(e);
    }
  });
};

// Start websocket server and connect
service.register("startServer", (msg) => {
  // Server
  console.log("Starting...");
  app.listen(port);
  console.log("Started.");

  setTimeout(feed, feedingInterval * hour);
  setInterval(loop, loopInterval);
  setInterval(filter, day);

  // Client
  client = new W3CWebSocket(serverUrl);

  client.onerror = function () {
    console.log("Connection Error");
  };

  client.onopen = function () {
    console.log("WebSocket Client Connected");
  };

  client.onclose = function () {
    console.log("echo-protocol Client Closed");
  };

  client.onmessage = function (e) {
    if (typeof e.data === "string") {
      console.log("Received: '" + e.data + "'");
    }
  };

  // Subscribe heartbeat
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  sub.addListener("response", (msg) => {
    console.log(JSON.stringify(msg.payload));
  });

  // Response
  msg.respond({
    returnValue: true,
    Response: "Server started.",
  });
});

service.register("getData", (msg) => {
  msg.respond({
    returnValue: true,
    data: data,
  });
});

// 먹이
service.register("resetFeed", (msg) => {
  data.feed = 100;
  msg.respond({
    returnValue: true,
  });
});

service.register("getFeedingInterval", (msg) => {
  msg.respond({
    returnValue: true,
    data: feedingInterval,
  });
});

service.register("setFeedingInterval", (msg) => {
  feedingInterval = msg.payload.value;
  msg.respond({
    returnValue: true,
  });
});

// 탁도, 물갈이
service.register("resetWaterChange", (msg) => {
  data.waterChange = waterCycle;
  msg.respond({
    returnValue: true,
  });
});

service.register("getWaterCycle", (msg) => {
  msg.respond({
    returnValue: true,
    data: waterCycle,
  });
});

service.register("setWaterCycle", (msg) => {
  waterCycle = msg.payload.value;
  msg.respond({
    returnValue: true,
  });
});

// 수온
service.register("getUserTemperature", (msg) => {
  msg.respond({
    returnValue: true,
    data: userTemperature,
  });
});

service.register("setUserTemperature", (msg) => {
  userTemperature = msg.payload.value;
  msg.respond({
    returnValue: true,
  });
});

// 조명
service.register("getLighting", (msg) => {
  msg.respond({
    returnValue: true,
    data: lighting,
  });
});

service.register("setLighting", (msg) => {
  lighting = msg.payload.value;

  const command = {
    msgType: "command",
    deviceType: "lighting",
    status: lighting,
  };

  broadCastMessage(JSON.stringify(command));

  msg.respond({
    returnValue: true,
  });
});

// 영상
service.register("getImage", (msg) => {
  msg.respond({
    returnValue: true,
    data: image,
  });
});

// Heartbeat Service
{
  const subscriptions = {};
  let interval;
  let x = 1;
  function createInterval() {
    if (interval) {
      return;
    }
    console.log(logHeader, "create_interval");
    console.log("create new interval");
    interval = setInterval(function () {
      sendResponses();
    }, 1000);
  }

  function sendResponses() {
    console.log(logHeader, "send_response");
    console.log(
      "Sending responses, subscription count=" +
        Object.keys(subscriptions).length
    );
    for (const i in subscriptions) {
      if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
        const s = subscriptions[i];
        s.respond({
          returnValue: true,
          event: "beat " + x,
        });
      }
    }
    x++;
  }

  service.register(
    "heartbeat",
    function (message) {
      const uniqueToken = message.uniqueToken;
      console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
      console.log(
        "heartbeat callback, uniqueToken: " +
          uniqueToken +
          ", token: " +
          message.token
      );
      message.respond({ event: "beat" });
      if (message.isSubscription) {
        subscriptions[uniqueToken] = message;
        if (!interval) {
          createInterval();
        }
      }
    },
    function (message) {
      const uniqueToken = message.uniqueToken;
      console.log("Canceled " + uniqueToken);
      delete subscriptions[uniqueToken];
      const keys = Object.keys(subscriptions);
      if (keys.length === 0) {
        console.log("no more subscriptions, canceling interval");
        clearInterval(interval);
        interval = undefined;
      }
    }
  );
}
