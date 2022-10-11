const pkgInfo = require("./package.json");
const Service = require("webos-service");
const cv = require("opencv.js");

const service = new Service(pkgInfo.name);
const logHeader = "[" + pkgInfo.name + "]";

const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const aWss = expressWs.getWss("/");
const port = 3000;

const imageWidth = 480;
const imageHeight = 320;

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
let rawImage = null;
let image;

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
      rawImage = {
        width: imageWidth,
        height: imageHeight,
        data: message,
      };
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

  setTimeout(feed, feedingInterval * 1000);
};

const loop = () => {
  // Heater
  let command = {
    msgType: "command",
    deviceType: "heater",
    status: data.temperature < userTemperature,
  };
  broadCastMessage(JSON.stringify(command));

  // Filter
  if (data.waterChange) data.waterChange--;
  command = {
    msgType: "command",
    deviceType: "filter",
    status: data.waterChange ? 1 : 0,
  };
  broadCastMessage(JSON.stringify(command));

  // Turbidity
  if (rawImage) {
    const src = cv.matFromImageData(rawImage);
    let hsv = new cv.Mat();
    cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV);
    let dst = new cv.Mat();
    const lowScalar = new cv.Scalar(40, 10, 10, 0);
    const highScalar = new cv.Scalar(80, 200, 255, 255);
    const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), lowScalar);
    const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), highScalar);
    cv.inRange(hsv, low, high, dst);
    data.turbidity = (
      (cv.countNonZero(dst) / (dst.rows * dst.cols)) *
      10000
    ).toFixed(0);
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

// Start websocket server
service.register("startServer", (msg) => {
  console.log("Starting...");
  app.listen(port);
  console.log("Started.");

  setTimeout(feed, feedingInterval * 1000);
  setInterval(loop, 1000);

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

  // TODO: Lighting
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
