const pkgInfo = require("./package.json");
const Service = require("webos-service");

const service = new Service(pkgInfo.name);
const logHeader = "[" + pkgInfo.name + "]";

service.register("init", () => {
  // Open GPIO
  let url = "luna://com.webos.service.peripheralmanager/gpio/open";
  let params = {
    pin: "gpio4",
  };
  service.call(url, params, (m2) => {
    console.log(logHeader, m2);
  });

  // Init GPIO
  url = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  params = {
    pin: "gpio4",
    direction: "outLow",
  };
  service.call(url, params, (m2) => {
    console.log(logHeader, m2);
  });
});

service.register("setLedState", (msg) => {
  const url = "luna://com.webos.service.peripheralmanager/gpio/setValue";
  const params = {
    pin: "gpio4",
    value: msg.payload.value ? "high" : "low",
  };
  service.call(url, params, (m2) => {
    console.log(logHeader, m2);
    msg.respond({
      returnValue: m2.payload.returnValue,
      Response: m2.payload.errorText,
    });
  });
});

service.register("getCdsState", (msg) => {});

service.register("loop", (message) => {
  // Set interval
  const interval = setInterval(() => {
    // loop
  });

  // Subscribe heartbeat
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  sub.addListener("response", (msg) => {
    console.log(JSON.stringify(msg.payload));
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
