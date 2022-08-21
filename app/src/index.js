/* global ENACT_PACK_ISOMORPHIC */
import { createRoot, hydrateRoot } from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();
const serviceUrl = "luna://com.dabyeol.riumaqua.service";

// Init
const request = {
  service: serviceUrl,
  method: "init",
  parameters: {},
  onSuccess: () => {
    console.log("success - init");
  },
  onFailure: (e) => {
    console.log("failure - init " + e.returnValue);
  },
};
bridge.send(request);

const appElement = <App />;

// In a browser environment, render instead of exporting
if (typeof window !== "undefined") {
  if (ENACT_PACK_ISOMORPHIC) {
    hydrateRoot(document.getElementById("root"), appElement);
  } else {
    createRoot(document.getElementById("root")).render(appElement);
  }
}

export default appElement;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
// Learn more: https://github.com/enactjs/cli/blob/master/docs/measuring-performance.md
reportWebVitals();
